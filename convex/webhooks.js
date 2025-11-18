import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Clerk Webhook: Sync clerk user -> Convex users table.
 */

// Helper to query by Clerk ID (used in touchUser)
const queryByClerkId = (ctx, clerkId) => 
    ctx.db.query("users").withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId));

export const touchUserInternal = internalMutation({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        const user = await queryByClerkId(ctx, clerkId).unique();
        if (!user) {
            console.error(`❌ Cannot touch user: User not found for Clerk ID: ${clerkId}`);
            return;
        }
        await ctx.db.patch(user._id, { 
            lastRefreshed: Date.now() 
        });
        console.log(`✅ User ${user._id} touched INTERNALLY by webhook.`);
    }
});

// ------------------------------------
// 🔥 NEW MUTATION: Used by frontend to force query refresh
// ------------------------------------
export const touchUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        console.warn("⚠️ Cannot touch user: Not authenticated.");
        return;
    }
    
    const clerkId = identity.subject;
    const user = await queryByClerkId(ctx, clerkId).unique();
    if (!user) {
        console.error(`❌ User not found for Clerk ID: ${clerkId}`);
        return;
    }
    
    // Patching with a non-essential update (like a timestamp) forces all 
    // user-related useQueries to refresh. You must add 'lastRefreshed' to your schema.
    await ctx.db.patch(user._id, { 
      lastRefreshed: Date.now() 
    });
    console.log(`✅ User ${user._id} touched to force frontend refresh.`);
  }
});


export const syncUser = internalMutation({
  args: {
    eventType: v.string(),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const { eventType, clerkId, name, email } = args;

    const userData = {
      clerkUserId: clerkId,
      name,
      email,
      credits: 50000,
      lastRefreshed: Date.now(),
    };

    if (eventType === "user.created" || eventType === "user.updated") {
      const existingUser = await db
        .query("users")
        .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId))
        .unique();

     if (existingUser) {
        await db.patch(existingUser._id, { 
            name, 
            email,
            lastRefreshed: Date.now() 
        });
        console.log(`✅ Updated user (clerkUserId=${clerkId})`);
      } else if (eventType === "user.created") {
        await db.insert("users", userData);
        console.log(`✅ Created new user (clerkUserId=${clerkId})`);
      }
    } else if (eventType === "user.deleted") {
      const userToDelete = await db
        .query("users")
        .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkId))
        .unique();

      if (userToDelete) {
        await db.delete(userToDelete._id);
        console.log(`🗑️ Deleted user (clerkUserId=${clerkId})`);
      }
    } else {
      console.warn(`⚠️ Unhandled Clerk webhook event type: ${eventType}`);
    }
  },
});

export const updateUserTokens = internalMutation({
  args: {
    dodoCustomerId: v.string(),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;
    const { dodoCustomerId, clerkId } = args;
    const cleanClerkId = clerkId?.trim();

    // 1. Check if this dodoCustomerId is already assigned to another user
    const existingByDodo = await db
      .query("users")
      .withIndex("by_dodo_customer_id", (q) =>
        q.eq("dodoCustomerId", dodoCustomerId)
      )
      .unique();

    // 2. If found and the clerkUserId does not match, log error and abort
    if (existingByDodo && existingByDodo.clerkUserId !== cleanClerkId) {
      console.error(
        `❌ Dodo customer ID ${dodoCustomerId} is already assigned to another user (${existingByDodo.clerkUserId}). Aborting update.`
      );
      return;
    }

    // 3. Find user by Clerk ID
    let user = null;
    if (clerkId) {
      user = await db
        .query("users")
        .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", cleanClerkId))
        .unique();
    }

    if (!user) {
      console.error(
        `❌ User not found for Clerk ID: ${cleanClerkId}. Aborting update.`
      );
      return;
    }

    // 4. Patch user with dodoCustomerId, credits, and plan
    await db.patch(user._id, {
      dodoCustomerId: dodoCustomerId,
      credits: 200000,
      plan: "Pro",
    });
    console.log(
      `💰 Successfully upgraded to Pro for Dodo customer: ${dodoCustomerId} and Clerk ID: ${cleanClerkId}`
    );

    // Optionally, touch user for reactivity
    await ctx.runMutation(internal.webhooks.touchUserInternal, {
      clerkId: user.clerkUserId,
    });
  },
});