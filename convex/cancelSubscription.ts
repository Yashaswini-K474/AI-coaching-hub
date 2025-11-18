// import { mutation } from "./_generated/server";
// import { v } from "convex/values";

// export const cancelSubscription = mutation({
//   args: {
//     clerkId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const { clerkId } = args;

//     // 🔍 Find user by Clerk ID (use correct index name from schema)
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId)) // ✅ use your real index
//       .unique();

//     if (!user) {
//       console.error(`❌ User not found for Clerk ID: ${clerkId}`);
//       throw new Error("User not found");
//     }

//     // 🧭 Downgrade plan back to Free
//     await ctx.db.patch(user._id, {
//       plan: "Free",
//       credits: 50000,
//     });

//     console.log(`📉 Downgraded user ${clerkId} to Free plan`);
//     return { success: true };
//   },
// });
