// convex/auth.config.ts
// export default {
//     providers: [
//         {
//             domain: "https://api.stack-auth.com/api/v1/projects/4bf14f45-9fde-44d0-82fb-75f558a99a21",
//             applicationID: "convex",
//         },
//     ],
// };

// convex/auth.config.js

// convex/auth.config.js

// convex/auth.config.js
// convex/auth.config.js - Use Clerk variables

// convex/auth.config.js - Use Clerk variables

// import { convexAuth } from "@convex-dev/auth/server";
// import clerk from "@convex-dev/auth/clerk";

// export const { auth, signIn, signOut, store } = convexAuth({
//     providers: [clerk()],
// });


// auth.config.js

// import { convexAuth } from "@convex-dev/auth/server";
// import clerk from "@convex-dev/auth/clerk";

// export const { auth, signIn, signOut, store } = convexAuth({
//     providers: [
//         clerk({
//             domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "", // use fallback
//             applicationID: "convex",
//         }),
//     ],
// });

// import { clerkProvider } from "@convex-dev/auth/server/clerk";

// export default {
//     providers: [clerkProvider()],
// };

export default {
    providers: [
        {
            domain: "https://careful-shrimp-40.clerk.accounts.dev",
            applicationID: "convex", // must match your JWT template name in Clerk
        },
    ],
};

