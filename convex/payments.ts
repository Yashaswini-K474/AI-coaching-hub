

// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import { checkout } from "./dodo";
// import { internal } from "./_generated/api";

// export const createCheckout = action({
//   args: {
//     product_cart: v.array(
//       v.object({
//         product_id: v.string(),
//         quantity: v.number(),
//       })
//     ),
//     returnUrl: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     // 1️⃣ Create Dodo checkout session
//     const result = await checkout(ctx, {
//       payload: {
//         product_cart: args.product_cart,
//         return_url: args.returnUrl,
//         billing_currency: "USD",
//         feature_flags: {
//           allow_discount_code: true,
//         },
//       },
//     });

//     console.log("🧾 Dodo checkout result:", JSON.stringify(result, null, 2));

//     // 2️⃣ Save the Dodo Customer ID in Convex users table
//     const identity = await ctx.auth.getUserIdentity();
//     if (identity && result?.dodoCustomerId) {
//       await ctx.runMutation(internal.users.saveDodoCustomerId, {
//         clerkId: identity.subject,
//         dodoCustomerId: result.dodoCustomerId,
//       });
//       console.log(`✅ Saved Dodo customer ID for user ${identity.subject}`);
//     } else {
//       console.warn(
//         "⚠️ Missing Dodo customer ID or identity; skipping saveDodoCustomerId."
//       );
//     }

//     // 3️⃣ Return checkout session details to frontend
//     return result;
//   },
// });

// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import { checkout } from "./dodo";
// import { internal } from "./_generated/api";

// export const createCheckout = action({
//   args: {
//     product_cart: v.array(
//       v.object({
//         product_id: v.string(),
//         quantity: v.number(),
//       })
//     ),
//     returnUrl: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     const result = await checkout(ctx, {
//       payload: {
//         product_cart: args.product_cart,
//         return_url: args.returnUrl,
//         billing_currency: "USD",
//         feature_flags: { allow_discount_code: true },
//       },
//     });

//     console.log("🧾 Full Dodo checkout response:", JSON.stringify(result, null, 2));

//     // Try all possible nesting levels
//     const dodoCustomerId =
//       result?.customer?.customer_id ||
//       result?.data?.customer?.customer_id ||
//       result?.checkout_session?.customer?.customer_id ||
//       null;

//     console.log("💡 Extracted Dodo Customer ID:", dodoCustomerId);

//     const identity = await ctx.auth.getUserIdentity();
//     if (identity && dodoCustomerId) {
//       await ctx.runMutation(internal.users.saveDodoCustomerId, {
//         clerkId: identity.subject,
//         dodoCustomerId,
//       });
//       console.log(`✅ Saved Dodo customer ID for user ${identity.subject}`);
//     } else {
//       console.warn("⚠️ Missing Dodo customer ID or identity; skipping save.");
//     }

//     return result;
//   },
// });

// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import { checkout } from "./dodo";
// import { internal } from "./_generated/api";

// /**
//  * This action creates a Dodo checkout session and links the Dodo customer
//  * to the current Clerk user by saving dodoCustomerId into Convex.
//  */
// export const createCheckout = action({
//   args: {
//     product_cart: v.array(
//       v.object({
//         product_id: v.string(),
//         quantity: v.number(),
//       })
//     ),
//     returnUrl: v.optional(v.string()),
//   },

//   handler: async (ctx, args) => {
//     console.log("🛒 Starting Dodo checkout for product_cart:", args.product_cart);

//     // Step 1️⃣ — Create Dodo checkout session
//     const result = await checkout(ctx, {
//       payload: {
//         product_cart: args.product_cart,
//         return_url: args.returnUrl,
//         billing_currency: "USD",
//         feature_flags: {
//           allow_discount_code: true,
//         },
//       },
//     });

//     // Full log for debugging the shape of the response
//     console.log("🧾 Full Dodo checkout response:", JSON.stringify(result, null, 2));

//     // Step 2️⃣ — Extract Dodo Customer ID (handle multiple nesting cases)
//     const dodoCustomerId =
//       result?.checkout_session?.customer?.customer_id ||
//       result?.data?.checkout_session?.customer?.customer_id ||
//       result?.data?.customer?.customer_id ||
//       result?.customer?.customer_id ||
//       result?.dodoCustomerId ||
//       null;

//     console.log("💡 Extracted Dodo Customer ID:", dodoCustomerId);

//     // Step 3️⃣ — Save Dodo Customer ID to Convex users table
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       console.warn("⚠️ No identity found, user not logged in.");
//       return result;
//     }

//     console.log(`👤 Logged in Clerk user: ${identity.subject}`);

//     if (dodoCustomerId) {
//       try {
//         await ctx.runMutation(internal.users.saveDodoCustomerId, {
//           clerkId: identity.subject,
//           dodoCustomerId,
//         });
//         console.log(`✅ Successfully saved Dodo Customer ID (${dodoCustomerId}) for user ${identity.subject}`);
//       } catch (err) {
//         console.error("❌ Error saving Dodo Customer ID:", err);
//       }
//     } else {
//       console.warn("⚠️ No Dodo customer ID detected in checkout response, skipping save.");
//     }

//     // Step 4️⃣ — Return session info back to frontend
//     return result;
//   },
// });


import { action } from "./_generated/server";
import { v } from "convex/values";
import { checkout } from "./dodo";
import { internal } from "./_generated/api";

/**
 * This action creates a Dodo checkout session and links the Dodo customer
 * to the current Clerk user by saving dodoCustomerId into Convex.
 */
export const createCheckout = action({
  args: {
    product_cart: v.array(
      v.object({
        product_id: v.string(),
        quantity: v.number(),
      })
    ),
    returnUrl: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    console.log("🛒 Starting Dodo checkout for product_cart:", args.product_cart);

    // 1️⃣ MUST BE FIRST: Authenticate the user and get the Clerk ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("⚠️ No identity found, user not logged in. Cannot proceed with checkout.");
      return { success: false, error: "Not Authenticated" };
    }

    // Define the Clerk ID variable for use throughout the handler
    const clerkId = identity.subject;
    console.log(`👤 Logged in Clerk user: ${clerkId}`);

    // Step 2️⃣ — Create Dodo checkout session (using the required metadata)
    const result = await checkout(ctx, {
      payload: {
        product_cart: args.product_cart,
        return_url: args.returnUrl,
        billing_currency: "USD",
        feature_flags: {
          allow_discount_code: true,
        },
        // ✅ Inject the Clerk ID into the metadata here
        metadata: {
          clerkId: clerkId,
        },
      },
    });

    // Full log for debugging the shape of the response
    console.log("🧾 Full Dodo checkout response:", JSON.stringify(result, null, 2));

    // Step 3️⃣ : Extract Dodo Customer ID (handle multiple nesting cases)
    const dodoCustomerId =
      result?.checkout_session?.customer?.customer_id ||
      result?.data?.checkout_session?.customer?.customer_id ||
      result?.data?.customer?.customer_id ||
      result?.customer?.customer_id ||
      result?.dodoCustomerId ||
      null;

    console.log("💡 Extracted Dodo Customer ID:", dodoCustomerId);
    


    // Step 4️⃣ — Save Dodo Customer ID to Convex users table if available
    // FIX: Updated log messages to clarify that skipping save is expected if Dodo only returns checkout_url.
    if (dodoCustomerId) {
      try {
        await ctx.runMutation(internal.users.saveDodoCustomerId, {
          // Use the defined clerkId variable
          clerkId: clerkId,
          dodoCustomerId,
        });
        console.log(`✅ Successfully saved Dodo Customer ID (${dodoCustomerId}) for user ${clerkId} during checkout.`);
      } catch (err) {
        console.error("❌ Error saving Dodo Customer ID:", err);
      }
    } else {
      // New log message to confirm we are relying on the webhook for customer ID linkage
      console.log(" No Dodo customer ID detected in checkout response, skipping save");
    }

    return result;
  },
});

// /* -------------------------------------------------------------------------- */
// /* 🧾 CANCEL SUBSCRIPTION ACTION                                               */
// /* -------------------------------------------------------------------------- */

// export const cancelSubscription = action({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       console.warn("⚠️ User not logged in, cannot cancel subscription.");
//       return { success: false, error: "Not Authenticated" };
//     }

//     const clerkId = identity.subject;

//     try {
//       // 🔁 Call the internal cancel mutation
//       await ctx.runMutation(internal.payments.cancelSubscription, { clerkId });
//       console.log(`📉 Cancelled subscription for ${clerkId}`);
//       return { success: true };
//     } catch (err) {
//       console.error("❌ Error cancelling subscription:", err);
//       return { success: false, error: "Cancel failed" };
//     }
//   },
// });

