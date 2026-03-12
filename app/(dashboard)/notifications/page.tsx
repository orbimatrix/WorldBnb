"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'booking' | 'message' | 'deal' | 'review' | 'reward' | 'discovery';
    is_read: boolean;
    created_at: string;
    icon?: string;
}

const TYPE_ICONS: Record<string, string> = {
    booking: "✅",
    message: "💬",
    deal: "📉",
    review: "⭐",
    reward: "🎉",
    discovery: "🏡",
};

const TYPE_COLORS: Record<string, string> = {
    booking: "bg-blue-100",
    message: "bg-violet-100",
    deal: "bg-green-100",
    review: "bg-amber-100",
    reward: "bg-rose-100",
    discovery: "bg-teal-100",
};

export default function NotificationsPage() {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/api/notifications");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function markAllRead() {
        try {
            await axios.patch("/api/notifications");
            setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    }

    async function markRead(id: string) {
        const item = items.find(n => n.id === id);
        if (item?.is_read) return;

        try {
            await axios.patch(`/api/notifications/${id}`);
            setItems((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    }

    const unreadCount = items.filter((n) => !n.is_read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-5">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? <><strong className="text-slate-900">{unreadCount}</strong> unread</> : "All caught up 🎉"}
                </p>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-sm font-semibold text-[#FF6B4A] hover:text-rose-700 transition-colors">
                        Mark all as read
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <div className="text-4xl mb-3">🔔</div>
                    <p className="text-gray-500 text-sm">No notifications yet.</p>
                </div>
            ) : (
                items.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-all hover:shadow-md ${n.is_read ? "border-gray-100 opacity-75" : "border-rose-100 hover:-translate-y-0.5"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-11 h-11 rounded-2xl ${TYPE_COLORS[n.type] || "bg-gray-100"} flex items-center justify-center text-xl shrink-0`}>
                                {TYPE_ICONS[n.type] || "🔔"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className={`font-bold text-sm ${n.is_read ? "text-gray-600" : "text-slate-900"}`}>{n.title}</p>
                                    {!n.is_read && <span className="w-2 h-2 bg-[#FF6B4A] rounded-full shrink-0 mt-1.5" />}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed mt-1">{n.body}</p>
                                <p className="text-xs text-gray-400 mt-2">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
