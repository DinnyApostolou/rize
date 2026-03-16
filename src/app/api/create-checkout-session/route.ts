import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const body = await request.json().catch(() => ({}));
    const { userId, email } = body;

    const params = new URLSearchParams();
    params.append("payment_method_types[0]", "card");
    params.append("mode", "subscription");
    params.append("line_items[0][price]", process.env.STRIPE_PRICE_ID || "");
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${origin}/dashboard?success=true`);
    params.append("cancel_url", `${origin}/subscribe?cancelled=true`);

    // Attach user identity so webhook can update Supabase
    if (userId) params.append("client_reference_id", userId);
    if (email) params.append("customer_email", email);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe error:", JSON.stringify(session));
      return NextResponse.json({ error: session.error?.message || "Stripe error", details: session }, { status: 400 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
