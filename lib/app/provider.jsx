// "use client"
// import React, { Suspense } from 'react'
// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import AuthProvider from './AuthProvider';

// function Provider({ children }) {
//     const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
//     return (

//         <Suspense fallback={<p> Loading...</p>}>
//             <ConvexProvider client={convex}>
//                 <AuthProvider>
//                    {children}
//                 </AuthProvider>

//             </ConvexProvider>
//     </Suspense>
//     )
// }

// export default Provider




// app/provider.js

// provider.js
// Located: app/provider.js

"use client"
import React, { Suspense, useMemo } from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import AuthProvider from './AuthProvider';

// ❌ REMOVE the static 'const convex = new ConvexReactClient...' line if it was here.
//    We are moving the initialization inside the component.

function Provider({ children }) {

    // 🚨 CRITICAL FIX: Initialize the client dynamically and memoize it. 🚨
    const convex = useMemo(() => {
        // Fetch variables here to ensure they are available in the client context.
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        const clientKey = process.env.NEXT_PUBLIC_CONVEX_PUBLISHABLE_CLIENT_KEY;

        // Final check to see the key being used
        console.log("Convex Client Key Loaded (Final Check):", clientKey ? clientKey.substring(0, 30) + '...' : 'MISSING');

        // Check for missing environment variables before attempting initialization
        if (!convexUrl || !clientKey) {
            console.error("CONVEX SETUP ERROR: Required environment variables (URL or Key) are missing. Check .env.local.");
            // Return null or undefined if we can't initialize
            return null;
        }

        return new ConvexReactClient(
            convexUrl,
            {
                // This is the essential fix for the client-side secret requirement
                clientSecret: clientKey,
            }
        );
    }, []); // Empty dependency array ensures it runs only once per client render

    // Handle case where client initialization failed (e.g., missing env vars)
    if (!convex) {
        // Safely return an actual React element
        return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            Error: Convex client setup failed. Check console for missing environment variables.
        </div>;
    }

    return (
        <Suspense fallback={<p> Loading...</p>}>
            <ConvexProvider client={convex}>
                {/* AuthProvider handles the Stack Auth JWT token via setAuth */}
                <AuthProvider convexClient={convex}>
                    {children}
                </AuthProvider>
            </ConvexProvider>
        </Suspense>
    )
}

export default Provider