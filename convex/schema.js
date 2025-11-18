// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values"

// export default defineSchema({
//     users: defineTable({
//         name: v.string(),
//         email: v.string(),
//         clerkUserId: v.optional(v.string()),
//         credits: v.number(),
//         subscriptionId: v.optional(v.string()),
//     }).index("by_clerk_user_id", ["clerkUserId"]),

//     DiscussionRoom: defineTable({
//         coachingOption: v.string(),
//         topic: v.string(),
//         expertName: v.string(),
//         conversation: v.optional(v.any()),
//         summery: v.optional(v.any()),
//         uid: v.optional(v.id('users'))
//     })
// })


import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        // Clerk-related fields
        clerkUserId: v.string(),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        credits: v.number(),

        // CRITICAL: Stores the Dodo Customer ID for billing lookups.
        dodoCustomerId: v.optional(v.string()), // <-- ADDED/REPLACED THIS

        // Subscription status fields
        
        plan: v.optional(v.string()),
lastRefreshed: v.optional(v.number()),

    })
        // This index is necessary for Clerk lookups (used by convex/users.ts)
        .index("by_clerk_user_id", ["clerkUserId"])
        // CRITICAL: This index is necessary for Dodo Webhook lookups
        .index("by_dodo_customer_id", ["dodoCustomerId"]), // <-- ADDED THIS

    DiscussionRoom: defineTable({
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
        conversation: v.optional(v.any()),
        summery: v.optional(v.any()),
        uid: v.optional(v.id('users'))
    })
})