// import { action } from "./_generated/server";
// import { api } from "./_generated/api";
// import Stripe from 'stripe';
// import { v } from "convex/values";

// // Initialize Stripe with the Secret Key from Convex Environment Variables
// // IMPORTANT: The environment variable STRIPE_SECRET_KEY must be set in your Convex dashboard.
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     // Pinning the API version is a good practice
//     apiVersion: '2023-10-16',
// });

// /**
//  * Action to verify a successful Stripe Checkout Session and update the user's Convex document.
//  * Handles both one-time payments ('payment') and subscriptions ('subscription').
//  */
// export const verifyPayment = action({
//     args: { sessionId: v.string() },
//     handler: async (ctx, args) => {
//         const { sessionId } = args;
//         try {
//             // 1. Fetch the session details from Stripe
//             let session;
//             try {
//                 session = await stripe.checkout.sessions.retrieve(sessionId);
//             } catch (error) {
//                 console.error("CRITICAL ERROR: Stripe session retrieval failed:", error);
//                 return { success: false, message: "Internal Stripe API call failed. Check Convex logs for STRIPE_SECRET_KEY issues." };
//             }

//             // 2. Validate Payment Status
//             if (session.payment_status !== 'paid') {
//                 console.warn(`Stripe: Session ${sessionId} failed verification. Status: ${session.payment_status}.`);
//                 return { success: false, message: "Payment not completed." };
//             }

//             const clerkUserId = session.client_reference_id;
//             const isSubscription = session.mode === 'subscription';

//             if (!clerkUserId) {
//                 console.error("Stripe: Session is missing critical data (User ID).");
//                 return { success: false, message: "Missing required data in session." };
//             }

//             // 3. Determine Credits based on plan (Update these credit amounts based on your product tiers)
//             // Assuming Pro plan is 100k, and Free/Base is 50k (from users.js)
//             const PRO_PLAN_CREDITS = 100000;
//             const ONE_TIME_CREDITS = PRO_PLAN_CREDITS; // You might treat a one-time purchase as an equivalent credit grant
//             const newCredits = isSubscription ? PRO_PLAN_CREDITS : ONE_TIME_CREDITS;

//             // 4. Call a Convex Mutation to securely update the database
//             try {
//                 await ctx.runMutation(api.users.updateSubscription, {
//                     clerkId: clerkUserId,
//                     // If it's a subscription, pass the Stripe Subscription ID. Otherwise, pass null.
//                     subscriptionId: isSubscription ? session.subscription : null,
//                     newCredits: newCredits,
//                 });
//                 console.log(`Stripe: Database update successful for user ${clerkUserId}`);
//                 return { success: true, message: "Payment verified and user updated." };
//             } catch (dbError) {
//                 console.error("Stripe: Error running Convex mutation to update user:", dbError);
//                 return { success: false, message: `Database update failed: ${dbError.message}` };
//             }
//         } catch (initializationError) {
//             console.error("CRITICAL: Top-level Stripe Action Failure:", initializationError);
//             return { success: false, message: "Critical backend setup error. Check Convex logs immediately." };
//         }
//     },
// });

// /**
//  * Action to CANCEL a Stripe Subscription and update the user's tokens in Convex.
//  */
// export const cancelPlan = action({
//     args: {
//         clerkId: v.string(), // The Clerk ID must be passed from the client
//     },
//     handler: async (ctx, args) => {
//         const { clerkId } = args;
//         let user;

//         try {
//             // Step 1: Get the user's current subscription ID from the database
//             // NOTE: This call assumes you have an internal mutation/query `api.users.getUserInternal`
//             // that is accessible to the action and returns the user document.
//             // If you don't, you need to add it to your `users.js` file.
//             user = await ctx.runMutation(api.users.getUserInternal, { clerkId });

//             if (!user) {
//                 return { success: false, message: "User not found in Convex database." };
//             }

//             // Check if subscriptionId is set to a valid-looking ID before proceeding to Stripe
//             const subscriptionId = user.subscriptionId;

//             if (!subscriptionId || subscriptionId === '1234' || !subscriptionId.startsWith('sub_')) {
//                 // If the ID is missing or clearly invalid, we clean up the Convex document and exit successfully.
//                 await ctx.runMutation(api.users.downgradeSubscription, { clerkId });
//                 return {
//                     success: true,
//                     newCredits: 50000, // Return new credits for client-side logging
//                     message: "Subscription ID was invalid/missing. Database cleaned up, user reverted to Free Plan."
//                 };
//             }

//             // Step 2: Call the Stripe API to cancel the subscription at the end of the period.
//             const subscription = await stripe.subscriptions.update(
//                 subscriptionId,
//                 { cancel_at_period_end: true }
//             );

//             // Step 3: Update the user document in Convex immediately to reflect the pending cancellation.
//             // This mutation should set subscriptionId to 'pending_cancellation' and credits remain PRO.
//             await ctx.runMutation(api.users.downgradeSubscription, { clerkId });

//             const cancelDate = new Date(subscription.current_period_end * 1000).toDateString();

//             return {
//                 success: true,
//                 newCredits: user.credits, // Keep current credits
//                 message: `Subscription successfully marked for cancellation. You will retain Pro access until ${cancelDate}.`
//             };

//         } catch (error) {
//             // Log the raw error message
//             console.error("Stripe Cancellation Error:", error.message);

//             // Handle the specific Stripe error when the subscription ID is invalid/missing on Stripe's end
//             if (error.rawType === 'InvalidRequestError' && error.code === 'resource_missing') {
//                 // CRITICAL FIX: The subscription ID in Convex is bad (like '1234'), so we force the cleanup.
//                 await ctx.runMutation(api.users.downgradeSubscription, { clerkId });

//                 return {
//                     success: true,
//                     newCredits: 50000, // New credits after cleanup
//                     message: "Subscription ID was invalid on Stripe's end. Database cleaned up, user reverted to Free Plan."
//                 };
//             }

//             // If it's any other error, return the failure message
//             return { success: false, message: `Cancellation failed due to a server error: ${error.message}` };
//         }
//     }
// });
