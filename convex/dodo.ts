// convex/dodo.ts
// import { DodoPayments } from "@dodopayments/convex";
// import { components } from "./_generated/api";
// import { internal } from "./_generated/api";

// export const dodo = new DodoPayments(components.dodopayments, {
//     identify: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) return null;
//         const user = await ctx.runQuery(internal.users.getByAuthId, {
//             authId: identity.subject,
//         });
//         if (!user) return null;
//         return { dodoCustomerId: user.dodoCustomerId };
//     },
//     apiKey: process.env.DODO_PAYMENTS_API_KEY!,
//     environment: process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode",
// });

// export const { checkout, customerPortal } = dodo.api();




// convex/dodo.ts
// convex/dodo.ts
// import { DodoPayments } from "@dodopayments/convex";
// import { components, internal } from "./_generated/api";
// import type { GenericActionCtx } from "convex/server";
// import type { DataModel } from "./_generated/dataModel"; // ✅ your Convex data model types

// export const dodo = new DodoPayments(components.dodopayments, {
//     identify: async (
//         ctx: GenericActionCtx<DataModel> // ✅ correct modern Convex type
//     ): Promise<{ dodoCustomerId: string } | null> => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) return null;

//         const user = await ctx.runQuery(internal.users.getByAuthId, {
//             authId: identity.subject,
//         });

//         if (!user?.dodoCustomerId) return null;

//         return { dodoCustomerId: user.dodoCustomerId };
//     },
//     apiKey: process.env.DODO_PAYMENTS_API_KEY!,
//     environment: process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode",
// });

// export const { checkout, customerPortal } = dodo.api();


// // convex/dodo.ts
import { DodoPayments } from "@dodopayments/convex";
import { components, internal } from "./_generated/api";
import type { GenericActionCtx } from "convex/server";
import type { DataModel } from "./_generated/dataModel";

export const dodo = new DodoPayments(components.dodopayments, {
    identify: async (
        ctx: GenericActionCtx<DataModel>
    ): Promise<{ dodoCustomerId: string } | null> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.runQuery(internal.users.getByAuthId, {
            authId: identity.subject,
        });

        // ✅ If user exists, return the stored Dodo Customer ID
        if (user?.dodoCustomerId) {
            return { dodoCustomerId: user.dodoCustomerId };
        }

        // Return null if no dodoCustomerId yet
        return null;
    },
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode",
});

export const { checkout, customerPortal } = dodo.api();

