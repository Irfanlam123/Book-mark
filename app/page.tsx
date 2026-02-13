import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  const signIn = async () => {
    "use server";
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(error);
    } else {
      return redirect(data.url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <RocketIcon className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Smart Bookmarks
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          The intelligent way to organize your web. fast, secure, and always accessible.
        </p>
        <form action={signIn}>
          <Button size="lg" className="w-full sm:w-auto">
            Get Started with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
