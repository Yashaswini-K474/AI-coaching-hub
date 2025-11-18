import { Webhook } from "svix";
import { internal } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function POST(req) {
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new Response("Bad Request", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const wh = new Webhook(webhookSecret);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  console.log("📩 Webhook event received:", eventType);

  // ✅ When Dodo sends payment success
  // if (eventType === "payment.succeeded") {
  //   const clerkId = data?.metadata?.clerkId;
  //   const dodoCustomerId =
  //     data?.customer?.customer_id || data?.metadata?.dodoCustomerId;

  //   if (clerkId && dodoCustomerId) {
  //     console.log("💾 Updating Convex user:", clerkId, dodoCustomerId);
  //     await fetchMutation(internal.users.saveDodoCustomerId, {
  //       clerkId,
  //       dodoCustomerId,
  //     });
  //   }
  // }

  // return new Response("Webhook received", { status: 200 });
}
