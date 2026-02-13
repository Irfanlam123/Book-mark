import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkList } from "@/components/bookmark-list";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    // We now fetch bookmarks on the client side for Realtime consistency
    // const { data: bookmarks } = await supabase
    //     .from("bookmarks")
    //     .select("*")
    //     .eq("user_id", user.id)
    //     .order("created_at", { ascending: false });

    const signOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            Smart Bookmarks
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-500 hidden sm:inline-block font-medium">
                            {user.email}
                        </span>
                        <form action={signOut}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline-block">Sign out</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 flex-grow max-w-5xl">
                <div className="text-center mb-12 space-y-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 pb-1">
                        Manage Your Web
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
                        Your intelligent collection, synced in realtime across all your devices.
                    </p>
                </div>

                <BookmarkList />
            </main>

            <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400 bg-white">
                <p>&copy; {new Date().getFullYear()} Smart Bookmarks. Secure & Private.</p>
            </footer>
        </div>
    );
}
