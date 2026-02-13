"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

import { User } from "@supabase/supabase-js";

export function BookmarkForm({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const supabase = createClient();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("bookmarks").insert({
            title,
            url,
            user_id: user.id,
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            alert(`Error: ${error.message}`);
        } else {
            setTitle("");
            setUrl("");
            setIsOpen(false);
        }
        setLoading(false);
    }

    return (
        <div className="w-full max-w-md mx-auto mb-10">
            {!isOpen ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="w-full h-12 bg-white hover:bg-gray-50 text-blue-600 border border-dashed border-blue-200 hover:border-blue-300 rounded-xl shadow-sm transition-all font-medium"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Add New Bookmark
                    </Button>
                </motion.div>
            ) : (
                <motion.form
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-gray-200/50 space-y-5"
                    onSubmit={onSubmit}
                >
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. My Portfolio"
                            required
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url" className="text-gray-700 font-medium">URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-600/20"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Bookmark"
                            )}
                        </Button>
                    </div>
                </motion.form>
            )}
        </div>
    );
}
