// /// <reference types="node" /> 
// // convex/clerk.js 
// import { action } from "./_generated/server";
// import { internal } from "./_generated/api"; // Ensure 'internal' is imported correctly
// // Remember to run: npm install svix
// import { Webhook } from "svix";

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// // This function receives the external HTTP request from Clerk
// export const handleClerkWebhook = action({
//     // The second argument is the raw Request object from the HTTP route
//     handler: async (ctx, request) => {

//         // 1. Extract body and headers from the raw Request object
//         // Use .clone() in case the body is needed multiple times
//         const body = await request.text();
//         const svixHeaders = {
//             "svix-id": request.headers.get("svix-id"),
//             "svix-timestamp": request.headers.get("svix-timestamp"),
//             "svix-signature": request.headers.get("svix-signature"),
//         };

//         if (!WEBHOOK_SECRET) {
//             console.error("CLERK_WEBHOOK_SECRET not configured!");
//             return new Response("Error: CLERK_WEBHOOK_SECRET missing", { status: 500 });
//         }

//         // 2. Verify the webhook signature for security
//         const wh = new Webhook(WEBHOOK_SECRET);
//         let event;
//         try {
//             event = wh.verify(body, svixHeaders);
//         } catch (err) {
//             console.error("Error verifying webhook:", err);
//             return new Response("Error verifying webhook", { status: 400 });
//         }


//         if (event.type === "user.created" || event.type === "user.updated") {
//             const userData = event.data;

//             // 3. Call the internal mutation (syncUser)
//             await ctx.runMutation(internal.users.syncUser, {
//                 clerkUserId: userData.id,
//                 // Handle missing names gracefully
//                 name: (userData.first_name || "") + " " + (userData.last_name || ""),
//                 email: userData.email_addresses[0]?.email_address || "",
//             });
//         }

//         // Return a 200 OK response on success
//         return new Response(null, { status: 200 });
//     },
// });

// This file requires installation of the 'svix' package.

// This file requires installation of the 'svix' package.

// convex/webhooks.js (Handles Database Logic ONLY)
// import { v } from "convex/values";
// import { internalMutation } from "./_generated/server";

// // This mutation receives the validated data from the HTTP action (see http.js)
// export const handleClerkEvent = internalMutation({
//     args: {
//         eventType: v.string(),
//         userData: v.any(), // Use v.any() or define a schema for validated Clerk data
//         clerkId: v.string(),
//     },
//     handler: async (ctx, { eventType, userData, clerkId }) => {
//         const { db } = ctx;

//         // Use the validated data to perform DB operations (as you had before)
//         if (eventType === "user.created" || eventType === "user.updated") {
//             const existingUser = await db
//                 .query("users")
//                 .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
//                 .unique();

//             if (existingUser) {
//                 await db.patch(existingUser._id, userData);
//             } else if (eventType === "user.created") {
//                 await db.insert("users", userData);
//             }
//         } else if (eventType === "user.deleted") {
//             const userToDelete = await db
//                 .query("users")
//                 .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
//                 .unique();

//             if (userToDelete) {
//                 await db.delete(userToDelete._id);
//             }
//         } else {
//             console.warn(`Unhandled webhook event type: ${eventType}`);
//         }
//     },
// });

// convex/webhooks.js (Internal Mutation for Database Operations)
// import { v } from "convex/values";
// import { internalMutation } from "./_generated/server";

// // This mutation is called by the httpAction after the webhook signature is verified.
// export const syncUser = internalMutation({
//     args: {
//         eventType: v.string(), // "user.created", "user.updated", "user.deleted"
//         clerkId: v.string(),
//         name: v.string(),
//         email: v.string(),
//         // Add other necessary fields here
//     },
//     handler: async (ctx, args) => {
//         const { db } = ctx;
//         const { eventType, clerkId, name, email } = args;

//         const userData = { clerkId, name, email, credits: 50000 };

//         if (eventType === "user.created" || eventType === "user.updated") {
//             // 1. Find existing user
//             const existingUser = await db
//                 .query("users")
//                 .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
//                 .unique();

//             if (existingUser) {
//                 // 2. Update existing user
//                 await db.patch(existingUser._id, userData);
//                 console.log(`Updated user: ${clerkId}`);
//             } else if (eventType === "user.created") {
//                 // 3. Create new user on 'user.created'
//                 await db.insert("users", userData);
//                 console.log(`Created new user: ${clerkId}`);
//             }
//         } else if (eventType === "user.deleted") {
//             // 4. Delete user record
//             const userToDelete = await db
//                 .query("users")
//                 .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
//                 .unique();

//             if (userToDelete) {
//                 await db.delete(userToDelete._id);
//                 console.log(`Deleted user: ${clerkId}`);
//             }
//         } else {
//             console.warn(`Unhandled webhook event type: ${eventType}`);
//         }
//     },
// });