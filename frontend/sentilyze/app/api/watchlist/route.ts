import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const VALID_TYPES = ["Stock", "Crypto", "Forex", "Commodity"] as const;
type AssetType = (typeof VALID_TYPES)[number];

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/watchlist GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const symbol = typeof body.symbol === "string" ? body.symbol.trim().toUpperCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : symbol;
  const assetType = typeof body.asset_type === "string" ? body.asset_type : "Stock";
  const groupName = typeof body.group_name === "string" ? body.group_name.trim() : "Default";

  if (!symbol || symbol.length > 32) {
    return NextResponse.json({ error: "Invalid symbol." }, { status: 400 });
  }
  if (!VALID_TYPES.includes(assetType as AssetType)) {
    return NextResponse.json(
      { error: `asset_type must be one of ${VALID_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      clerk_user_id: userId,
      symbol,
      name,
      asset_type: assetType,
      group_name: groupName || "Default",
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That symbol is already in your watchlist." },
        { status: 409 },
      );
    }
    console.error("[api/watchlist POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.alert_enabled === "boolean") updates.alert_enabled = body.alert_enabled;
  if (typeof body.is_favorite === "boolean") updates.is_favorite = body.is_favorite;
  if (typeof body.group_name === "string") updates.group_name = body.group_name;
  if (typeof body.name === "string") updates.name = body.name;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updatable fields provided." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_items")
    .update(updates)
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("[api/watchlist PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("[api/watchlist DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
