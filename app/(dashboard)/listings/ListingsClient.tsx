"use client";

import { useState } from "react";
import ListingCard from "@/app/components/listings/ListingCard";
import BookingModal from "@/app/components/modals/BookingModal";

interface ListingsClientProps {
  initialListings: any[];
}

export default function ListingsClient({ initialListings }: ListingsClientProps) {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBook = (listing: any) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  return (
    <>
      {initialListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg">No stays available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {initialListings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              data={listing} 
              onAction={handleBook}
            />
          ))}
        </div>
      )}

      {selectedListing && (
        <BookingModal
          listing={selectedListing}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
