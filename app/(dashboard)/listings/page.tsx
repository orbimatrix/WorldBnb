"use server";

import getListings from "@/app/actions/getListings";
import ListingsClient from "./ListingsClient";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Explore Stays</h2>
        <p className="text-gray-500 mt-2">Find and book your next amazing adventure from our global collection.</p>
      </div>

      <ListingsClient initialListings={listings} />
    </div>
  );
}
