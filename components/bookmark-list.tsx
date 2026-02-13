"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, BookmarkCard } from "./bookmark-card";
import { BookmarkForm } from "./bookmark-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, BookmarkX } from "lucide-react";
import { User } from "@supabase/supabase-js";

export function BookmarkList({ initialUser }: { initialUser: User }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // 1. Fetch Initial Data
    useEffect(() => {
        if (!initialUser) return;

        const fetchBookmarks = async () => {
            console.log("Fetching initial bookmarks for user:", initialUser.id);
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", initialUser.id) // Security double-check
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching bookmarks:", error);
            } else {
                setBookmarks(data || []);
            }
            setLoading(false);
        };

        fetchBookmarks();
    }, [initialUser, supabase]);

    // 2. Strict Realtime Subscription
    useEffect(() => {
        if (!initialUser) return;

        console.log("Setting up Realtime subscription for user:", initialUser.id);

        const channel = supabase
            .channel(`bookmarks-${initialUser.id}`) // Unique channel name per user
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to INSERT, UPDATE, DELETE
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${initialUser.id}`, // strict server-side filter
                },
                (payload) => {
                    console.log("Realtime payload received:", payload);

                    if (payload.eventType === "INSERT") {
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            // Deduplication check
                            if (prev.find((b) => b.id === newBookmark.id)) {
                                console.log("Duplicate realtime event ignored:", newBookmark.id);
                                return prev;
                            }
                            return [newBookmark, ...prev];
                        });
                    }

                    if (payload.eventType === "DELETE") {
                        const oldBookmark = payload.old as { id: string };
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== oldBookmark.id)
                        );
                    }
                }
            )
            .subscribe((status) => {
                console.log("Realtime subscription status:", status);
            });

        return () => {
            console.log("Cleaning up Realtime subscription");
            supabase.removeChannel(channel);
        };
    }, [initialUser, supabase]);

    const handleDelete = async (id: string) => {
        // Optimistic UI Update
        const previousBookmarks = [...bookmarks];
        setBookmarks((current) => current.filter((b) => b.id !== id));

        const { error } = await supabase.from("bookmarks").delete().eq("id", id);

        if (error) {
            console.error("Error deleting bookmark:", error);
            setBookmarks(previousBookmarks); // Revert on error
            alert("Failed to delete bookmark");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <BookmarkForm user={initialUser} />

            <div className="flex items-center justify-between mb-8 px-2">
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                    Your Collection ({bookmarks.length})
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100 text-xs text-green-600 font-medium">
                    <Zap className="w-3 h-3 fill-green-600" />
                    <span>Live Sync Active</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookmarkX className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium text-lg">No bookmarks yet</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                        Add your first bookmark above to start building your collection.
                    </p>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {bookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
