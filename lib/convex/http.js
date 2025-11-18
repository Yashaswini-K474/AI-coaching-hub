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

// convex/http.js (Handles HTTP Routing and Verification)
// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // 1. Define the HTTP Action to handle the raw request
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     // 1. Get headers, body, and secret
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     // 2. Verify signature
//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     // 3. Extract and sanitize data
//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name, profile_image_url } = evt.data;

//     const userData = {
//         clerkId: id,
//         email: email_addresses?.[0]?.email_address,
//         name: `${first_name || ""} ${last_name || ""}`.trim(),
//         profileImageUrl: profile_image_url,
//     };

//     // 4. Call the internalMutation to safely update the database
//     // Note: The function name here is now 'handleClerkEvent' as defined above
//     await ctx.runMutation(internal.webhooks.handleClerkEvent, {
//         eventType,
//         userData,
//         clerkId: id,
//     });

//     return new Response(null, { status: 200 });
// });

// // 2. Define the HTTP Router
// const http = httpRouter();

// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     // CRITICAL: Point the handler to the httpAction function defined above
//     handler: handleClerkWebhook,
// });

// export default http;

// convex/http.js (HTTP Router and Clerk Webhook Action)
// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server"; // ✅ FIX: Corrected import
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // This httpAction handles the raw POST request from Clerk
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     // 1. Extract body, headers, and secret
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     // 2. Verify signature using Svix
//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
//         // Returning 400 tells Clerk not to retry this request immediately.
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     // 3. Extract data
//     const eventType = evt.type;
//     // NOTE: You must use the structure of the data defined by the Clerk webhook payload
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     // 4. Call the secure internal mutation
//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//             // Pass other data needed by syncUser
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         // Return 500 to signal Clerk to retry the webhook later
//         return new Response("Database error.", { status: 500 });
//     }

//     // 5. Success response
//     return new Response(null, { status: 200 });
// });


// // Define the HTTP Router
// const http = httpRouter();

// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     // ✅ FIX: Handler points directly to the httpAction function
//     handler: handleClerkWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     // ... Clerk logic ...
//     // NOTE: This part is unchanged from our previous exchange, but included for completeness
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     const rawBody = await request.text();

//     if (!signature) {
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         const result = await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         if (result.success) {
//             return new Response(null, { status: 200 });
//         } else {
//             return new Response("Webhook processing failed.", { status: 500 });
//         }
//     } catch (err) {
//         console.error("Stripe webhook processing failed in http.js:", err.message);
//         return new Response(err.message, { status: 400 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     // NOTE: This part is unchanged and handles user sync from Clerk
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         const result = await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         if (result.success) {
//             return new Response(null, { status: 200 });
//         } else {
//             return new Response("Webhook processing failed.", { status: 500 });
//         }
//     } catch (err) {
//         console.error("Stripe webhook processing failed in http.js:", err.message);
//         return new Response(err.message, { status: 400 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     // NOTE: This part is unchanged and handles user sync from Clerk
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.ts (or stripe.js)
//         const result = await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action will throw an error if verification fails,
//         // which will be caught below. If it returns successfully, we send 200.
//         if (result && result.success) {
//             return new Response(null, { status: 200 });
//         }

//         // Handle explicit failure return from the internal action if needed (though throwing is usually better)
//         return new Response("Webhook processing failed (Internal Action indicated failure).", { status: 500 });

//     } catch (err) {
//         // If the internal action throws an error (e.g., Stripe verification failed),
//         // we log it and return a 400/402 to Stripe, which is the correct behavior.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         return new Response(error.message, { status: 400 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook", // <--- This path must match exactly what is in Stripe
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-webhook", // <--- This path must match exactly what is in Stripe
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;


// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     // *** PATH CORRECTED TO MATCH NEW STRIPE ENDPOINT URL ***
//     path: "/stripe-test-01",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         // Returning 500 for the final router tells Stripe to retry
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     // PATH CORRECTED TO MATCH NEW STRIPE ENDPOINT URL: /stripe-test-01
//     path: "/stripe-test-01",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;


// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         // Returning 500 for the final router tells Stripe to retry
//         return new Response(error.message, { status: 500 });
//     }
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     // MATCHING THE NEW STRIPE ENDPOINT URL: /stripe-test-01
//     path: "/stripe-test-01",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// export default http;

// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";
// import { Webhook } from "svix";
// import { internal } from "./_generated/api";

// // --- CLERK WEBHOOK ACTION (Unchanged) ---
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const headers = Object.fromEntries(request.headers.entries());
//     const body = await request.text();
//     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//         console.error("CLERK_WEBHOOK_SECRET is not set!");
//         return new Response("Webhook secret not configured", { status: 500 });
//     }

//     const wh = new Webhook(webhookSecret);
//     let evt;
//     try {
//         evt = wh.verify(body, headers);
//     } catch (err) {
//         console.error("Clerk Webhook verification failed:", err instanceof Error ? err.message : err);
//         return new Response("Webhook verification failed.", { status: 400 });
//     }

//     const eventType = evt.type;
//     const { id, email_addresses, first_name, last_name } = evt.data;

//     try {
//         await ctx.runMutation(internal.webhooks.syncUser, {
//             eventType,
//             clerkId: id,
//             name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses?.[0]?.email_address || "N/A",
//         });
//     } catch (dbError) {
//         console.error("Database mutation failed:", dbError);
//         return new Response("Database error.", { status: 500 });
//     }
//     return new Response(null, { status: 200 });
// });

// // --- STRIPE WEBHOOK ACTION (CRITICAL ROUTER FORWARD) ---

// const handleStripeWebhook = httpAction(async (ctx, request) => {
//     const signature = request.headers.get("stripe-signature");
//     // CRITICAL: We need the raw body for Stripe signature verification
//     const rawBody = await request.text();

//     if (!signature) {
//         // Missing signature means it's not a Stripe request, so 400 is appropriate
//         return new Response("Missing 'stripe-signature' header", { status: 400 });
//     }

//     try {
//         // Calls the internal action in convex/stripe.js
//         await ctx.runAction(internal.stripe.handleWebhook, {
//             signature,
//             rawBody
//         });

//         // The internal action succeeded, return 200 so Stripe knows the event was processed
//         return new Response(null, { status: 200 });

//     } catch (err) {
//         // IMPORTANT: On failure (including signature verification failure inside handleWebhook),
//         // we return a 500 status code. This tells Stripe to retry the webhook later.
//         const error = err instanceof Error ? err : new Error("An unknown error occurred.");
//         console.error("Stripe webhook processing failed in http.js:", error.message);
//         // Returning 500 for the final router tells Stripe to retry
//         return new Response(error.message, { status: 500 });
//     }
// });

// // --- TEMPORARY SANITY CHECK ROUTE ---
// const handleTest = httpAction(async () => {
//     return new Response("Test Route Success! The Convex router is working.", { status: 200 });
// });


// // --- HTTP ROUTER DEFINITION ---

// const http = httpRouter();

// // 1. Clerk Webhook Route
// http.route({
//     path: "/clerk-users-webhooks",
//     method: "POST",
//     handler: handleClerkWebhook,
// });

// // 2. Stripe Webhook Route (MUST MATCH Stripe's URL)
// http.route({
//     path: "/stripe-test-01",
//     method: "POST",
//     handler: handleStripeWebhook,
// });

// // 3. SANITY CHECK ROUTE
// http.route({
//     path: "/test-route",
//     method: "GET",
//     handler: handleTest,
// });

// export default http;