"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "./toast-context";

// Reuse existing types
export type Bookmark = {
    id: string;
    user_id: string;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
};

interface BookmarkContextType {
    bookmarks: Bookmark[];
    loading: boolean;
    addBookmark: (title: string, url: string, description: string) => Promise<void>;
    deleteBookmark: (id: string) => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: User;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { showToast } = useToast();

    // 1. Fetch Initial Data
    useEffect(() => {
        if (!initialUser) return;

        const fetchBookmarks = async () => {
            console.log("Fetching global bookmarks for user:", initialUser.id);
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", initialUser.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching bookmarks:", error);
                showToast("Failed to load bookmarks", "error");
            } else {
                setBookmarks(data || []);
            }
            setLoading(false);
        };

        fetchBookmarks();
    }, [initialUser, supabase, showToast]);

    // 2. Global Realtime Subscription
    useEffect(() => {
        if (!initialUser) return;

        console.log("Setting up Global Realtime for user:", initialUser.id);

        const channel = supabase
            .channel(`global-bookmarks-${initialUser.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${initialUser.id}`,
                },
                (payload) => {
                    console.log("Global Realtime event:", payload);

                    if (payload.eventType === "INSERT") {
                        const newBookmark = payload.new as Bookmark;

                        // Strict Deduplication
                        setBookmarks((prev) => {
                            if (prev.some((b) => b.id === newBookmark.id)) return prev;
                            showToast("Received new bookmark!", "info");
                            return [newBookmark, ...prev];
                        });
                    }

                    if (payload.eventType === "DELETE") {
                        const oldBookmark = payload.old as { id: string };
                        setBookmarks((prev) => {
                            const exists = prev.find((b) => b.id === oldBookmark.id);
                            if (exists) {
                                showToast("Bookmark deleted remotely", "info");
                                return prev.filter((b) => b.id !== oldBookmark.id);
                            }
                            return prev;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialUser, supabase, showToast]);

    // 3. Actions
    const addBookmark = useCallback(async (title: string, url: string, description: string) => {
        // Optimistic update is tricky with ID generation, so we rely on Realtime for the UI update
        // But we can show a loading toast if we wanted.

        const { error } = await supabase.from("bookmarks").insert({
            title,
            url,
            description,
            user_id: initialUser.id,
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            showToast(error.message, "error");
        } else {
            showToast("Bookmark added successfully!", "success");
        }
    }, [initialUser, supabase, showToast]);

    const deleteBookmark = useCallback(async (id: string) => {
        // Optimistic UI
        const previousBookmarks = [...bookmarks];
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        showToast("Bookmark deleted", "success");

        const { error } = await supabase.from("bookmarks").delete().eq("id", id);

        if (error) {
            console.error("Error deleting bookmark:", error);
            setBookmarks(previousBookmarks);
            showToast("Failed to delete bookmark", "error");
        }
    }, [bookmarks, supabase, showToast]);

    return (
        <BookmarkContext.Provider value={{ bookmarks, loading, addBookmark, deleteBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarkProvider");
    }
    return context;
}
