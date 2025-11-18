// import React from 'react'
// import FeatureAssistants from './_components/FeatureAssistants'
// import Feedback from './_components/Feedback'
// import History from './_components/History'

// function Dashboard() {
//     return (
//         <div>
//             <FeatureAssistants />

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-20'>
//                 <History />
//                 <Feedback />
//             </div>
//         </div>
//     )
// }

// export default Dashboard

// "use client";

// import React from "react";
// import FeatureAssistants from "./_components/FeatureAssistants";
// import Feedback from "./_components/Feedback";
// import History from "./_components/History";

// function DashboardPage() {
//     return (
//         <div className="p-5">
//             {/* Feature Assistants Section */}
//             <FeatureAssistants />

//             {/* History & Feedback Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
//                 <History />
//                 <Feedback />
//             </div>
//         </div>
//     );
// }

// export default DashboardPage;

// app/(main)/dashboard/page.jsx

// "use client";

// import React, { useEffect } from "react";
// import FeatureAssistants from "./_components/FeatureAssistants";
// import Feedback from "./_components/Feedback";
// import History from "./_components/History";

// // CRITICAL FIX: Import necessary hooks for user sync
// import { useConvexAuth, useMutation } from "convex/react";
// // CRITICAL FIX: Use the most robust path for the API file
// // Assuming the alias setup failed, we default to the most likely relative path.
// import { api } from "../../../convex/_generated/api";


// function DashboardPage() {
//     const { isAuthenticated } = useConvexAuth();
//     const getOrCreateUser = useMutation(api.users.getOrCreateUser);

//     // NEW STATE: Track if the user sync process is finished
//     const [isUserSynced, setIsUserSynced] = React.useState(false);

//     useEffect(() => {
//         if (isAuthenticated && !isUserSynced) {
//             getOrCreateUser()
//                 .then(() => {
//                     console.log("SUCCESS: User record created and sync state set!");
//                     setIsUserSynced(true); // Set state to true only upon success
//                 })
//                 .catch(error => {
//                     console.error("Failed to sync user on dashboard load:", error);
//                     // Handle error if sync fails (e.g., redirect or show error)
//                 });
//         }
//     }, [isAuthenticated, isUserSynced, getOrCreateUser]); // Added isUserSynced to dependency array

//     // Optional: Render a loading state while the sync is happening
//     if (isAuthenticated && !isUserSynced) {
//         return <div className="p-5 text-center text-xl">Loading user data...</div>;
//     }

//     return (
//         <div className="p-5">
//             {/* Feature Assistants Section */}
//             <FeatureAssistants />

//             {/* History & Feedback Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
//                 <History />
//                 <Feedback />
//             </div>
//         </div>
//     );
// }

// export default DashboardPage;

"use client";

import React, { useEffect } from "react";
import FeatureAssistants from "./_components/FeatureAssistants";
import Feedback from "./_components/Feedback";
import History from "./_components/History";

// --- CLEANED IMPORTS ---
// Removed useSearchParams, useRouter, and useAction as they are now handled by /dashboard/payment
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";


function DashboardPage() {
    const { isAuthenticated } = useConvexAuth();
    const getOrCreateUser = useMutation(api.users.getOrCreateUser);

    // --- REMOVED PAYMENT VERIFICATION HOOKS ---
    // const searchParams = useSearchParams();
    // const router = useRouter();
    // const verifyPaymentAction = useAction(api.stripe.verifyPayment);

    const [isUserSynced, setIsUserSynced] = React.useState(false);

    // 1. User Sync Effect (This remains)
    useEffect(() => {
        if (isAuthenticated && !isUserSynced) {
            getOrCreateUser()
                .then(() => {
                    console.log("SUCCESS: User record created and sync state set!");
                    setIsUserSynced(true);
                })
                .catch(error => {
                    console.error("Failed to sync user on dashboard load:", error);
                });
        }
    }, [isAuthenticated, isUserSynced, getOrCreateUser]);

    // --- REMOVED PAYMENT SUCCESS EFFECT ---
    /*
    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const sessionId = searchParams.get('session_id');

        if (paymentStatus === 'success' && sessionId) {
            console.log("Payment success detected. Starting backend verification for:", sessionId);

            // Call the Convex Action to securely verify payment
            verifyPaymentAction({ sessionId })
                .then(result => {
                    if (result.success) {
                        alert("Payment confirmed! Your account has been upgraded to Pro Plan.");
                    } else {
                        alert(`Payment verification issue: ${result.message}. Please check your plan status.`);
                    }
                })
                .catch(error => {
                    console.error("Payment verification failed at the Action layer:", error);
                    alert("An internal error occurred during payment verification. Please contact support.");
                })
                .finally(() => {
                    // CRITICAL: Clean the URL regardless of success/failure
                    router.replace('/dashboard', { shallow: true });
                });
        }
    }, [searchParams, router, verifyPaymentAction]);
    */


    // Optional: Render a loading state while the sync is happening
    if (isAuthenticated && !isUserSynced) {
        return <div className="p-5 text-center text-xl">Loading user data...</div>;
    }

    return (
        <div className="p-5">
            {/* Feature Assistants Section */}
            <FeatureAssistants />

            {/* History & Feedback Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
                <History />
                <Feedback />
            </div>
        </div>
    );
}

export default DashboardPage;
