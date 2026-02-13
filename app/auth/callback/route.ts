import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Use the robust getURL utility
            const { getURL } = await import("@/utils/get-url");
            const baseUrl = getURL();

            // Construct absolute URL for the redirect
            return NextResponse.redirect(`${baseUrl}${next.startsWith('/') ? next.slice(1) : next}`);
        }
    }

    // return the user to an error page with instructions
    const { getURL } = await import("@/utils/get-url");
    return NextResponse.redirect(`${getURL()}auth/auth-code-error`);
}
