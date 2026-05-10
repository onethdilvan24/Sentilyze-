"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser Supabase client with Clerk JWT on each request (for RLS).
 */
export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createBrowserClient(supabaseUrl!, supabaseKey!, {
        global: {
          fetch: async (input, init = {}) => {
            const token = await getToken();
            const headers = new Headers(init.headers);
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(input, { ...init, headers });
          },
        },
      }),
    [getToken],
  );
}
