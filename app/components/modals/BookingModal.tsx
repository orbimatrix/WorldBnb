"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Listing {
    id: string;
    title: string;
    price_per_night: number;
    location: string;
    country: string;
}

interface BookingModalProps {
    listing: Listing;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ listing, isOpen, onClose }: BookingModalProps) {
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // Simplified price calculation
    const nights = (checkIn && checkOut) 
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
        : 0;
    
    const subtotal = Math.max(0, nights) * listing.price_per_night;
    const cleaningFee = 50;
    const serviceFee = Math.round(subtotal * 0.14);
    const totalPrice = subtotal + cleaningFee + serviceFee;

    const handleBooking = async () => {
        if (!checkIn || !checkOut) {
            toast.error("Please select dates");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/payments/create-checkout", {
                listingId: listing.id,
                checkIn,
                checkOut,
                guests,
                totalPrice
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900">Book your stay</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
                        <div className="w-12 h-12 bg-[#FFF0ED] rounded-xl flex items-center justify-center text-2xl shrink-0">🏡</div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">{listing.title}</p>
                            <p className="text-xs text-gray-400">{listing.location}, {listing.country}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Check-in</label>
                            <input 
                                type="date" 
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Check-out</label>
                            <input 
                                type="date" 
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider ml-1">Guests</label>
                        <select 
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all appearance-none bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>${listing.price_per_night} x {nights} nights</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Cleaning fee</span>
                            <span>${cleaningFee}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Rentora service fee</span>
                            <span>${serviceFee}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between">
                            <span className="font-black text-slate-900">Total</span>
                            <span className="font-black text-[#FF6B4A] text-lg">${totalPrice}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleBooking}
                        disabled={loading || nights <= 0}
                        className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#E55C3D] hover:shadow-xl text-white font-black py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Redirecting..." : `Confirm & Pay`}
                    </button>
                    <p className="text-[10px] text-center text-gray-400">You won't be charged yet in this demo (Stripe Sandbox)</p>
                </div>
            </div>
        </div>
    );
}
