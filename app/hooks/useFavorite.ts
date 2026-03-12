import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

interface IUseFavorite {
  listingId: string;
}

const useFavorite = ({ listingId }: IUseFavorite) => {
  const router = useRouter();
  const { user } = useUser();

  // In a real app, you'd fetch the favorites and check if listingId is in there.
  // For this demo, let's assume we can toggle via API and it's up to the UI to handle the visual 'filled' state if we had the data.
  // Ideally, 'listings' would have an 'isFavorite' property if joined in the query.
  
  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    try {
      // Toggle logic - usually would check current state, but let's assume simple POST for now
      // or we can just call POST to add.
      await axios.post('/api/wishlist', { listingId });
      router.refresh();
      toast.success("Updated wishlist");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  }, [user, listingId, router]);

  return {
    hasFavorite: false, // This would need the actual favorites list to be accurate
    toggleFavorite,
  };
}

export default useFavorite;
