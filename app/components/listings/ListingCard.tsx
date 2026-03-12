'use client';

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  price_per_night: number;
  image_url: string;
  category: string;
  rating: number;
  review_count: number;
  is_sold: boolean;
}

interface ListingCardProps {
  data: Listing;
  onAction?: (listing: Listing) => void;
  disabled?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  onAction,
  disabled,
}) => {
  const router = useRouter();

  const handleAction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.is_sold && !disabled) {
      onAction?.(data);
    }
  }, [data, disabled, onAction]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative">
      {data.is_sold && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-white/20">
          Sold Out
        </div>
      )}
      <div className="relative h-56">
        <Image
          src={data.image_url?.startsWith('http') ? data.image_url : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1080'}
          alt={data.title}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${data.is_sold ? 'grayscale-[0.5]' : ''}`}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold text-slate-800">
          ★ {data.rating || 4.5}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-[#FF6B4A] transition-colors">{data.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{data.location}, {data.country}</p>
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-xl font-black text-slate-900">${data.price_per_night}</span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
          <button
            onClick={handleAction}
            disabled={data.is_sold || disabled}
            className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
              data.is_sold 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#FF6B4A] text-white hover:bg-[#E55A3D] shadow-md hover:shadow-lg'
            }`}
          >
            {data.is_sold ? "Unavailable" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;