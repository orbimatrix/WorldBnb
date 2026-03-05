"use client";

import { useState, useMemo } from "react";
import PageHero from "@/app/components/static/PageHero";

const allDiscussions = [
    { avatar: "MR", name: "Maria Rodriguez", location: "Lisbon, Portugal", time: "2 hours ago", timeValue: 1, title: "Tips for handling late check-outs gracefully?", preview: "I've had a few guests who keep requesting late checkouts. What's your approach without ruining the relationship?", replies: 24, likes: 47, tag: "Guest Relations", tagColor: "bg-blue-100 text-blue-700" },
    { avatar: "AK", name: "Alex Kim", location: "Seoul, South Korea", time: "5 hours ago", timeValue: 2, title: "Smart lock recommendations for Airbnb hosts in 2026", preview: "Looking to upgrade my key handoff process. Which smart lock brands have you had the best experience with?", replies: 18, likes: 32, tag: "Tech & Tools", tagColor: "bg-purple-100 text-purple-700" },
    { avatar: "SB", name: "Sophie Blanc", location: "Paris, France", time: "Yesterday", timeValue: 3, title: "How I increased my occupancy from 60% to 88% in 3 months", preview: "Sharing my exact strategy including pricing tweaks, photo updates, and the one thing nobody talks about…", replies: 56, likes: 124, tag: "Success Story", tagColor: "bg-green-100 text-green-700" },
    { avatar: "JT", name: "James Turner", location: "London, UK", time: "Yesterday", timeValue: 4, title: "Dealing with unfair negative reviews — what are your rights?", preview: "Got a 3-star review from a guest who broke my rules. Has anyone successfully gotten a review removed?", replies: 41, likes: 89, tag: "Reviews", tagColor: "bg-amber-100 text-amber-700" },
    { avatar: "PR", name: "Priya Rajan", location: "Bangalore, India", time: "2 days ago", timeValue: 5, title: "Co-hosting arrangements — how do you split the earnings?", preview: "Partnering with a friend to manage my property while I travel. Looking for advice on fair splits and formal agreements.", replies: 15, likes: 28, tag: "Business", tagColor: "bg-rose-100 text-rose-700" },
];

type SortMode = "hot" | "recent" | "top";

const stats = [
    { icon: "👥", value: "480K+", label: "Community Members" },
    { icon: "💬", value: "2.3M+", label: "Discussions" },
    { icon: "🌍", value: "120+", label: "Countries" },
    { icon: "⭐", value: "4.9", label: "Avg. Host Rating" },
];

export default function HostCommunityPage() {
    const [sortMode, setSortMode] = useState<SortMode>("hot");

    const sorted = useMemo(() => {
        const copy = [...allDiscussions];
        if (sortMode === "hot") return copy.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies));
        if (sortMode === "recent") return copy.sort((a, b) => a.timeValue - b.timeValue);
        if (sortMode === "top") return copy.sort((a, b) => b.likes - a.likes);
        return copy;
    }, [sortMode]);

    return (
        <>
            <PageHero
                badge="Hosting"
                title="Host Community"
                subtitle="Connect with 480,000+ hosts worldwide. Ask questions, share experiences, and grow together."
                bgImage="/images/hero-community.png"
            />

            {/* Community Stats */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((s) => (
                            <div key={s.label} className="hover:-translate-y-1 transition-transform">
                                <div className="text-3xl mb-1">{s.icon}</div>
                                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                                <div className="text-sm text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Discussions with working sort */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900">Recent Discussions</h2>
                        <div className="flex gap-2">
                            {(
                                [
                                    { mode: "hot" as SortMode, label: "🔥 Hot", desc: "Most engagement" },
                                    { mode: "recent" as SortMode, label: "🕑 Recent", desc: "Newest first" },
                                    { mode: "top" as SortMode, label: "🌟 Top", desc: "Most liked" },
                                ] as const
                            ).map(({ mode, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => setSortMode(mode)}
                                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${sortMode === mode
                                            ? "bg-rose-500 text-white shadow-md"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sorted.map((d) => (
                            <div key={d.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {d.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 text-sm">{d.name}</span>
                                            <span className="text-gray-400 text-xs">·</span>
                                            <span className="text-gray-400 text-xs">{d.location}</span>
                                            <span className="text-gray-400 text-xs">·</span>
                                            <span className="text-gray-400 text-xs">{d.time}</span>
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${d.tagColor}`}>{d.tag}</span>
                                        </div>
                                        <h3 className="font-black text-gray-900 mb-1.5 leading-snug hover:text-rose-500 transition-colors">{d.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{d.preview}</p>
                                        <div className="flex items-center gap-5 mt-3 text-sm text-gray-400">
                                            <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                {d.likes}
                                            </button>
                                            <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                {d.replies} replies
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:shadow-lg">
                            Join the Community
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
