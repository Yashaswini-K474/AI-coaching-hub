// import { action, internalAction } from "./_generated/server";
// import { v } from "convex/values";

// // --- MOCK CONSTANTS ---
// // This function generates the redirect URL to our mock payment simulator page,
// // which then redirects to the final success page.
// const MOCK_CHECKOUT_URL = (clerkId, returnUrl) => {
//     // The successUrl is where the user lands after "payment" is confirmed
//     const successUrl = `${returnUrl}/mockpayment?clerkId=${clerkId}`;

//     // The simulator page receives the success URL as a parameter
//     return `/mock_checkout_simulator?redirect_url=${encodeURIComponent(successUrl)}`;
// };

// // --- PUBLIC ACTIONS (Called from the client) ---

// // 1. Initiates the mock payment process (called from credits.jsx)
// export const createCheckoutSession = action({
//     args: {
//         priceKey: v.string(), // e.g., 'price_pro'
//         returnUrl: v.string(), // The client's origin (e.g., http://localhost:3000)
//     },
//     handler: async (ctx, args) => {
//         // 1. Get the authenticated user identity
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("Unauthenticated call to start mock checkout.");
//         }
//         const clerkId = identity.subject;

//         // Returns the URL for the mock simulator page
//         return MOCK_CHECKOUT_URL(clerkId, args.returnUrl);
//     },
// });

// // 2. Completes the mock upgrade (called from ai-knowledge-assistant/mockpayment/page.jsx)
// export const completeMockUpgrade = action({
//     args: {
//         clerkId: v.string(), // Passed from the mock success URL
//     },
//     handler: async (ctx, args) => {
//         // This action validates the call by ensuring the user exists
//         // and then triggers the database change via an internal action.

//         // Call the internal action to update the user's data
//         await ctx.run(internalAction("mockPayments:mockUpgradeInternal"), {
//             clerkId: args.clerkId,
//             subscriptionId: `mock_sub_${args.clerkId}_${Date.now()}`, // Mock ID
//         });

//         return { success: true };
//     },
// });

// // --- INTERNAL ACTION (Runs the database mutation) ---

// // This internal action is run by the completeMockUpgrade action to finalize the DB changes.
// export const mockUpgradeInternal = internalAction({
//     args: {
//         clerkId: v.string(),
//         subscriptionId: v.string(),
//     },
//     handler: async (ctx, args) => {
//         // 1. Find the user by clerkId
//         const user = await ctx.db
//             .query("users")
//             .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
//             .unique();

//         if (!user) {
//             console.error(`User with clerkId ${args.clerkId} not found for mock upgrade.`);
//             return;
//         }

//         // 2. Update the user record with the Pro plan details (100,000 credits)
//         await ctx.db.patch(user._id, {
//             credits: 100000,
//             subscriptionId: args.subscriptionId,
//             isSubscribed: true,
//         });

//         console.log(`User ${user._id} successfully mock-upgraded to Pro Plan.`);
//     }
// });
