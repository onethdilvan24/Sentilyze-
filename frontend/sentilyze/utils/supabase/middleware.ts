import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function updateSession(
  request: NextRequest,
  getToken: () => Promise<string | null>,
) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const token = await getToken();

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  // With Clerk third-party JWT we don't have a Supabase session to refresh,
  // but touching the client preserves cookie pass-through behaviour.
  try {
    await supabase.auth.getUser();
  } catch {
    /* third-party JWT not yet registered, or no token — safe to ignore */
  }

  return supabaseResponse;
}
