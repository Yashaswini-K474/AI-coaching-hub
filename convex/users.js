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

// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// // --- CONSTANTS ---
// // Default credits when a user is on the Free plan or after cancellation.
// const FREE_PLAN_CREDITS = 50000;
// // Name of the table that stores user data
// const USERS_TABLE = "users";

// // --- QUERIES (Client-Facing) ---

// /**
//  * Gets the current user's document based on their Clerk ID.
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


// // --- MUTATIONS (FRONTEND USE) ---

// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         const existingUser = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();

//         if (existingUser) {
//             return existingUser;
//         }

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: identity.name || 'User',
//             email: identity.email,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: null, // Initializing this field to null (allowed by v.optional(v.string()))
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// // Mutation to update subscription after verified payment
// export const updateSubscription = mutation({
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
//             credits: args.newCredits,
//         });

//         console.log(`User ${args.clerkId} successfully updated plan with ${args.newCredits} credits and subscription ${args.subscriptionId}.`);
//     },
// });


// // DEPRECATED/REPLACED: Keeping this simple UpdateUserToken for backwards compatibility, but recommend using the above.
// export const UpdateUserToken = mutation({
//     args: {
//         id: v.id(USERS_TABLE),
//         credits: v.number()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             credits: args.credits
//         })
//     }
// });


// // --- MUTATIONS (INTERNAL USE ONLY - CALLED BY ACTIONS/WEBHOOKS) ---

// /**
//  * Internal-only mutation to retrieve a user document by Clerk ID.
//  * Used by Convex Actions that need user data before making external calls.
//  */
// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });


// /**
//  * Internal-only mutation to downgrade a user's plan after cancellation.
//  * Called by the stripe.cancelPlan action.
//  */
// export const downgradeSubscription = mutation({
//     args: {
//         clerkId: v.string(), // Clerk ID passed from the action
//     },
//     handler: async (ctx, args) => {
//         // Find the user
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             throw new Error("User not found in database for downgrade.");
//         }

//         // Reset credits to the Free Plan limit or keep current credits if lower
//         const newCredits = Math.min(user.credits, FREE_PLAN_CREDITS);

//         // CRITICAL FIX: Setting subscriptionId to null. This must be allowed by schema.ts.
//         await ctx.db.patch(user._id, {
//             subscriptionId: null,
//             credits: newCredits,
//         });

//         console.log(`User ${args.clerkId} successfully reverted to Free Plan status. Credits set to ${newCredits}.`);
//         return { success: true, newCredits };
//     },
// });


// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";
// // Removed: import { Doc, Id } from "./_generated/dataModel"; // This was causing the bundling error.

// // --- CONSTANTS ---
// // Default credits when a user is on the Free plan or after cancellation.
// const FREE_PLAN_CREDITS = 50000;
// // Name of the table that stores user data
// const USERS_TABLE = "users";

// // --- QUERIES (Client-Facing) ---

// /**
//  * Gets the current user's document based on their Clerk ID.
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


// // --- MUTATIONS (FRONTEND USE) ---

// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         const existingUser = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();

//         if (existingUser) {
//             // OPTIONAL: You can update the name/email/image here in case they changed in Clerk
//             // For now, we only return the existing user
//             return existingUser;
//         }

//         // Handle potentially null values from identity and ensure we pass undefined or a string/number.
//         const userEmail = identity.email || undefined;
//         const userName = identity.name || 'User';

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS,
//             // subscriptionId is deliberately omitted or set to undefined 
//             // to conform to the v.optional(v.string()) schema on creation.
//             subscriptionId: undefined,
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// // Mutation to update subscription after verified payment
// // Renamed to setProSubscriptionDetails for clarity and scope management
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
//             credits: args.newCredits,
//         });

//         console.log(`User ${args.clerkId} successfully updated plan with ${args.newCredits} credits and subscription ${args.subscriptionId}.`);
//     },
// });


// // DEPRECATED/REPLACED: Keeping this simple UpdateUserToken for backwards compatibility, but recommend using the above.
// export const UpdateUserToken = mutation({
//     args: {
//         id: v.id(USERS_TABLE),
//         credits: v.number()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             credits: args.credits
//         })
//     }
// });


// // --- MUTATIONS (INTERNAL USE ONLY - CALLED BY ACTIONS/WEBHOOKS) ---

// /**
//  * Internal-only mutation to retrieve a user document by Clerk ID.
//  * Used by Convex Actions that need user data before making external calls.
//  */
// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });


// convex/users.js
// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// // --- CONSTANTS ---
// // Default credits when a user is on the Free plan or after cancellation.
// const FREE_PLAN_CREDITS = 50000;
// // Name of the table that stores user data
// const USERS_TABLE = "users";

// // --- QUERIES (Client-Facing) ---

// /**
//  * Gets the current user's document based on their Clerk ID.
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


// // --- MUTATIONS (FRONTEND USE) ---

// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         const existingUser = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", identity.subject))
//             .unique();

//         if (existingUser) {
//             return existingUser;
//         }

//         // Handle potentially null values from identity and ensure we pass undefined or a string/number.
//         const userEmail = identity.email || undefined;
//         const userName = identity.name || 'User';

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS,
//             // subscriptionId is deliberately omitted or set to undefined 
//             subscriptionId: undefined,
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// // Mutation to update subscription after verified payment
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
//             credits: args.newCredits,
//         });

//         console.log(`User ${args.clerkId} successfully updated plan with ${args.newCredits} credits and subscription ${args.subscriptionId}.`);
//     },
// });


// // DEPRECATED/REPLACED: Keeping this simple UpdateUserToken for backwards compatibility, but recommend using the above.
// export const UpdateUserToken = mutation({
//     args: {
//         id: v.id(USERS_TABLE),
//         credits: v.number()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             credits: args.credits
//         })
//     }
// });


// // --- MUTATIONS (INTERNAL USE ONLY - CALLED BY ACTIONS/WEBHOOKS) ---

// /**
//  * Internal-only mutation to retrieve a user document by Clerk ID.
//  * Used by Convex Actions that need user data before making external calls.
//  */
// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });

// convex/users.js

// // convex/users.js

// // convex/users.js

// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // --- QUERIES ---

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
//  * CRITICAL FIX: Creates a new user record upon first login or returns existing user.
//  * This ensures the user exists in the DB before Stripe action runs.
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

//         // Create new user with initial FREE plan credits
//         const userEmail = identity.email || undefined;
//         const userName = identity.name || 'User';

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS, // Initialize with 50,000 tokens
//             subscriptionId: undefined,
//             plan: 'Free', // Explicitly set plan status
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// // --- MUTATIONS (Internal Use - Critical for Stripe) ---

// /**
//  * Used by Stripe action to reliably fetch the user record for the checkout session.
//  */
// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });

// /**
//  * Mutation to update subscription after verified payment
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
//             credits: PRO_PLAN_CREDITS, // Set credits to the Pro Plan max (100,000)
//             plan: 'Pro', // Update plan status
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan.`);
//     },
// });

// // convex/users.js

// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // --- QUERIES ---

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
//  * Creates user on first login or returns existing user. 
//  * CRITICAL for ensuring a user record exists before the Stripe action runs.
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

//         // Create new user with initial FREE plan credits
//         const userEmail = identity.email || undefined;
//         const userName = identity.name || 'User';

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS, // Initialize with 50,000 tokens
//             subscriptionId: undefined,
//             plan: 'Free', // Explicitly set plan status
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// // --- MUTATIONS (Internal Use) ---

// /**
//  * Used by Stripe action to reliably fetch the user record.
//  */
// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });

// /**
//  * Mutation to update subscription after verified payment (updates tokens and plan status).
//  */
// export const setProSubscriptionDetails = mutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         newCredits: v.number(), // This argument is actually unused now, but kept for signature
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
//             credits: PRO_PLAN_CREDITS, // Set tokens to 100,000
//             plan: 'Pro', // Update plan status
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan.`);
//     },
// });

// // Mutation to handle token consumption (e.g., after using a dashboard feature)
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
//             throw new Error("User record not found.");
//         }

//         const newCredits = user.credits - args.amount;

//         if (newCredits < 0) {
//             throw new Error("Insufficient tokens.");
//         }

//         await ctx.db.patch(user._id, {
//             credits: newCredits,
//         });

//         return newCredits;
//     }
// });

// convex/users.js

// import { query, mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // --- QUERIES ---

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
//  * CRITICAL for Stripe Fix: Creates user on first login or returns existing user.
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
//  * NEW: Mutation to reduce tokens when a user performs an action on the dashboard.
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

// export const getUserInternal = mutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();
//     },
// });

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
//  * Creates user on first login or returns existing user. 
//  * This is primarily for frontend data fetching/display.
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
//  * This is called by the Stripe action.
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

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  * Added for API completeness.
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", args.clerkUserId))
//             .unique();
//     }
// });


// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
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
//  * Internal mutation to safely get or create the user document. 
//  * This is called atomically by the Stripe action before checkout.
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
//  * CRITICAL FIX: Changed from 'mutation' to 'internalMutation'.
//  */
// export const setProSubscriptionDetails = internalMutation({
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

// import { query, mutation, internalMutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// // Use the same constants defined in your frontend for clarity
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

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  * Added for API completeness.
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", args.clerkUserId))
//             .unique();
//     }
// });


// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
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

//         // Use subtraction to get the new credit total
//         const newCredits = (user.credits || 0) - args.amount;

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
//  * Internal mutation to safely get or create the user document. 
//  * This is called atomically by the Stripe action before checkout.
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
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         // Removed newCredits argument as we always use the PRO_PLAN_CREDITS constant
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             console.error(`Attempted to update subscription for user ${args.clerkId} but user not found.`);
//             throw new Error("User not found in database for update.");
//         }

//         await ctx.db.patch(user._id, {
//             subscriptionId: args.subscriptionId,
//             // CRITICAL FIX CONFIRMED: Resetting credits to the full PRO plan amount
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan. Tokens reset to ${PRO_PLAN_CREDITS}.`);
//     },
// });

// // Added for completeness: handling cancellation/downgrade from the webhook
// export const setFreeSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             console.error(`Attempted to downgrade subscription for user ${args.clerkId} but user not found.`);
//             return;
//         }

//         // When downgrading, clear the subscription ID and revert to Free credits
//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: 'Free',
//         });

//         console.log(`User ${args.clerkId} successfully downgraded to Free plan. Tokens reset to ${FREE_PLAN_CREDITS}.`);
//     },
// });

// import { query, mutation, internalMutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// // Use the same constants defined in your frontend for clarity
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

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  * Added for API completeness.
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         return ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", args.clerkUserId))
//             .unique();
//     }
// });


// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
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

//         // Use subtraction to get the new credit total
//         const newCredits = (user.credits || 0) - args.amount;

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
//  * Internal mutation to safely get or create the user document. 
//  * This is called atomically by the Stripe action before checkout.
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
//  * Internal mutation called by the Stripe webhook to update the user subscription status and reset tokens.
//  * This function now explicitly sets credits to PRO_PLAN_CREDITS.
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             console.error(`Attempted to update subscription for user ${args.clerkId} but user not found.`);
//             throw new Error("User not found in database for update.");
//         }

//         await ctx.db.patch(user._id, {
//             subscriptionId: args.subscriptionId,
//             // CRITICAL FIX: Resetting credits to the full PRO plan amount
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan. Tokens reset to ${PRO_PLAN_CREDITS}.`);
//     },
// });

// // Added for completeness: handling cancellation/downgrade from the webhook
// export const setFreeSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db
//             .query(USERS_TABLE)
//             .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkId))
//             .unique();

//         if (!user) {
//             console.error(`Attempted to downgrade subscription for user ${args.clerkId} but user not found.`);
//             return;
//         }

//         // When downgrading, clear the subscription ID and revert to Free credits
//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: 'Free',
//         });

//         console.log(`User ${args.clerkId} successfully downgraded to Free plan. Tokens reset to ${FREE_PLAN_CREDITS}.`);
//     },
// });

// import { query, mutation, internalMutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// const USERS_TABLE = "users";
// // Use the same constants defined in your frontend for clarity
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // Helper function to query by Clerk ID
// // NOTE: Ensure your 'users' table has an index named 'by_clerk_user_id'
// const queryByClerkId = (ctx, clerkId) =>
//     ctx.db
//         .query(USERS_TABLE)
//         .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", clerkId));


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

//         // Use the consistent query helper
//         return queryByClerkId(ctx, identity.subject).unique();
//     }
// });

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // Use the consistent query helper
//         return queryByClerkId(ctx, args.clerkUserId).unique();
//     }
// });


// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) {
//             return null;
//         }

//         const existingUser = await queryByClerkId(ctx, identity.subject).unique();

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

//         const user = await queryByClerkId(ctx, identity.subject).unique();

//         if (!user) {
//             throw new Error("User record not found for token consumption.");
//         }

//         const newCredits = (user.credits || 0) - args.amount;

//         if (newCredits < 0) {
//             throw new Error("Insufficient tokens.");
//         }

//         await ctx.db.patch(user._id, {
//             credits: newCredits,
//         });

//         return newCredits;
//     }
// });


// // --- MUTATIONS (Internal Use: Called by Stripe Webhook and Actions) ---

// /**
//  * Internal mutation to safely get or create the user document. 
//  * This is called atomically by the Stripe action before checkout.
//  * * FIX: This now returns the user's Clerk ID, not the whole object, 
//  * to align with how `stripe.js` uses this to verify the user.
//  */
// export const getOrCreateUserInternal = internalMutation({
//     args: {
//         clerkId: v.string(), // Keeping this argument name consistent with stripe.js
//         email: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // The field name in the database is 'clerkUserId'
//         const existingUser = await queryByClerkId(ctx, args.clerkId).unique();

//         if (existingUser) {
//             return existingUser._id; // Return ID for consistency
//         }

//         // User does not exist, create the document
//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: args.clerkId, // Use the correct database field name
//             name: args.name,
//             email: args.email,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             plan: 'Free',
//         });

//         return newUserId; // Return the new ID
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to update the user subscription status and reset tokens.
//  * This function now uses the correct database key 'clerkUserId'.
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to update subscription for user ${args.clerkId} but user not found.`);
//             throw new Error("User not found in database for update.");
//         }

//         await ctx.db.patch(user._id, {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan. Tokens reset to ${PRO_PLAN_CREDITS}.`);
//     },
// });

// // Added for completeness: handling cancellation/downgrade from the webhook
// export const setFreeSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to downgrade subscription for user ${args.clerkId} but user not found.`);
//             return;
//         }

//         // When downgrading, clear the subscription ID and revert to Free credits
//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: 'Free',
//         });

//         console.log(`User ${args.clerkId} successfully downgraded to Free plan. Tokens reset to ${FREE_PLAN_CREDITS}.`);
//     },
// });

// import { query, mutation, internalMutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";


// const USERS_TABLE = "users";
// // Use the same constants defined in your frontend for clarity
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // Helper function to query by Clerk ID
// // NOTE: Ensure your 'users' table has an index named 'by_clerk_user_id'
// const queryByClerkId = (ctx, clerkId) =>
//     ctx.db
//         .query(USERS_TABLE)
//         .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", clerkId));


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

//         // Use the consistent query helper
//         return queryByClerkId(ctx, identity.subject).unique();
//     }
// });

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // Use the consistent query helper
//         return queryByClerkId(ctx, args.clerkUserId).unique();
//     }
// });


// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) {
//             return null;
//         }

//         const existingUser = await queryByClerkId(ctx, identity.subject).unique();

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
//  * Mutation to reduce tokens when a user performs an action.
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

//         const user = await queryByClerkId(ctx, identity.subject).unique();

//         if (!user) {
//             throw new Error("User record not found for token consumption.");
//         }

//         const newCredits = (user.credits || 0) - args.amount;

//         if (newCredits < 0) {
//             throw new Error("Insufficient tokens.");
//         }

//         await ctx.db.patch(user._id, {
//             credits: newCredits,
//         });

//         return newCredits;
//     }
// });


// // --- MUTATIONS (Internal Use: Called by Webhooks and Internal Actions) ---

// /**
//  * **NEW:** Handles synchronization from Clerk webhooks (create, update, delete).
//  * Ensures the Convex user record matches the state in Clerk.
//  */
// export const syncUser = internalMutation({
//     args: {
//         eventType: v.string(), // e.g., "user.created", "user.updated", "user.deleted"
//         clerkId: v.string(),
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const { eventType, clerkId, name, email } = args;

//         const existingUser = await queryByClerkId(ctx, clerkId).unique();

//         switch (eventType) {
//             case "user.created":
//             case "user.updated":
//                 if (existingUser) {
//                     // Update user name and email
//                     await ctx.db.patch(existingUser._id, {
//                         name: name,
//                         email: email,
//                     });
//                     console.log(`Updated user ${clerkId} via Clerk webhook (${eventType}).`);
//                 } else {
//                     // Create user if they don't exist (e.g., if created directly in Clerk)
//                     await ctx.db.insert(USERS_TABLE, {
//                         clerkUserId: clerkId,
//                         name: name,
//                         email: email,
//                         credits: FREE_PLAN_CREDITS,
//                         subscriptionId: undefined,
//                         plan: 'Free',
//                     });
//                     console.log(`Created new user ${clerkId} via Clerk webhook (${eventType}).`);
//                 }
//                 break;

//             case "user.deleted":
//                 if (existingUser) {
//                     // Delete user record
//                     await ctx.db.delete(existingUser._id);
//                     console.log(`Deleted user ${clerkId} via Clerk webhook.`);
//                 }
//                 break;

//             default:
//                 console.warn(`Unhandled Clerk event type: ${eventType}`);
//                 break;
//         }
//     },
// });

// /**
//  * Internal mutation to safely get or create the user document before a Stripe checkout. 
//  * Returns the Convex User ID.
//  */
// export const getOrCreateUserInternal = internalMutation({
//     args: {
//         clerkId: v.string(),
//         email: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const existingUser = await queryByClerkId(ctx, args.clerkId).unique();

//         if (existingUser) {
//             return existingUser._id;
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

//         return newUserId;
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to grant Pro subscription and reset tokens.
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to update subscription for user ${args.clerkId} but user not found.`);
//             throw new Error("User not found in database for update.");
//         }

//         await ctx.db.patch(user._id, {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         });

//         console.log(`User ${args.clerkId} successfully updated to Pro plan. Tokens reset to ${PRO_PLAN_CREDITS}.`);
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to handle cancellation or downgrade.
//  */
// export const setFreeSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to downgrade subscription for user ${args.clerkId} but user not found.`);
//             return;
//         }

//         // When downgrading, clear the subscription ID and revert to Free credits
//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: 'Free',
//         });

//         console.log(`User ${args.clerkId} successfully downgraded to Free plan. Tokens reset to ${FREE_PLAN_CREDITS}.`);
//     },
// });

// 

// import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";


// const USERS_TABLE = "users";
// // Use the same constants defined in your frontend for clarity
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // Helper function to query by Clerk ID
// // NOTE: Ensure your 'users' table has an index named 'by_clerk_user_id'
// const queryByClerkId = (ctx, clerkId) =>
//     ctx.db
//         .query(USERS_TABLE)
//         .withIndex("by_clerk_user_id", q => q.eq("clerkUserId", clerkId));


// // --- QUERIES (Frontend Use) ---

// /**
//  * Fetches the user document for the currently authenticated user.
//  */
// export const getUser = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }

//         // Use the consistent query helper
//         return queryByClerkId(ctx, identity.subject).unique();
//     }
// });

// /**
//  * Fetches the user document by clerkUserId (often used by internal systems or UserSync).
//  */
// export const getUserByClerkId = query({
//     args: {
//         clerkUserId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // Use the consistent query helper
//         return queryByClerkId(ctx, args.clerkUserId).unique();
//     }
// });


// // --- NEW/UPDATED INTERNAL QUERIES & MUTATIONS (For Stripe) ---

// /**
//  * NEW: Retrieves the Stripe Customer ID for a given Clerk ID.
//  * This was the function we added in the previous step.
//  */
// export const getStripeCustomerId = internalQuery({
//     args: {
//         clerkId: v.string(), // The clerkUserId
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         // Ensure you have a 'stripeCustomerId' field in your 'users' table in schema.ts
//         return user?.stripeCustomerId ?? null;
//     },
// });

// /**
//  * NEW: Retrieves basic user details (email and name) for creating a new Stripe customer.
//  * This is the function that was MISSING and causing the current error.
//  */
// export const getUserDetails = internalQuery({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         // Return only the necessary fields for Stripe Customer creation
//         return user ? { email: user.email, name: user.name } : null;
//     },
// });

// /**
//  * NEW: Saves the newly created Stripe Customer ID back to the user's record.
//  */
// export const setStripeCustomerId = internalMutation({
//     args: {
//         clerkId: v.string(),
//         stripeCustomerId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (user) {
//             await ctx.db.patch(user._id, {
//                 stripeCustomerId: args.stripeCustomerId,
//             });
//             console.log(`Updated user ${args.clerkId} with Stripe Customer ID: ${args.stripeCustomerId}`);
//         }
//     },
// });

// // --- MUTATIONS (Frontend Use) ---

// /**
//  * Creates user on first login or returns existing user. 
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) {
//             return null;
//         }

//         const existingUser = await queryByClerkId(ctx, identity.subject).unique();

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
//             stripeCustomerId: undefined, // Add this if it's missing from your existing setup
//             plan: 'Free',
//         });

//         return ctx.db.get(newUserId);
//     }
// });

// /**
//  * Mutation to reduce tokens when a user performs an action.
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

//         const user = await queryByClerkId(ctx, identity.subject).unique();

//         if (!user) {
//             throw new Error("User record not found for token consumption.");
//         }

//         const newCredits = (user.credits || 0) - args.amount;

//         if (newCredits < 0) {
//             throw new Error("Insufficient tokens.");
//             // The redundant check below is removed: (newCredits < 0)
//         }

//         await ctx.db.patch(user._id, {
//             credits: newCredits,
//         });

//         return newCredits;
//     }
// });

// /**
//  * MOCK: Simulates a successful Stripe payment by immediately setting the Pro plan.
//  * This is for frontend testing only, bypassing Stripe and webhooks.
//  */
// export const mockUpgrade = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("Not authenticated");
//         }

//         const user = await queryByClerkId(ctx, identity.subject).unique();

//         if (!user) {
//             throw new Error("User not found.");
//         }

//         // Apply Pro plan details (simulate setProSubscriptionDetails logic)
//         await ctx.db.patch(user._id, {
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         });

//         console.log(`User ${identity.subject} mock-upgraded to Pro plan.`);

//         // Return the updated user's plan and credits to the frontend
//         return { plan: 'Pro', credits: PRO_PLAN_CREDITS };
//     },
// });


// // --- MUTATIONS (Internal Use: Called by Webhooks and Internal Actions) ---

// /**
//  * **NEW:** Handles synchronization from Clerk webhooks (create, update, delete).
//  * Ensures the Convex user record matches the state in Clerk.
//  */
// export const syncUser = internalMutation({
//     args: {
//         eventType: v.string(), // e.g., "user.created", "user.updated", "user.deleted"
//         clerkId: v.string(),
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const { eventType, clerkId, name, email } = args;

//         const existingUser = await queryByClerkId(ctx, clerkId).unique();

//         switch (eventType) {
//             case "user.created":
//             case "user.updated":
//                 if (existingUser) {
//                     // Update user name and email
//                     await ctx.db.patch(existingUser._id, {
//                         name: name,
//                         email: email,
//                     });
//                     console.log(`Updated user ${clerkId} via Clerk webhook (${eventType}).`);
//                 } else {
//                     // Create user if they don't exist (e.g., if created directly in Clerk)
//                     await ctx.db.insert(USERS_TABLE, {
//                         clerkUserId: clerkId,
//                         name: name,
//                         email: email,
//                         credits: FREE_PLAN_CREDITS,
//                         subscriptionId: undefined,
//                         stripeCustomerId: undefined, // Include this when creating
//                         plan: 'Free',
//                     });
//                     console.log(`Created new user ${clerkId} via Clerk webhook (${eventType}).`);
//                 }
//                 break;

//             case "user.deleted":
//                 if (existingUser) {
//                     // Delete user record
//                     await ctx.db.delete(existingUser._id);
//                     console.log(`Deleted user ${clerkId} via Clerk webhook.`);
//                 }
//                 break;

//             default:
//                 console.warn(`Unhandled Clerk event type: ${eventType}`);
//                 break;
//         }
//     },
// });

// /**
//  * Internal mutation to safely get or create the user document before a Stripe checkout. 
//  * Returns the Convex User ID.
//  */
// export const getOrCreateUserInternal = internalMutation({
//     args: {
//         clerkId: v.string(),
//         email: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const existingUser = await queryByClerkId(ctx, args.clerkId).unique();

//         if (existingUser) {
//             return existingUser._id;
//         }

//         // User does not exist, create the document
//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: args.clerkId,
//             name: args.name,
//             email: args.email,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             stripeCustomerId: undefined, // Include this when creating
//             plan: 'Free',
//         });

//         return newUserId;
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to grant Pro subscription and reset tokens.
//  * UPDATED to handle both subscriptionId and stripeCustomerId (if available).
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         // Assuming your Stripe webhook passes the customerId or you get it from the event
//         stripeCustomerId: v.optional(v.string()),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to update subscription for user ${args.clerkId} but user not found.`);
//             throw new Error("User not found in database for update.");
//         }

//         const updates = {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS,
//             plan: 'Pro',
//         };

//         // Only update stripeCustomerId if it was provided in the internal call
//         if (args.stripeCustomerId) {
//             // @ts-ignore
//             updates.stripeCustomerId = args.stripeCustomerId;
//         }

//         await ctx.db.patch(user._id, updates);

//         console.log(`User ${args.clerkId} successfully updated to Pro plan. Tokens reset to ${PRO_PLAN_CREDITS}.`);
//     },
// });

// /**
//  * Internal mutation called by the Stripe webhook to handle cancellation or downgrade.
//  */
// export const setFreeSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();

//         if (!user) {
//             console.error(`Attempted to downgrade subscription for user ${args.clerkId} but user not found.`);
//             return;
//         }

//         // When downgrading, clear the subscription ID and revert to Free credits
//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: 'Free',
//         });

//         console.log(`User ${args.clerkId} successfully downgraded to Free plan. Tokens reset to ${FREE_PLAN_CREDITS}.`);
//     },
// });

// import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// // === CONSTANTS ===
// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // === HELPER: Get user by Clerk ID ===
// const queryByClerkId = (ctx, clerkId) =>
//     ctx.db.query(USERS_TABLE).withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId));

// // === QUERIES ===
// export const getUser = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) return null;
//         return queryByClerkId(ctx, identity.subject).unique();
//     },
// });

// export const getUserByClerkId = query({
//     args: { clerkUserId: v.string() },
//     handler: async (ctx, args) => queryByClerkId(ctx, args.clerkUserId).unique(),
// });

// // === INTERNAL QUERIES FOR DODO PAYMENTS ===
// export const getUserDetailsForPayment = internalQuery({
//     args: { clerkId: v.string() },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) return null;
//         return { email: user.email, name: user.name };
//     },
// });

// // === MUTATIONS ===

// /**
//  * Creates user on first login or returns existing user.
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) return null;

//         const existingUser = await queryByClerkId(ctx, identity.subject).unique();
//         if (existingUser) return existingUser;

//         const userEmail = identity.email || undefined;
//         const userName = identity.name || "User";

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             dodoCustomerId: undefined,
//             plan: "Free",
//         });

//         return ctx.db.get(newUserId);
//     },
// });

// /**
//  * Deduct credits when user performs an action
//  */
// export const consumeTokens = mutation({
//     args: { amount: v.number() },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");

//         const user = await queryByClerkId(ctx, identity.subject).unique();
//         if (!user) throw new Error("User not found");

//         const newCredits = (user.credits || 0) - args.amount;
//         if (newCredits < 0) throw new Error("Insufficient credits");

//         await ctx.db.patch(user._id, { credits: newCredits });
//         return newCredits;
//     },
// });

// /**
//  * MOCK: Simulates a Dodo Pro upgrade (for testing)
//  */
// export const mockUpgrade = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");

//         const user = await queryByClerkId(ctx, identity.subject).unique();
//         if (!user) throw new Error("User not found");

//         await ctx.db.patch(user._id, {
//             credits: PRO_PLAN_CREDITS,
//             plan: "Pro",
//         });

//         console.log(`User ${identity.subject} upgraded to Pro (mock).`);
//         return { plan: "Pro", credits: PRO_PLAN_CREDITS };
//     },
// });

// // === INTERNAL MUTATIONS USED BY DODO WEBHOOKS ===

// /**
//  * Called when Dodo payment is successful.
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         dodoCustomerId: v.optional(v.string()),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) throw new Error("User not found");

//         const updates = {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS,
//             plan: "Pro",
//         };

//         if (args.dodoCustomerId) updates.dodoCustomerId = args.dodoCustomerId;

//         await ctx.db.patch(user._id, updates);
//         console.log(`✅ User ${args.clerkId} upgraded via Dodo Payments.`);
//     },
// });

// /**
//  * Called when Dodo subscription is cancelled or failed.
//  */
// export const setFreeSubscriptionDetails = internalMutation({
//     args: { clerkId: v.string() },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) return;

//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: "Free",
//         });

//         console.log(`🔄 User ${args.clerkId} downgraded to Free plan.`);
//     },
// });

// /**
//  * Sync user info from Clerk webhooks (create/update/delete)
//  */
// export const syncUser = internalMutation({
//     args: {
//         eventType: v.string(),
//         clerkId: v.string(),
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const { eventType, clerkId, name, email } = args;
//         const existingUser = await queryByClerkId(ctx, clerkId).unique();

//         switch (eventType) {
//             case "user.created":
//             case "user.updated":
//                 if (existingUser) {
//                     await ctx.db.patch(existingUser._id, { name, email });
//                     console.log(`Updated user ${clerkId} (${eventType})`);
//                 } else {
//                     await ctx.db.insert(USERS_TABLE, {
//                         clerkUserId: clerkId,
//                         name,
//                         email,
//                         credits: FREE_PLAN_CREDITS,
//                         subscriptionId: undefined,
//                         dodoCustomerId: undefined,
//                         plan: "Free",
//                     });
//                     console.log(`Created user ${clerkId} via Clerk webhook.`);
//                 }
//                 break;

//             case "user.deleted":
//                 if (existingUser) {
//                     await ctx.db.delete(existingUser._id);
//                     console.log(`Deleted user ${clerkId}`);
//                 }
//                 break;

//             default:
//                 console.warn(`Unhandled Clerk event type: ${eventType}`);
//                 break;
//         }
//     },
// });

// import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";

// // === CONSTANTS ===
// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 100000;
// const FREE_PLAN_CREDITS = 50000;

// // === HELPER: Get user by Clerk ID ===
// const queryByClerkId = (ctx, clerkId) =>
//     ctx.db.query(USERS_TABLE).withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId));

// // === QUERIES ===
// export const getUser = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) return null;
//         return queryByClerkId(ctx, identity.subject).unique();
//     },
// });

// export const getUserByClerkId = query({
//     args: { clerkUserId: v.string() },
//     handler: async (ctx, args) => queryByClerkId(ctx, args.clerkUserId).unique(),
// });

// // === INTERNAL QUERIES FOR DODO PAYMENTS ===
// export const getUserDetailsForPayment = internalQuery({
//     args: { clerkId: v.string() },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) return null;
//         return { email: user.email, name: user.name };
//     },
// });

// // ADD THIS NEW INTERNAL QUERY HERE
// export const getByAuthId = internalQuery({
//     args: { authId: v.string() },
//     handler: async (ctx, { authId }) => {
//         // identity.subject is the Clerk ID, which is stored as clerkUserId in your schema
//         return await queryByClerkId(ctx, authId).unique();
//     },
// });

// // === MUTATIONS ===

// /**
//  * Creates user on first login or returns existing user.
//  */
// export const getOrCreateUser = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity || !identity.subject) return null;

//         const existingUser = await queryByClerkId(ctx, identity.subject).unique();
//         if (existingUser) return existingUser;

//         const userEmail = identity.email || undefined;
//         const userName = identity.name || "User";

//         const newUserId = await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: identity.subject,
//             name: userName,
//             email: userEmail,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             dodoCustomerId: undefined,
//             plan: "Free",
//         });

//         return ctx.db.get(newUserId);
//     },
// });


// export const getByDodoCustomerId = internalQuery({
//   args: { dodoCustomerId: v.string() },
//   handler: async (ctx, { dodoCustomerId }) => {
//     return await ctx.db
//       .query("users")
//       .withIndex("by_dodo_customer_id", (q) =>
//         q.eq("dodoCustomerId", dodoCustomerId)
//       )
//       .unique();
//   },
// });

// /**
//  * Deduct credits when user performs an action
//  */
// export const consumeTokens = mutation({
//     args: { amount: v.number() },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");

//         const user = await queryByClerkId(ctx, identity.subject).unique();
//         if (!user) throw new Error("User not found");

//         const newCredits = (user.credits || 0) - args.amount;
//         if (newCredits < 0) throw new Error("Insufficient credits");

//         await ctx.db.patch(user._id, { credits: newCredits });
//         return newCredits;
//     },
// });

// /**
//  * MOCK: Simulates a Dodo Pro upgrade (for testing)
//  */
// export const mockUpgrade = mutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) throw new Error("Not authenticated");

//         const user = await queryByClerkId(ctx, identity.subject).unique();
//         if (!user) throw new Error("User not found");

//         await ctx.db.patch(user._id, {
//             credits: PRO_PLAN_CREDITS,
//             plan: "Pro",
//         });

//         console.log(`User ${identity.subject} upgraded to Pro (mock).`);
//         return { plan: "Pro", credits: PRO_PLAN_CREDITS };
//     },
// });

// // === INTERNAL MUTATIONS USED BY DODO WEBHOOKS ===

// /**
//  * Called when Dodo payment is successful.
//  */
// export const setProSubscriptionDetails = internalMutation({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//         dodoCustomerId: v.optional(v.string()),
//     },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) throw new Error("User not found");

//         const updates = {
//             subscriptionId: args.subscriptionId,
//             credits: PRO_PLAN_CREDITS,
//             plan: "Pro",
//         };

//         if (args.dodoCustomerId) updates.dodoCustomerId = args.dodoCustomerId;

//         await ctx.db.patch(user._id, updates);
//         console.log(`✅ User ${args.clerkId} upgraded via Dodo Payments.`);
//     },
// });

// /**
//  * Called when Dodo subscription is cancelled or failed.
//  */
// export const setFreeSubscriptionDetails = internalMutation({
//     args: { clerkId: v.string() },
//     handler: async (ctx, args) => {
//         const user = await queryByClerkId(ctx, args.clerkId).unique();
//         if (!user) return;

//         await ctx.db.patch(user._id, {
//             subscriptionId: undefined,
//             credits: FREE_PLAN_CREDITS,
//             plan: "Free",
//         });

//         console.log(`🔄 User ${args.clerkId} downgraded to Free plan.`);
//     },
// });

// /**
//  * Sync user info from Clerk webhooks (create/update/delete)
//  */
// export const syncUser = internalMutation({
//     args: {
//         eventType: v.string(),
//         clerkId: v.string(),
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const { eventType, clerkId, name, email } = args;
//         const existingUser = await queryByClerkId(ctx, clerkId).unique();

//         switch (eventType) {
//             case "user.created":
//             case "user.updated":
//                 if (existingUser) {
//                     await ctx.db.patch(existingUser._id, { name, email });
//                     console.log(`Updated user ${clerkId} (${eventType})`);
//                 } else {
//                     await ctx.db.insert(USERS_TABLE, {
//                         clerkUserId: clerkId,
//                         name,
//                         email,
//                         credits: FREE_PLAN_CREDITS,
//                         subscriptionId: undefined,
//                         dodoCustomerId: undefined,
//                         plan: "Free",
//                     });
//                     console.log(`Created user ${clerkId} via Clerk webhook.`);
//                 }
//                 break;

//             case "user.deleted":
//                 if (existingUser) {
//                     await ctx.db.delete(existingUser._id);
//                     console.log(`Deleted user ${clerkId}`);
//                 }
//                 break;

//             default:
//                 console.warn(`Unhandled Clerk event type: ${eventType}`);
//                 break;
//         }
//     },
// });

// import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api";
// import { ConvexError } from "convex/values";

// // === CONSTANTS ===
// const USERS_TABLE = "users";
// const PRO_PLAN_CREDITS = 200000;
// const FREE_PLAN_CREDITS = 50000;

// // === HELPER: Get user by Clerk ID ===
// const queryByClerkId = (ctx, clerkId) =>
//   ctx.db.query(USERS_TABLE).withIndex("by_clerk_user_id", (q) =>
//     q.eq("clerkUserId", clerkId)
//   );

// // === QUERIES ===
// export const getUser = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;
//     return queryByClerkId(ctx, identity.subject).unique();
//   },
// });

// export const getUserByClerkId = query({
//   args: { clerkUserId: v.string() },
//   handler: async (ctx, args) => queryByClerkId(ctx, args.clerkUserId).unique(),
// });

// export const getCurrentUser = query({
//   // args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (identity === null) {
//       return null;
//     }

//     // return await ctx.db
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerk_user_id", (q) => 
//         q.eq("clerkUserId", identity.subject)
//       )
//       .unique();

//      // Step 2: Check if the user exists and apply the reactivity fix
//     if (user) {
//         // 🔥 CRITICAL: Read the lastRefreshed field.
//         // This is the core fix to ensure the useQuery refreshes when touchUser runs.
//         const lastRefreshedTimestamp = user.lastRefreshed; 

//         // Return the full user object, which includes the updated tokens/plan
//         return user;
//     }

//     // Step 3: Return null if the user is not found
//     return null; 
//   },
// });


// // === INTERNAL QUERIES FOR DODO PAYMENTS ===
// export const getUserDetailsForPayment = internalQuery({
//   args: { clerkId: v.string() },
//   handler: async (ctx, args) => {
//     const user = await queryByClerkId(ctx, args.clerkId).unique();
//     if (!user) return null;
//     return { email: user.email, name: user.name };
//   },
// });

// // Helper internal query
// export const getByAuthId = internalQuery({
//   args: { authId: v.string() },
//   handler: async (ctx, { authId }) => {
//     return await ctx.db
//       .query("users")
//       .withIndex("by_clerk_user_id", (q) => 
//         q.eq("clerkUserId", authId)
//       )
//       .unique();
//   },
// });

// export const getByDodoCustomerId = internalQuery({
//   args: { dodoCustomerId: v.string() },
//   handler: async (ctx, { dodoCustomerId }) => {
//     return await ctx.db
//       .query("users")
//       .withIndex("by_dodo_customer_id", (q) =>
//         q.eq("dodoCustomerId", dodoCustomerId)
//       )
//       .unique();
//   },
// });

// // === MUTATIONS ===
// export const getOrCreateUser = mutation({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity || !identity.subject) return null;

//     const existingUser = await queryByClerkId(ctx, identity.subject).unique();
//     if (existingUser) return existingUser;

//     const userEmail = identity.email || undefined;
//     const userName = identity.name || "User";

//     const newUserId = await ctx.db.insert(USERS_TABLE, {
//       clerkUserId: identity.subject,
//       name: userName,
//       email: userEmail,
//       credits: FREE_PLAN_CREDITS,
//       subscriptionId: undefined,
//       dodoCustomerId: undefined,
//       plan: "Free",
//       lastRefreshed: Date.now(),
//     });

//     return ctx.db.get(newUserId);
//   },
// });

// export const consumeTokens = mutation({
//   args: { amount: v.number() },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     const user = await queryByClerkId(ctx, identity.subject).unique();
//     if (!user) throw new Error("User not found");

//     const newCredits = (user.credits || 0) - args.amount;
//     if (newCredits < 0) throw new Error("Insufficient credits");

//     await ctx.db.patch(user._id, { credits: newCredits });
//     return newCredits;
//   },
// });

// export const mockUpgrade = mutation({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     const user = await queryByClerkId(ctx, identity.subject).unique();
//     if (!user) throw new Error("User not found");

//     await ctx.db.patch(user._id, {
//       credits: PRO_PLAN_CREDITS,
//       plan: "Pro",
//     });

//     console.log(`User ${identity.subject} upgraded to Pro (mock).`);
//     return { plan: "Pro", credits: PRO_PLAN_CREDITS };
//   },
// });

// // === INTERNAL MUTATIONS USED BY DODO WEBHOOKS ===
// export const setProSubscriptionDetails = internalMutation({
//   args: {
//     clerkId: v.string(),
//     subscriptionId: v.string(),
//     dodoCustomerId: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const user = await queryByClerkId(ctx, args.clerkId).unique();
//     if (!user) throw new Error("User not found");

//     const updates = {
//       subscriptionId: args.subscriptionId,
//       credits: PRO_PLAN_CREDITS,
//       plan: "Pro",
//     };

//     if (args.dodoCustomerId) updates.dodoCustomerId = args.dodoCustomerId;

//     await ctx.db.patch(user._id, updates);
//     console.log(`✅ User ${args.clerkId} upgraded via Dodo Payments.`);
//   },
// });

// export const setFreeSubscriptionDetails = internalMutation({
//   args: { clerkId: v.string() },
//   handler: async (ctx, args) => {
//     const user = await queryByClerkId(ctx, args.clerkId).unique();
//     if (!user) return;

//     await ctx.db.patch(user._id, {
//       subscriptionId: undefined,
//       credits: FREE_PLAN_CREDITS,
//       plan: "Free",
//     });

//     console.log(`🔄 User ${args.clerkId} downgraded to Free plan.`);
//   },
// });

// /**
//  * ✅ NEW: Save Dodo Customer ID (fixes the missing function)
//  */
// export const saveDodoCustomerId = internalMutation({
//   args: {
//     clerkId: v.string(),
//     dodoCustomerId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await queryByClerkId(ctx, args.clerkId).unique();
//     if (!user) throw new Error("User not found");

//     await ctx.db.patch(user._id, { dodoCustomerId: args.dodoCustomerId });
//     console.log(`💾 Saved Dodo Customer ID for user ${args.clerkId}`);
//   },
// });

// // === CLERK WEBHOOK SYNC ===
// export const syncUser = internalMutation({
//   args: {
//     eventType: v.string(),
//     clerkId: v.string(),
//     name: v.string(),
//     email: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const { eventType, clerkId, name, email } = args;
//     const existingUser = await queryByClerkId(ctx, clerkId).unique();


//     switch (eventType) {
//       case "user.created":
//       case "user.updated":
//         if (existingUser) {
//           await ctx.db.patch(existingUser._id, { name, email });
//           console.log(`Updated user ${clerkId} (${eventType})`);
//         } else {
//           await ctx.db.insert(USERS_TABLE, {
//             clerkUserId: clerkId,
//             name,
//             email,
//             credits: FREE_PLAN_CREDITS,
//             subscriptionId: undefined,
//             dodoCustomerId: undefined,
//             plan: "Free",
//             lastRefreshed: Date.now(),
//           });
//           console.log(`Created user ${clerkId} via Clerk webhook.`);
//         }
//         break;

//       case "user.deleted":
//         if (existingUser) {
//           await ctx.db.delete(existingUser._id);
//           console.log(`Deleted user ${clerkId}`);
//         }
//         break;

//       default:
//         console.warn(`Unhandled Clerk event type: ${eventType}`);
//         break;
//     }
//   },
// });

import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";

// === CONSTANTS ===
const USERS_TABLE = "users";
const PRO_PLAN_CREDITS = 200000;
const FREE_PLAN_CREDITS = 50000;

// === HELPER: Get user by Clerk ID ===
const queryByClerkId = (ctx, clerkId) =>
  ctx.db.query(USERS_TABLE).withIndex("by_clerk_user_id", (q) =>
    q.eq("clerkUserId", clerkId)
  );

// === QUERIES ===
export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return queryByClerkId(ctx, identity.subject).unique();
  },
});

export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => queryByClerkId(ctx, args.clerkUserId).unique(),
});

export const getCurrentUser = query({
  // args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }

    // return await ctx.db
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .unique();

    // Step 2: Check if the user exists and apply the reactivity fix
    if (user) {
      // 🔥 CRITICAL: Read the lastRefreshed field.
      // This is the core fix to ensure the useQuery refreshes when touchUser runs.
      const lastRefreshedTimestamp = user.lastRefreshed;

      // Return the full user object, which includes the updated tokens/plan
      return user;
    }

    // Step 3: Return null if the user is not found
    return null;
  },
});


// === INTERNAL QUERIES FOR DODO PAYMENTS ===
export const getUserDetailsForPayment = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await queryByClerkId(ctx, args.clerkId).unique();
    if (!user) return null;
    return { email: user.email, name: user.name };
  },
});

// Helper internal query
export const getByAuthId = internalQuery({
  args: { authId: v.string() },
  handler: async (ctx, { authId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", authId)
      )
      .unique();
  },
});

export const getByDodoCustomerId = internalQuery({
  args: { dodoCustomerId: v.string() },
  handler: async (ctx, { dodoCustomerId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_dodo_customer_id", (q) =>
        q.eq("dodoCustomerId", dodoCustomerId)
      )
      .unique();
  },
});

// === MUTATIONS ===
export const getOrCreateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.subject) return null;

    const existingUser = await queryByClerkId(ctx, identity.subject).unique();
    if (existingUser) return existingUser;

    const userEmail = identity.email || undefined;
    const userName = identity.name || "User";

    const newUserId = await ctx.db.insert(USERS_TABLE, {
      clerkUserId: identity.subject,
      name: userName,
      email: userEmail,
      credits: FREE_PLAN_CREDITS,
      subscriptionId: undefined,
      dodoCustomerId: undefined,
      plan: "Free",
      lastRefreshed: Date.now(),
    });

    return ctx.db.get(newUserId);
  },
});

export const consumeTokens = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await queryByClerkId(ctx, identity.subject).unique();
    if (!user) throw new Error("User not found");

    const newCredits = (user.credits || 0) - args.amount;
    if (newCredits < 0) throw new Error("Insufficient credits");

    await ctx.db.patch(user._id, { credits: newCredits });
    return newCredits;
  },
});

export const UpdateUserToken = mutation({
  args: {
    id: v.id("users"),
    credits: v.number()
  },
  handler: async (ctx, { id, credits }) => {
    const user = await ctx.db.get(id);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(id, { credits });

    console.log(`🔄 Updated user credits to ${credits}`);

    return { success: true };
  }
});


export const mockUpgrade = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await queryByClerkId(ctx, identity.subject).unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      credits: PRO_PLAN_CREDITS,
      plan: "Pro",
    });

    console.log(`User ${identity.subject} upgraded to Pro (mock).`);
    return { plan: "Pro", credits: PRO_PLAN_CREDITS };
  },
});

// === INTERNAL MUTATIONS USED BY DODO WEBHOOKS ===
export const setProSubscriptionDetails = internalMutation({
  args: {
    clerkId: v.string(),
    subscriptionId: v.string(),
    dodoCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await queryByClerkId(ctx, args.clerkId).unique();
    if (!user) throw new Error("User not found");

    const updates = {
      subscriptionId: args.subscriptionId,
      credits: PRO_PLAN_CREDITS,
      plan: "Pro",
    };

    if (args.dodoCustomerId) updates.dodoCustomerId = args.dodoCustomerId;

    await ctx.db.patch(user._id, updates);
    console.log(`✅ User ${args.clerkId} upgraded via Dodo Payments.`);
  },
});

export const setFreeSubscriptionDetails = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await queryByClerkId(ctx, args.clerkId).unique();
    if (!user) return;

    await ctx.db.patch(user._id, {
      subscriptionId: undefined,
      credits: FREE_PLAN_CREDITS,
      plan: "Free",
    });

    console.log(`🔄 User ${args.clerkId} downgraded to Free plan.`);
  },
});

/**
 * ✅ NEW: Save Dodo Customer ID (fixes the missing function)
 */
export const saveDodoCustomerId = internalMutation({
  args: {
    clerkId: v.string(),
    dodoCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await queryByClerkId(ctx, args.clerkId).unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { dodoCustomerId: args.dodoCustomerId });
    console.log(`💾 Saved Dodo Customer ID for user ${args.clerkId}`);
  },
});

// === CLERK WEBHOOK SYNC ===
export const syncUser = internalMutation({
  args: {
    eventType: v.string(),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { eventType, clerkId, name, email } = args;
    const existingUser = await queryByClerkId(ctx, clerkId).unique();


    switch (eventType) {
      case "user.created":
      case "user.updated":
        if (existingUser) {
          await ctx.db.patch(existingUser._id, { name, email });
          console.log(`Updated user ${clerkId} (${eventType})`);
        } else {
          await ctx.db.insert(USERS_TABLE, {
            clerkUserId: clerkId,
            name,
            email,
            credits: FREE_PLAN_CREDITS,
            subscriptionId: undefined,
            dodoCustomerId: undefined,
            plan: "Free",
            lastRefreshed: Date.now(),
          });
          console.log(`Created user ${clerkId} via Clerk webhook.`);
        }
        break;

      case "user.deleted":
        if (existingUser) {
          await ctx.db.delete(existingUser._id);
          console.log(`Deleted user ${clerkId}`);
        }
        break;

      default:
        console.warn(`Unhandled Clerk event type: ${eventType}`);
        break;
    }
  },
});
