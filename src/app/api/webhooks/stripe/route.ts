import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export const runtime = "nodejs";

// Verify the request actually came from Stripe
function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  try {
    const parts = header.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const signature = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
    if (!timestamp || !signature) return false;

    const signed = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    return signed === signature;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId: string | null = session.client_reference_id || null;
    const email: string | null = session.customer_email || null;

    if (!userId && !email) {
      return NextResponse.json({ error: "No user identifier" }, { status: 400 });
    }

    // Update Supabase using the service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    let updateUrl = `${supabaseUrl}/rest/v1/profiles`;
    let filterParam = "";

    if (userId) {
      filterParam = `?id=eq.${userId}`;
    } else if (email) {
      // Fall back to email match if no userId
      filterParam = `?email=eq.${encodeURIComponent(email)}`;
    }

    const res = await fetch(`${updateUrl}${filterParam}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ is_subscribed: true }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase update failed:", errText);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    // Handle cancellation — mark user as unsubscribed
    const subscription = event.data.object;
    const customerId: string = subscription.customer;

    // Look up the customer's email from Stripe
    const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    });
    const customer = await customerRes.json();
    const email = customer.email;

    if (email) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

      await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ is_subscribed: false }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
