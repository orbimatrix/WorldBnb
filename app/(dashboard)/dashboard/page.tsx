"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import StatCard from "@/app/components/dashboard/StatCard";

interface DashboardStats {
    totalTrips: number;
    savedListings: number;
    upcomingCount: number;
    totalSpent: number;
}

interface Booking {
    id: string;
    total_price: number;
    check_in: string;
    check_out: string;
    status: string;
    listings: {
        title: string;
        location: string;
        image_url: string;
    };
}

interface Notification {
    title: string;
    created_at: string;
    type: string;
}

export default function DashboardPage() {
    const { user } = useUser();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [upcoming, setUpcoming] = useState<Booking[]>([]);
    const [activity, setActivity] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, upcomingRes, activityRes] = await Promise.all([
                    axios.get("/api/dashboard/stats"),
                    axios.get("/api/bookings?status=upcoming"),
                    axios.get("/api/notifications"),
                ]);

                setStats(statsRes.data);
                setUpcoming(upcomingRes.data.slice(0, 3));
                setActivity(activityRes.data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B4A]"></div>
            </div>
        );
    }

    const statCards = [
        { icon: "✈️", label: "Total Trips", value: stats?.totalTrips ?? 0, accent: "bg-rose-100 text-[#E55A3D]" },
        { icon: "❤️", label: "Saved Listings", value: stats?.savedListings ?? 0, accent: "bg-pink-100 text-[#14B8A6]" },
        { icon: "📅", label: "Upcoming", value: stats?.upcomingCount ?? 0, accent: "bg-amber-100 text-amber-600" },
        { icon: "💸", label: "Total Spent", value: `$${stats?.totalSpent?.toLocaleString() ?? 0}`, accent: "bg-indigo-100 text-indigo-600" },
    ];

    const unreadCount = activity.filter(a => !(a as any).is_read).length;

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-[#FF6B4A] to-[#14B8A6] rounded-3xl p-8 text-white shadow-xl">
                <p className="text-rose-100 text-sm font-semibold mb-1 opacity-80">Welcome back</p>
                <h2 className="text-4xl font-black mb-3">Hey, {user?.firstName ?? "Traveller"} 👋</h2>
                <p className="text-white/90 text-sm max-w-sm leading-relaxed">
                    You have <strong>{stats?.upcomingCount ?? 0} upcoming trips</strong> and <strong>{unreadCount} unread notifications</strong>. What would you like to do today?
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                    <Link href="/" className="bg-white text-[#FF6B4A] font-black text-sm px-7 py-3 rounded-2xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                        🔍 Browse Stays
                    </Link>
                    <Link href="/bookings" className="bg-white/10 text-white font-bold text-sm px-7 py-3 rounded-2xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm">
                        📅 My Bookings
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Trips */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-xl">Upcoming Trips</h3>
                        <Link href="/bookings" className="text-sm text-[#FF6B4A] font-bold hover:text-rose-700 transition-colors">View All →</Link>
                    </div>
                    
                    {upcoming.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                            <p className="text-gray-400 text-sm">No upcoming adventures yet. Time to book one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcoming.map((trip) => (
                                <div key={trip.id} className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-[#FFF0ED] flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                                            {trip.listings.image_url}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-slate-900 text-base">{trip.listings.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mb-2">{trip.listings.location}</p>
                                            <p className="text-xs font-bold text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded-lg">
                                                {new Date(trip.check_in).toLocaleDateString()} – {new Date(trip.check_out).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-lg font-black text-slate-900 shrink-0">${trip.total_price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-xl">Recent Activity</h3>
                        <Link href="/notifications" className="text-sm text-[#FF6B4A] font-bold hover:text-rose-700 transition-colors underline decoration-rose-200 underline-offset-4">History</Link>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden p-2">
                        {activity.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No recent notifications.</div>
                        ) : (
                            activity.map((item, i) => (
                                <div key={i} className={`flex items-start gap-3 px-4 py-4 rounded-2xl transition-colors hover:bg-gray-50 cursor-default`}>
                                    <div className={`w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-sm shrink-0 shadow-sm`}>
                                        {item.type === 'booking' ? '✅' : '🔔'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 font-bold leading-tight">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-black">
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
