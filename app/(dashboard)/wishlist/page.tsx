"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BookingModal from "@/app/components/modals/BookingModal";

interface Listing {
    id: string;
    title: string;
    location: string;
    country: string;
    price_per_night: number;
    rating: number;
    review_count: number;
    image_url: string;
    category: string;
}

interface WishlistItem {
    id: string;
    listing_id: string;
    listings: Listing;
}

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get("/api/wishlist");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (listingId: string) => {
        try {
            await axios.delete(`/api/wishlist/${listingId}`);
            setItems((prev) => prev.filter((item) => item.listing_id !== listingId));
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove item");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-gray-500 text-sm">
                {items.length} saved listing{items.length !== 1 ? "s" : ""}
            </p>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100">
                    <div className="text-6xl mb-4">💔</div>
                    <h3 className="font-black text-slate-900 text-xl mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">Save listings you love by tapping the ❤️ icon.</p>
                    <a href="/" className="inline-block bg-[#FF6B4A] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#E55A3D] transition-all">
                        Browse Listings
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item) => {
                        const listing = item.listings;
                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                                {/* Image placeholder */}
                                <div className="relative h-44 bg-gradient-to-br from-[#FFF0ED] to-pink-50 flex items-center justify-center">
                                    <span className="text-6xl">{listing.image_url}</span>
                                    {/* Remove from wishlist */}
                                    <button
                                        onClick={() => handleRemove(listing.id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#FF6B4A] hover:text-gray-400 shadow-md transition-colors"
                                        aria-label="Remove from wishlist"
                                    >
                                        ❤️
                                    </button>
                                    <span className="absolute top-3 left-3 bg-white text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {listing.category}
                                    </span>
                                </div>
                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 text-sm leading-snug mb-1 group-hover:text-[#FF6B4A] transition-colors">{listing.title}</h3>
                                    <p className="text-xs text-gray-400 mb-3">{listing.location}, {listing.country}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-black text-slate-900">${listing.price_per_night}</span>
                                            <span className="text-gray-400 text-xs"> / night</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <span className="text-amber-400">★</span>
                                            <span className="font-semibold">{listing.rating}</span>
                                            <span>({listing.review_count})</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedListing(listing)}
                                        className="w-full mt-4 bg-[#FF6B4A] hover:bg-[#E55A3D] text-white font-black text-sm py-3 rounded-xl transition-all shadow-md hover:shadow-rose-100"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedListing && (
                <BookingModal 
                    listing={selectedListing}
                    isOpen={!!selectedListing}
                    onClose={() => setSelectedListing(null)}
                />
            )}
        </div>
    );
}
