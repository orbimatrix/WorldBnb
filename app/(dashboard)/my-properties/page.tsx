import getListings from "@/app/actions/getListings";
import ListingsClient from "../listings/ListingsClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyPropertiesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const listings = await getListings({ ownerId: userId });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black text-slate-900">My Properties</h2>
            <p className="text-gray-500 mt-2">Manage the properties you have listed for rent or sale.</p>
        </div>
        <Link href="/create-listing" className="bg-[#FF6B4A] hover:bg-[#E55A3D] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md hidden sm:block">
            + List New Property
        </Link>
      </div>

      <ListingsClient initialListings={listings} />
    </div>
  );
}
