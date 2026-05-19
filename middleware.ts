import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { clientConfig } from "@/client.config";
import type { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() is more secure than getSession() — validates with Supabase server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Already on login page
  if (pathname === "/admin/login") {
    // Redirect to dashboard if already authed
    if (user && (clientConfig.admin.allowedEmails as readonly string[]).includes(user.email ?? "")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  // Protect all other /admin/* routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (!(clientConfig.admin.allowedEmails as readonly string[]).includes(user.email ?? "")) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
