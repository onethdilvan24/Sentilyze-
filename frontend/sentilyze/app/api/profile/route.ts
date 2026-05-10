import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const VALID_THEMES = ["dark", "light", "auto"] as const;

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ profile: existing });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.firstName ?? user?.username ?? null);

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      clerk_user_id: userId,
      email,
      display_name: displayName,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[api/profile GET upsert]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: created });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof body.display_name === "string") updates.display_name = body.display_name;
  if (typeof body.email === "string") updates.email = body.email;
  if (typeof body.default_timeframe === "string") {
    updates.default_timeframe = body.default_timeframe;
  }
  if (typeof body.notifications_enabled === "boolean") {
    updates.notifications_enabled = body.notifications_enabled;
  }
  if (
    typeof body.theme === "string" &&
    (VALID_THEMES as readonly string[]).includes(body.theme)
  ) {
    updates.theme = body.theme;
  }
  if (
    body.notification_prefs &&
    typeof body.notification_prefs === "object" &&
    !Array.isArray(body.notification_prefs)
  ) {
    updates.notification_prefs = body.notification_prefs;
  }

  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: "No updatable fields provided." }, { status: 400 });
  }

  const supabase = await createClient();

  await supabase
    .from("profiles")
    .upsert(
      { clerk_user_id: userId, ...updates },
      { onConflict: "clerk_user_id" },
    );

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error) {
    console.error("[api/profile PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
