"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BookingModal from "@/app/components/modals/BookingModal";
import ListingCard from "@/app/components/listings/ListingCard";

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
                    {items.map((item) => (
                        <ListingCard 
                            key={item.id}
                            data={item.listings as any}
                            onAction={(listing) => setSelectedListing(listing)}
                        />
                    ))}
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
