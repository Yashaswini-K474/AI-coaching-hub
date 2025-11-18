// import { httpRouter } from "convex/server";
// // CRITICAL FIX: We must import 'internal' because the webhook handler is an internalMutation.
// import { internal } from "./_generated/api";

// const http = httpRouter();

// http.route({
//     path: "/clerk-users-webhook",
//     method: "POST",
//     // CORRECT: Now uses 'internal' which points to internalMutation functions
//     handler: internal.clerk.handleClerkWebhook,
// });

// export default http;



// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";
// import { createDodoWebhookHandler } from "@dodopayments/convex";

// // ----------------- CLERK WEBHOOK -----------------
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("❌ CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("❌ Clerk Webhook verification failed:", err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const { id, email_addresses, first_name, last_name } = evt.data;
//     const eventType = evt.type;

//     console.log(`📡 Clerk Webhook received: ${eventType}`);
//     console.log(`Clerk ID: ${id}`);

//     const nameToSync = `${first_name || ""} ${last_name || ""}`.trim();
//     const emailToSync = email_addresses?.[0]?.email_address || "N/A";

//     await ctx.runMutation(internal.webhook.syncUser, {
//         eventType,
//         clerkId: id,
//         name: nameToSync,
//         email: emailToSync,
//     });

//     return new Response(null, { status: 200 });
// });

// // ----------------- DODO PAYMENTS WEBHOOK -----------------
// const dodoWebhookHandler = createDodoWebhookHandler({
//     onPaymentSucceeded: async (ctx, payload) => {
//         console.log("✅ Dodo payment succeeded:", JSON.stringify(payload, null, 2));

//         const dodoCustomerId = payload.data?.customer?.customer_id;
//         const clerkId = payload.data?.metadata?.clerkId;

//         if (!dodoCustomerId) {
//             console.error("❌ Missing dodoCustomerId in Dodo payload.");
//             return new Response("Missing dodoCustomerId", { status: 400 });
//         }

//         // ✅ FIXED: webhook → webhook (singular)
//         await ctx.runMutation(internal.webhook.updateUserTokens, {
//             dodoCustomerId,
//             clerkId,
//         });

//         console.log(`💰 Successfully updated tokens for Dodo customer: ${dodoCustomerId}`);
//     },

//     onPaymentFailed: async (ctx, payload) => {
//         console.warn("⚠️ Dodo payment failed:", payload.data?.payment_id);
//     },

//     onSubscriptionCancelled: async (ctx, payload) => {
//         console.log("❌ Dodo subscription cancelled:", payload.data?.payment_id);

//         const dodoCustomerId = payload.data?.customer?.customer_id;

//         if (!dodoCustomerId) {
//             console.error("❌ Missing dodoCustomerId on cancellation payload.");
//             return new Response("Missing dodoCustomerId", { status: 400 });
//         }

//         // If you have a downgrade handler, make sure it’s also webhook (singular)
//         await ctx.runMutation(internal.webhook.downgradeUserPlan, {
//             dodoCustomerId,
//         });

//         console.log(`📉 Downgraded plan for Dodo customer: ${dodoCustomerId}`);
//     },
// });

// // ----------------- TEST ROUTE -----------------
// const handleTest = httpAction(async () => {
//     return new Response("✅ Convex + Dodo Payments connected!", { status: 200 });
// });

// const http = httpRouter();

// http.route({
//     path: "/clerk-users-webhook",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// http.route({
//     path: "/dodopayments-webhook",
//     method: "POST",
//     handler: dodoWebhookHandler,
// });

// http.route({
//     path: "/test-route",
//     method: "GET",
//     handler: handleTest,
// });

// export default http;


import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { createDodoWebhookHandler } from "@dodopayments/convex";

// ----------------- CLERK WEBHOOK -----------------
const handleClerkWebhook = httpAction(async (ctx, request) => {
    const headers = Object.fromEntries(request.headers.entries());
    const body = await request.text();
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("❌ CLERK_WEBHOOK_SECRET is not set!");
        return new Response("Webhook secret not configured", { status: 500 });
    }

    const wh = new Webhook(webhookSecret);
    let evt;
    try {
        evt = wh.verify(body, headers);
    } catch (err) {
        console.error("❌ Clerk Webhook verification failed:", err);
        return new Response("Webhook verification failed.", { status: 400 });
    }

    const { id, email_addresses, first_name, last_name } = evt.data;
    const eventType = evt.type;

    // --- ADDED: Robust Logging ---
    console.log(`📡 Clerk Webhook received: ${eventType}`);
    console.log(`Clerk ID: ${id}`);
    console.log(`First Name: ${first_name}`);
    console.log(`Email Address: ${email_addresses?.[0]?.email_address}`);
    // -----------------------------

    // Ensure we handle the name gracefully even if names are missing
    const nameToSync = `${first_name || ""} ${last_name || ""}`.trim();
    // Use primary email, or a fallback if array is empty/undefined
    const emailToSync = email_addresses?.[0]?.email_address || "N/A";

    await ctx.runMutation(internal.webhooks.syncUser, {
        eventType,
        clerkId: id,
        name: nameToSync,
        email: emailToSync,
    });

    return new Response(null, { status: 200 });
});

// ----------------- DODO PAYMENTS WEBHOOK -----------------
const dodoWebhookHandler = createDodoWebhookHandler({
    // IMPORTANT: When using createDodoWebhookHandler, the logic for each event is defined here.
    onPaymentSucceeded: async (ctx, payload) => {
        console.log("✅ Dodo payment succeeded full payload:", JSON.stringify(payload, null, 2));

        // Correct field for Dodo customer ID
        const dodoCustomerId = payload.data?.customer?.customer_id;
        // Correctly extracted the Clerk ID from metadata
        const clerkId = payload.data?.metadata?.clerkId;

        if (!dodoCustomerId) {
            console.error("❌ Missing dodoCustomerId in Dodo payload. Full payload logged above.");
            return new Response("Missing dodoCustomerId", { status: 400 });
        }

        // 🔥 FIX: Now passing the extracted 'clerkId' to the internal mutation
        await ctx.runMutation(internal.webhooks.updateUserTokens, {
            dodoCustomerId,
            clerkId, // <--- This was the missing argument!
        });

        console.log(`💰 Successfully updated tokens for Dodo customer: ${dodoCustomerId}`);
    },

    onPaymentFailed: async (ctx, payload) => {
        console.warn("⚠️ Dodo payment failed:", payload.data?.payment_id);
    },

    onSubscriptionCancelled: async (ctx, payload) => {
        console.log("❌ Dodo subscription cancelled:", payload.data?.payment_id);

        const dodoCustomerId = payload.data?.customer?.customer_id;

        if (!dodoCustomerId) {
            console.error("❌ Missing dodoCustomerId on cancellation payload.");
            return new Response("Missing dodoCustomerId", { status: 400 });
        }

        await ctx.runMutation(internal.webhooks.downgradeUserPlan, {
            dodoCustomerId,
        });

        console.log(`📉 Downgraded plan for Dodo customer: ${dodoCustomerId}`);
    },
});

// ----------------- TEST ROUTE -----------------
const handleTest = httpAction(async () => {
    return new Response("✅ Convex + Dodo Payments connected!", { status: 200 });
});

// ----------------- ROUTER -----------------
const http = httpRouter();

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook,
});

http.route({
    path: "/dodopayments-webhook",
    method: "POST",
    handler: dodoWebhookHandler,
});

http.route({
    path: "/test-route",
    method: "GET",
    handler: handleTest,
});

export default http;