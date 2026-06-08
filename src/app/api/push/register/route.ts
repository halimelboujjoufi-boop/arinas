import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

// Stores a device push token so the device can receive targeted notifications.
// Best-effort: if the DB isn't configured the token is simply acknowledged.
export async function POST(req: Request) {
  let body: { token?: unknown; platform?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const platform = typeof body.platform === "string" ? body.platform : "android";
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: true, stored: false });

  try {
    await supabase
      .from("push_tokens")
      .upsert({ token, platform, updated_at: new Date().toISOString() }, { onConflict: "token" });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
