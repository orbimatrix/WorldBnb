"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createListing } from "@/app/actions/createListing";

export default function CreateListingPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await createListing(formData);
            toast.success("Listing created successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to create listing");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div>
                <h2 className="text-3xl font-black text-slate-900">List Your Space</h2>
                <p className="text-gray-500 mt-2">Earn extra income by renting or selling your property directly to our community.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Property Title</label>
                    <input 
                        name="title" 
                        required 
                        placeholder="e.g. Cozy Log Cabin in the Woods" 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Description</label>
                    <textarea 
                        name="description" 
                        required 
                        rows={4} 
                        placeholder="Describe your place..." 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">City / Location</label>
                        <input 
                            name="location" 
                            required 
                            placeholder="e.g. Paris" 
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Country</label>
                        <input 
                            name="country" 
                            required 
                            placeholder="e.g. France" 
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500 font-bold">$</span>
                            <input 
                                name="price" 
                                type="number" 
                                min="1" 
                                required 
                                placeholder="0.00" 
                                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Listing Type</label>
                        <select 
                            name="category" 
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B4A] outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="Apartment">Rent - Apartment</option>
                            <option value="Villa">Rent - Villa</option>
                            <option value="Cabin">Rent - Cabin</option>
                            <option value="Unique">Rent - Unique</option>
                            <option value="Sale">Sell - Flat Price</option>
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#FF6B4A] hover:bg-[#E55C3D] text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? "Publishing..." : "Publish Listing"}
                </button>
            </form>
        </div>
    );
}
