// 'use client';

// import React from 'react';
// import AuthProvider from './AuthProvider';
// import { ConvexReactClient } from '../convex/_generated/client'; // relative path to client

// export default function ClientAuthProvider({ children }) {
//     const convexClient = ConvexReactClient.getClient();
//     return <AuthProvider convexClient={convexClient}>{children}</AuthProvider>;
// }

// 'use client';

// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import AuthProvider from "./AuthProvider";

// export default function ClientAuthProvider({ children }) {
//     // ✅ Create Convex client once
//     const convex = new ConvexReactClient(
//         process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3000"
//     );

//     return (
//         // ✅ Wrap everything inside ConvexProvider so hooks in AuthProvider have context
//         <ConvexProvider client={convex}>
//             <AuthProvider>
//                 {children}
//             </AuthProvider>
//         </ConvexProvider>
//     );
// }

// 'use client';

// // 🛑 CRITICAL FIX: Use the integrated provider and the useAuth hook from Clerk
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ConvexReactClient } from "convex/react";
// import { useAuth } from "@clerk/nextjs";
// import AuthProvider from "./AuthProvider";

// // Initialize Convex client once, outside the component, as a global constant
// const convex = new ConvexReactClient(
//     process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3000"
// );

// export default function ClientAuthProvider({ children }) {
//     return (
//         // ✅ This is the ONLY Convex provider that should be used in the app.
//         <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//             <AuthProvider>
//                 {children}
//             </AuthProvider>
//         </ConvexProviderWithClerk>
//     );
// }

'use client';

//  CRITICAL FIX: Use the integrated provider and the useAuth hook from Clerk
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

// Initialize Convex client once, outside the component, as a global constant
const convex = new ConvexReactClient(
    // Ensure you are using the correct deployment URL here
    process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:8000" // Use 8000 for standard convex dev
);

export default function ClientAuthProvider({ children }) {
    return (
        // ✅ This is the ONLY Convex provider that should be used in the app.
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    );
}
