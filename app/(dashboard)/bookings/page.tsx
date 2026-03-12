"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Listing {
    id: string;
    title: string;
    image_url: string;
    location: string;
}

interface Booking {
    id: string;
    listing_id: string;
    check_in: string;
    check_out: string;
    total_price: number;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
    confirmation_code: string;
    listings: Listing;
}

const STATUS_STYLES: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    pending: "bg-amber-100 text-amber-700",
};

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

export default function BookingsPage() {
    const [filter, setFilter] = useState<Filter>("All");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const statusParam = filter === "All" ? "all" : filter.toLowerCase();
            const response = await axios.get(`/api/bookings?status=${statusParam}`);
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.patch(`/api/bookings/${id}`, { status: 'cancelled' });
            setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
            toast.success("Booking cancelled");
        } catch (error) {
            console.error("Error cancelling booking:", error);
            toast.error("Failed to cancel booking");
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-sm font-bold px-4 py-2 rounded-full transition-all ${filter === f
                                ? "bg-[#FF6B4A] text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-[#FFAA99]"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-gray-500 text-sm">No bookings found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100 bg-[#FFF0ED]">
                                    <img 
                                        src={b.listings.image_url && b.listings.image_url.startsWith('http') ? b.listings.image_url : `/images/${b.listings.image_url?.split('/').pop()?.replace('.jpg', '.png') || 'placeholder.jpg'}`} 
                                        alt={b.listings.title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1080';
                                        }}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-black text-slate-900">{b.listings.title}</h3>
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">{b.listings.location}</p>
                                    <p className="text-xs text-gray-400">
                                        {format(new Date(b.check_in), "MMM dd")} – {format(new Date(b.check_out), "MMM dd, yyyy")} · #{b.confirmation_code}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right text-sm">
                                    <div className="text-lg font-black text-slate-900">${b.total_price}</div>
                                    <div className="text-gray-400 text-xs mt-0.5 whitespace-nowrap">Total paid</div>
                                    {b.status === "upcoming" && (
                                        <button 
                                            onClick={() => handleCancel(b.id)}
                                            className="mt-3 text-[11px] font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-100 px-3 py-1.5 rounded-xl transition-all block w-full text-center"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
