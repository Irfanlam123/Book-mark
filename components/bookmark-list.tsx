"use client";

import { BookmarkCard } from "./bookmark-card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookmarkX, Zap } from "lucide-react";
import { useBookmarks } from "@/contexts/bookmark-context";
import { BookmarkForm } from "./bookmark-form";

export function BookmarkList() {
    const { bookmarks, loading, deleteBookmark } = useBookmarks();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">
                    Syncing your bookmarks...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Form is part of the list view for now, or can be separate. Keeping structure similar. */}
            <BookmarkForm />

            <div className="flex items-center justify-between mb-8 px-2">
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                    Your Collection ({bookmarks.length})
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100 text-xs text-green-600 font-medium">
                    <Zap className="w-3 h-3 fill-green-600" />
                    <span>Live Sync Active</span>
                </div>
            </div>

            {bookmarks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookmarkX className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-gray-900">No bookmarks yet</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                            Start building your collection by adding your favorite websites above.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {bookmarks.map((bookmark) => (
                            <motion.div
                                key={bookmark.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <BookmarkCard
                                    bookmark={bookmark}
                                    onDelete={async (id) => {
                                        await deleteBookmark(id);
                                    }}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
