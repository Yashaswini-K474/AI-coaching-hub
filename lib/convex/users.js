// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateUser = mutation({
//     args: {
//         name: v.string(),
//         email: v.string()

//     },
//     handler: async (ctx, args) => {
//         //if user already exist
//         const userData = await ctx.db.query('users')
//             .filter(q => q.eq(q.field('email'), args.email))
//             .collect();

//         //if not then add new user
//         if (userData?.length == 0) {
//             const data = {
//                 name: args.name,
//                 email: args.email,
//                 credits: 50000
//             }
//             const result = await ctx.db.insert('users', {
//                 ...data

//             });

//             return data;
//         }
//         return userData[0]
//     }
// })


// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateUser = mutation({
//     args: {
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // ✅ 1. Require authenticated user
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("Unauthorized");
//         }

//         // ✅ 2. Check if user already exists
//         const existingUsers = await ctx.db
//             .query("users")
//             .filter(q => q.eq(q.field("email"), args.email))
//             .collect();

//         if (existingUsers.length > 0) {
//             return existingUsers[0]; // Return existing user
//         }

//         // ✅ 3. Insert new user
//         const user = {
//             name: args.name,
//             email: args.email,
//             credits: 50000,
//             tokenIdentifier: identity.tokenIdentifier, // Optional: save token identity
//         };

//         const insertedId = await ctx.db.insert("users", user);

//         return {
//             ...user,
//             _id: insertedId,
//         };
//     },
// });


// convex/users.js

// // convex/users.js

// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateUser = mutation({
//     args: {
//         name: v.string(),
//         email: v.string()
//     },
//     handler: async (ctx, args) => {
//         // 🛑 CRITICAL FIX: Get identity for secure lookup and saving
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("User not authenticated.");
//         }
//         const clerkUserId = identity.subject;

//         // 🛑 FIX: Query by the indexed clerkUserId field
//         const userData = await ctx.db.query('users')
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", clerkUserId))
//             .unique();

//         if (!userData) {
//             const data = {
//                 name: args.name,
//                 email: args.email,
//                 clerkUserId: clerkUserId, // ✅ CRITICAL: Ensure Clerk ID is saved
//                 credits: 50000
//             }

//             const resultId = await ctx.db.insert('users', data);
//             const newUser = await ctx.db.get(resultId);
//             return newUser;
//         }

//         return userData;
//     }
// })


// convex/users.js - CORRECTED FOR WEBHOOK USE

// import { v } from "convex/values";
// import { internalMutation } from "./_generated/server"; // ✅ FIX 1: Change import to internalMutation

// // Renamed the export for clarity (recommended, but you can stick to CreateUser)
// export const syncUser = internalMutation({
//     args: {
//         // ✅ FIX 2: Accept the Clerk User ID directly from the trusted webhook handler.
//         clerkUserId: v.string(),
//         name: v.string(),
//         email: v.string()
//     },
//     handler: async (ctx, args) => {
//         // 🛑 The identity check is REMOVED. The webhook handler is responsible for authentication.
//         const clerkUserId = args.clerkUserId;

//         // 1. Query by the indexed clerkUserId field
//         const userData = await ctx.db.query('users')
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", clerkUserId))
//             .unique();

//         if (!userData) {
//             const data = {
//                 name: args.name,
//                 email: args.email,
//                 clerkUserId: clerkUserId, // Store the Clerk ID
//                 credits: 50000
//             }

//             const resultId = await ctx.db.insert('users', data);
//             const newUser = await ctx.db.get(resultId);
//             return newUser;
//         }

//         // Return existing data (useful for user.updated events)
//         return userData;
//     }
// })

// convex/users.js (Public Mutation - If needed for frontend interaction)

// convex/users.js

// import { mutation } from "./_generated/server";
// // ... (Your other imports like internalMutation, v, etc.)

// // This is the PUBLIC function the frontend is looking for.
// export const CreateUser = mutation(async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//         throw new Error("User not authenticated.");
//     }

//     // You should use this function to create the initial user record.
//     // NOTE: This logic should handle creating the user if they don't exist.
//     // It should NOT conflict with your webhook logic.
//     const existingUser = await ctx.db
//         .query('users')
//         .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
//         .unique();

//     if (!existingUser) {
//         // Only create if the user does not exist
//         return ctx.db.insert('users', {
//             clerkId: identity.subject,
//             name: identity.name || 'User',
//             email: identity.email,
//             credits: 50000 // Initial value
//             // ... other fields
//         });
//     }

//     return existingUser;
// });

// convex/users.js
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // This query is safe to call from the frontend to retrieve the current user's data.
// export const getUser = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         // Return the user document if found, created by the webhook.
//         return ctx.db
//             .query("users")
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject)) // <-- FIXED: Use schema names
//             .unique();
//     }
// });


// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         const existingUser = await ctx.db
//             .query('users')
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject)) // <-- FIXED: Use schema names
//             .unique();

//         if (existingUser) {
//             return existingUser;
//         }

//         // CRITICAL FIX: Ensure the field name matches the schema
//         const newUserId = await ctx.db.insert('users', {
//             clerkUserId: identity.subject, // <-- FIXED: Use 'clerkUserId'
//             name: identity.name || 'User',
//             email: identity.email,
//             credits: 50000, // Initial value
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// export const UpdateUserToken = mutation({
//     args: {
//         id: v.id('users'),
//         credits: v.number()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             credits: args.credits
//         })
//     }
// })

// import { query, mutation, internalMutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // --- QUERIES ---

// /**
//  * Fetches the user document for the currently authenticated user.
//  */
// export const getUser = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();
//     }
// });

// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user (used by frontend sync).
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) {
//             return null;
//         }

//         const existingUser = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();

//         if (existingUser) {
//             return existingUser;
//         }

//         const userEmail = identity.email || undefined;
//         const userName = identity.name || 'User';

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             plan: 'Free',
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// /**
//  * Mutation to reduce tokens when a user performs an action on the dashboard.
//  */
// export const consumeTokens = mutation({
//     args: {
//         amount: v.number(),
//     },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("Not authenticated");
//         }

//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();

//         if (!user) {
//             throw new Error("User record not found for token consumption.");
//         }

//         const newCredits = user.credits - args.amount;

//         if (newCredits < 0) {
//             // Do not allow negative tokens
//             throw new Error("Insufficient tokens.");
//         }

//         await ctx.db.patch(user._id, {
//             credits: newCredits,
//         });

//         return newCredits;
//     }
// });


// // --- MUTATIONS (Internal Use) ---

// /**
//  * CRITICAL FIX: Internal mutation to safely get or create the user document.
//  * This is called atomically by the Stripe action to prevent the race condition.
//  */
// export const getOrCreateUserInternal = internalMutation({
//     args: {
//         clerkId: v.string(),
//         email: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const existingUser = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (existingUser) {
//             // User exists, return it
//             return existingUser;
//         }

//         // User does not exist, create the document
//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: args.clerkId,
//             name: args.name,
//             email: args.email,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             plan: 'Free',
//         });

//         return ctx.db.get(newUserId);
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to update the user subscription status.
//  */
// export const setProSubscriptionDetails = mutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         newCredits: v.number(),
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             throw new Error("User not found in database for update.");
//         }

//         await ctx.db.patch(user._id, {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS, // Set tokens to 100,000 after upgrade
//             plan: 'Pro',
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan.`);
//     },
// });
