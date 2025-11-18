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

// // convex/schema.js

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values"

// export default defineSchema({
//     users: defineTable({
//         // CRITICAL FIX: Make fields that might be missing optional
//         name: v.optional(v.string()), // <-- FIXED: Added v.optional
//         email: v.optional(v.string()), // <-- FIXED: Added v.optional
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

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//     users: defineTable({
//         // clerkUserId MUST be required, as it's the unique identifier for auth lookups
//         clerkUserId: v.string(),
//         // These fields are optional for Clerk users whose profile might not provide them
//         name: v.optional(v.string()),
//         email: v.optional(v.string()),
//         credits: v.number(),

//         // CRITICAL FIX: Allows the value to be null when cancelling the subscription.
//         subscriptionId: v.optional(v.string()),

//         // --- TEMPORARY FIX TO FORCE SCHEMA MIGRATION ---
//         // This field forces Convex to recognize a schema change and update its type validation.
//         lastSchemaUpdate: v.optional(v.number()),
//         // --------------------------------------------------
//     })
//         // This index is necessary for all Clerk/Stripe-related lookups
//         .index("by_clerk_user_id", ["clerkUserId"]),

//     DiscussionRoom: defineTable({
//         coachingOption: v.string(),
//         topic: v.string(),
//         expertName: v.string(),
//         // v.any() is fine for complex objects like conversation arrays
//         conversation: v.optional(v.any()),
//         summery: v.optional(v.any()),
//         // The UID should be optional if some discussions are not tied to a user,
//         // but typically it would be v.id('users') if required. v.optional is safer here.
//         uid: v.optional(v.id('users'))
//     })
// })
