import { Trash2, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export type Bookmark = {
    id: string;
    user_id: string;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
};

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-lg text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors flex-1"
                        title={bookmark.title}
                    >
                        {bookmark.title}
                    </a>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 pt-1"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {bookmark.description || "No description provided."}
                </p>

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold overflow-hidden">
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`}
                            alt="favicon"
                            className="w-full h-full object-cover opacity-70"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                    </div>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700 truncate block font-medium"
                    >
                        {new URL(bookmark.url).hostname}
                    </a>
                </div>
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center text-[11px] text-gray-400 font-medium">
                    <Calendar className="w-3 h-3 mr-1.5 opacity-60" />
                    {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(bookmark.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
