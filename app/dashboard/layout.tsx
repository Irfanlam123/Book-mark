import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkProvider } from "@/contexts/bookmark-context";
import { ToastProvider } from "@/contexts/toast-context";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <ToastProvider>
            <BookmarkProvider initialUser={user}>
                {children}
            </BookmarkProvider>
        </ToastProvider>
    );
}
