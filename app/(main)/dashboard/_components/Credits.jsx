// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext } from 'react'
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@radix-ui/react-progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2 } from 'lucide-react';


// function Credits() {
//     const { userData } = useContext(UserContext);
//     const user = useUser();

//     return (
//         <div>
//             <div className='flex gap-5 items-center'>
//                 <Image src={user?.profileImageUrl} width={60} height={60}
//                     className='rounded-full'
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.displayName}</h2>
//                     <h2 className='text-gray-500'>{user?.primaryEmail}</h2>
//                 </div>
//             </div>
//             <hr className='my-3' />
//             <div>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 <h2>{userData.credits}/{userData?.subscriptionId ? '50,000' : '5000'}</h2>
//                 <Progress value={33} className='my-3' />

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>Free Plan</h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>50,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />
//                     <Button className='w-full'> <Wallet2 /> Upgrade $10</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext } from 'react'
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2 } from 'lucide-react';


// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     const CalculateProgress = () => {
//         // Use the higher limit based on the latest image (1,00,000 for Pro Plan)
//         const totalTokens = userData?.subscriptionId ? 100000 : 5000;
//         const usedCredits = Number(userData?.credits) || 0;

//         if (totalTokens === 0) return 0;

//         const calculatedValue = (usedCredits / totalTokens) * 100;

//         return calculatedValue;
//     }

//     if (!isLoaded || !user) {
//         return null;
//     }

//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';



//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 <h2>{userData?.credits || '0'}/{userData?.subscriptionId ? '1,00,000' : '5000'}</h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>

//                         {userData?.subscriptionId ? 'paid Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>1,00,001 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />
//                     <Button className='w-full'> <Wallet2 className='mr-2 h-4 w-4' /> Upgrade $10</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// credits.js



// "use client";

// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react';
// import { UserContext } from '@/app/_context/UserContext'; // Assuming this context provides userData
// import { useMutation } from "convex/react"; // Import useMutation for backend calls
// import { api } from '@/convex/_generated/api'; // Assuming you have an api path configured

// function Credits() {
//     // userData contains fields like { credits: number, subscriptionId: string | undefined }
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to handle loading when canceling a plan
//     const [isLoading, setIsLoading] = useState(false);

//     // Convex mutation hook
//     // IMPORTANT: Ensure your Convex setup maps to `api.stripe.cancelPlan`
//     const cancelPlanMutation = useMutation(api.stripe.cancelPlan);

//     // Define constants for limits (using 50000 as per your latest code)
//     const FREE_PLAN_LIMIT = 50000;
//     const PRO_PLAN_LIMIT = 100000;

//     // Determine the current plan and its limit
//     const isPro = !!userData?.subscriptionId;
//     const currentLimit = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

//     // Assume userData.credits stores the USED tokens (as per user request: "how much token i have used")
//     const usedTokens = Number(userData?.credits) || 0;

//     // Function to handle plan cancellation
//     const handleCancelPlan = async () => {
//         if (!user) return;
//         setIsLoading(true);
//         try {
//             // Call the Convex mutation to cancel the Stripe subscription
//             await cancelPlanMutation({ clerkId: user.id });
//             console.log("Plan cancellation requested successfully.");
//             // The userData context should automatically update via Convex listener
//             // when the backend processes the cancellation.
//         } catch (error) {
//             console.error("Error cancelling plan:", error);
//             // You might want to display a user-friendly error message here
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     // Calculate progress as a percentage
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;

//         // Ensure progress doesn't exceed 100%
//         const calculatedValue = (usedTokens / currentLimit) * 100;
//         return Math.min(calculatedValue, 100);
//     }

//     if (!isLoaded || !user) {
//         return null;
//     }

//     // Safely get the primary email
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';

//     // Function to format numbers with commas (e.g., 5000 -> 5,000)
//     const formatNumber = (num) => {
//         return num.toLocaleString();
//     };

//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Display USED tokens / TOTAL limit */}
//                 <h2 className='text-xl font-semibold'>
//                     {formatNumber(usedTokens)} / {formatNumber(currentLimit)}
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3 h-2'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className={`p-1 rounded-lg px-2 text-sm font-medium ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
//                         {isPro ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border border-indigo-200 rounded-2xl shadow-lg'>
//                     <div className='flex justify-between items-center'>
//                         <div>
//                             <h2 className='font-bold text-lg'>Pro Plan</h2>
//                             <h2 className='text-sm text-gray-600'>{formatNumber(PRO_PLAN_LIMIT)} Tokens/Month</h2>
//                         </div>
//                         <h2 className='font-bold text-xl text-indigo-600'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3 border-indigo-100' />
//                     {isPro ? (
//                         <Button
//                             className='w-full bg-red-500 hover:bg-red-600 transition-colors'
//                             onClick={handleCancelPlan} // Attach the handler
//                             disabled={isLoading} // Disable while loading
//                         >
//                             {isLoading ? (
//                                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                             ) : (
//                                 'Cancel Pro Plan'
//                             )}
//                         </Button>
//                     ) : (
//                         <Button className='w-full bg-indigo-600 hover:bg-indigo-700 transition-colors'>
//                             <Wallet2 className='mr-2 h-4 w-4' /> Upgrade to Pro
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;

// "use client";

// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react';
// import { UserContext } from '@/app/_context/UserContext';
// import { useAction } from "convex/react";
// import { api } from '@/convex/_generated/api';

// function Credits() {
//     // userData contains fields like { credits: number, subscriptionId: string | undefined }
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to handle loading when canceling a plan
//     const [isLoading, setIsLoading] = useState(false);

//     // Convex ACTION hook - CRITICAL FIX
//     const cancelPlanAction = useAction(api.stripe.cancelPlan);

//     // Define constants for limits (using 50000 as per your latest code)
//     const FREE_PLAN_LIMIT = 50000;
//     const PRO_PLAN_LIMIT = 100000;

//     // Determine the current plan and its limit
//     const isPro = !!userData?.subscriptionId;
//     const currentLimit = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

//     // --- CRITICAL FIX: Assume userData.credits stores REMAINING tokens ---
//     const remainingTokens = Number(userData?.credits) || 0;
//     const usedTokens = currentLimit - remainingTokens;

//     // Function to handle plan cancellation
//     const handleCancelPlan = async () => {
//         if (!user || !user.id) return;
//         setIsLoading(true);
//         try {
//             // Call the Convex Action
//             const result = await cancelPlanAction({ clerkId: user.id });

//             if (result.success) {
//                 console.log("Plan cancellation requested successfully. Frontend should automatically refresh.");
//                 // Since `cancelPlan` mutation modifies the user document,
//                 // the `useQuery` fetching `userData` should automatically update the context.
//             } else {
//                 console.error("Plan cancellation failed on server:", result.message);
//                 // Optionally show a notification here
//             }

//         } catch (error) {
//             console.error("Error cancelling plan:", error);
//             // You might want to display a user-friendly error message here
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     // Calculate progress as a percentage
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;

//         // Progress is based on USED tokens
//         const calculatedValue = (usedTokens / currentLimit) * 100;
//         return Math.min(calculatedValue, 100);
//     }

//     if (!isLoaded || !user || !userData) {
//         // Wait for both Clerk user and Convex userData to load
//         return null;
//     }

//     // Safely get the primary email
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';

//     // Function to format numbers with commas (e.g., 5000 -> 5,000)
//     const formatNumber = (num) => {
//         return num.toLocaleString();
//     };

//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Display REMAINING tokens / TOTAL limit */}
//                 <h2 className='text-xl font-semibold'>
//                     {formatNumber(remainingTokens)} / {formatNumber(currentLimit)}
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     {/* The progress value should represent the percentage of tokens USED, not remaining. */}
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3 h-2'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className={`p-1 rounded-lg px-2 text-sm font-medium ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
//                         {isPro ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border border-indigo-200 rounded-2xl shadow-lg'>
//                     <div className='flex justify-between items-center'>
//                         <div>
//                             <h2 className='font-bold text-lg'>Pro Plan</h2>
//                             <h2 className='text-sm text-gray-600'>{formatNumber(PRO_PLAN_LIMIT)} Tokens/Month</h2>
//                         </div>
//                         <h2 className='font-bold text-xl text-indigo-600'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3 border-indigo-100' />
//                     {isPro ? (
//                         <Button
//                             className='w-full bg-red-500 hover:bg-red-600 transition-colors'
//                             onClick={handleCancelPlan} // Attach the handler
//                             disabled={isLoading} // Disable while loading
//                         >
//                             {isLoading ? (
//                                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                             ) : (
//                                 'Cancel Pro Plan'
//                             )}
//                         </Button>
//                     ) : (
//                         // Your existing upgrade button logic remains the same
//                         <Button className='w-full bg-indigo-600 hover:bg-indigo-700 transition-colors'>
//                             <Wallet2 className='mr-2 h-4 w-4' /> Upgrade to Pro
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
// // --- CANCELLATION IMPORTS ---
// import { useAction } from 'convex/react';
// import { api } from "../../../../convex/_generated/api";
// // ---------------------------

// // Keeping stripePromise defined, but it's NOT used in handleUpgrade anymore.
// // This import is not strictly necessary for the upgrade *flow* since the API route handles it,
// // but we leave it here for other potential stripe-related client-side logic.
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // NOTE: The upgrade amount is now fixed in the API route (api/create-stripe-session.js)
//     // const UPGRADE_AMOUNT_CENTS = 1000;

//     // --- CANCELLATION STATE & HOOKS ---
//     const cancelPlanAction = useAction(api.stripe.cancelPlan);
//     const [isLoading, setIsLoading] = useState(false); // Using a single state for upgrade/cancel loading
//     // ----------------------------------

//     const CalculateProgress = () => {
//         const totalTokens = userData?.subscriptionId ? 100000 : 5000;
//         // Use Number() to ensure it's treated as a number
//         const usedCredits = Number(userData?.credits) || 0;
//         if (totalTokens === 0) return 0;
//         // The progress bar calculation reflects usage based on remaining credits against the total plan size.
//         const remainingCredits = usedCredits;
//         // We calculate percentage of tokens USED: (Total - Remaining) / Total
//         const progressValue = ((totalTokens - remainingCredits) / totalTokens) * 100;
//         // If the value is NaN or otherwise invalid, return 0.
//         return isNaN(progressValue) ? 0 : Math.min(progressValue, 100);
//     }


//     // 💥 CORRECTED PAYMENT HANDLER FUNCTION
//     const handleUpgrade = async () => {
//         if (!user || !user.id) {
//             console.error("User not authenticated for upgrade.");
//             return;
//         }

//         setIsLoading(true); // Start loading

//         try {
//             // --- STEP 1: Call your backend API to create a Stripe Checkout Session ---
//             const response = await fetch('/api/create-stripe-session', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     // Remove amount here, as the price ID is fixed in the API route
//                     userId: user.id, // CRITICAL: Pass Clerk User ID
//                 }),
//             });

//             if (!response.ok) {
//                 const errorJson = await response.json();
//                 console.error("API Call Error:", errorJson.message || 'Unknown error');
//                 throw new Error(`API returned status ${response.status}: ${errorJson.message || 'Unknown error'}`);
//             }

//             const session = await response.json();

//             if (session.url) {
//                 // --- STEP 2: Redirect the user directly using the URL returned by the API ---
//                 window.location.href = session.url;
//                 // Do not set isLoading to false here as the user is navigating away
//             } else {
//                 console.error("Session creation failed:", session);
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             console.error("API Call Error:", error);
//             setIsLoading(false);
//         }
//     };

//     // --- CANCELLATION HANDLER FUNCTION (UPDATED) ---
//     const handleCancel = async () => {
//         // NOTE: Use a custom modal component for confirmation instead of console.warn in a real app
//         // Avoid using `confirm()` in this environment.
//         console.warn("Attempting to cancel Pro Plan.");

//         setIsLoading(true);
//         try {
//             // Call the action to reset tokens, passing the Clerk user ID
//             const result = await cancelPlanAction({
//                 clerkId: user.id
//             });
//             if (result.success) {
//                 console.log("Plan successfully canceled! Tokens reset to 50,000.");
//                 // UI refreshes automatically due to Convex subscription
//             } else {
//                 console.error(`Cancellation failed: ${result.message}`);
//             }
//         } catch (error) {
//             console.error("Cancellation error:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (!isLoaded || !user) {
//         return null;
//     }
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';

//     // Determine the user's plan status based on the subscriptionId field
//     const isPaidPlan = !!userData?.subscriptionId || (Number(userData?.credits) > 5000);

//     return (
//         <div className='w-full'>
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 <h2>{Number(userData?.credits)?.toLocaleString() || '0'}/{isPaidPlan ? '1,00,000' : '5,000'}</h2>

//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {isPaidPlan ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>1,00,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />

//                     {/* --- CONDITIONAL BUTTON DISPLAY --- */}
//                     {isPaidPlan ? (
//                         <Button
//                             className='w-full bg-red-500 hover:bg-red-600 transition-colors'
//                             onClick={handleCancel}
//                             disabled={isLoading}
//                         >
//                             {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Cancel Pro Plan'}
//                         </Button>
//                     ) : (
//                         <Button
//                             className='w-full bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                             onClick={handleUpgrade}
//                             disabled={isLoading}
//                         >
//                             {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> :
//                                 <>
//                                     <Wallet2 className='mr-2 h-4 w-4' /> Upgrade $10
//                                 </>
//                             }
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits


// "use client";

// import React, { useContext, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming these imports are available in the user's environment
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react';
// import { UserContext } from '@/app/_context/UserContext';
// // import { useAction } from "convex/react";
// // import { api } from '@/convex/_generated/api';

// function Credits() {
//     // userData contains fields like { credits: number, subscriptionId: string | undefined }
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to handle loading when initiating upgrade
//     const [isLoading, setIsLoading] = useState(false);

//     // Define constants for limits (using 50000 as per your latest code)
//     const FREE_PLAN_LIMIT = 50000;
//     const PRO_PLAN_LIMIT = 100000;

//     // Determine the current plan and its limit
//     const isPro = !!userData?.subscriptionId;
//     const currentLimit = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

//     // --- Core Credit Calculation ---
//     // Assume userData.credits stores REMAINING tokens
//     const remainingTokens = Number(userData?.credits) || 0;
//     const usedTokens = currentLimit - remainingTokens;

//     // --- UPGRADE FLOW HANDLER (Redirect to Stripe) ---
//     const handleUpgrade = useCallback(async () => {
//         // CRITICAL CHECK: Ensure user is loaded and has an ID
//         if (!user || !user.id) {
//             console.error("Clerk User ID is missing. Cannot start upgrade.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // STEP 1: Call the Next.js API route to create a Stripe Checkout Session
//             const response = await fetch('/api/create-stripe-session', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 // CRITICAL FIX: Ensure 'userId' is sent correctly.
//                 body: JSON.stringify({ userId: user.id }),
//             });

//             const session = await response.json();

//             if (session.url) {
//                 // STEP 2: Redirect the user to the Stripe Checkout page
//                 window.location.href = session.url;
//             } else {
//                 // If the API returns a message but no URL (e.g., error from the server)
//                 const errorMessage = session.message || "Stripe session creation failed, no URL returned.";
//                 console.error(errorMessage);
//                 throw new Error(errorMessage);
//             }
//         } catch (error) {
//             console.error("Upgrade Error:", error);
//             // In a real app, display a user-friendly error message here
//         } finally {
//             // Reset loading state if redirection failed (i.e., we are still on the page)
//             setIsLoading(false);
//         }
//     }, [user]);

//     // Calculate progress as a percentage
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Progress is based on USED tokens
//         const calculatedValue = (usedTokens / currentLimit) * 100;
//         return Math.min(calculatedValue, 100);
//     }

//     if (!isLoaded || !user || !userData) {
//         // Wait for both Clerk user and Convex userData to load
//         return null;
//     }

//     // Safely get the primary email
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';

//     // Function to format numbers with commas (e.g., 5000 -> 5,000)
//     const formatNumber = (num) => {
//         return num.toLocaleString();
//     };

//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                     // Add onError handler for robustness
//                     onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/cccccc/000000?text=JD" }}
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Display REMAINING tokens / TOTAL limit */}
//                 <h2 className='text-xl font-semibold'>
//                     {formatNumber(remainingTokens)} / {formatNumber(currentLimit)}
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     {/* The progress value should represent the percentage of tokens USED, not remaining. */}
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3 h-2'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className={`p-1 rounded-lg px-2 text-sm font-medium ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
//                         {isPro ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border border-indigo-200 rounded-2xl shadow-lg'>
//                     <div className='flex justify-between items-center'>
//                         <div>
//                             <h2 className='font-bold text-lg'>Pro Plan</h2>
//                             <h2 className='text-sm text-gray-600'>{formatNumber(PRO_PLAN_LIMIT)} Tokens/Month</h2>
//                         </div>
//                         <h2 className='font-bold text-xl text-indigo-600'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3 border-indigo-100' />

//                     {/* ONLY DISPLAY THE UPGRADE BUTTON (or disabled "Pro Plan Active") */}
//                     <Button
//                         className='w-full bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                         onClick={handleUpgrade}
//                         disabled={isPro || isLoading} // Disable if already Pro or loading
//                     >
//                         {isLoading ? (
//                             <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                         ) : (
//                             <>
//                                 <Wallet2 className='mr-2 h-4 w-4' />
//                                 {isPro ? 'Pro Plan Active' : 'Upgrade to Pro'}
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;

// "use client";

// import React, { useContext, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming these imports are available in the user's environment
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react';
// import { UserContext } from '@/app/_context/UserContext';
// // import { useAction } from "convex/react";
// // import { api } from '@/convex/_generated/api';

// // Define the Stripe Price ID constant here to ensure the client matches the server.
// // NOTE: This must match the constant in convex/stripe.ts
// const PRO_PLAN_STRIPE_PRICE_ID = "price_pro";

// function Credits() {
//     // userData contains fields like { credits: number, subscriptionId: string | undefined }
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to handle loading when initiating upgrade
//     const [isLoading, setIsLoading] = useState(false);

//     // NOTE: The cancelPlanAction hook was removed from the provided file,
//     // but the component still needs it for cancellation. Re-adding it below
//     // the main function for a complete solution later if needed.

//     // Define constants for limits (using 50000 as per your latest code)
//     const FREE_PLAN_LIMIT = 50000;
//     const PRO_PLAN_LIMIT = 100000;

//     // Determine the current plan and its limit
//     const isPro = !!userData?.subscriptionId;
//     const currentLimit = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

//     // --- Core Credit Calculation ---
//     // Assume userData.credits stores REMAINING tokens
//     const remainingTokens = Number(userData?.credits) || 0;
//     const usedTokens = currentLimit - remainingTokens;

//     // --- UPGRADE FLOW HANDLER (Redirect to Stripe) ---
//     const handleUpgrade = useCallback(async () => {
//         // CRITICAL CHECK: Ensure user is loaded and has an ID
//         if (!user || !user.id) {
//             console.error("Clerk User ID is missing. Cannot start upgrade.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // STEP 1: Call the Next.js API route to create a Stripe Checkout Session
//             const response = await fetch('/api/create-stripe-session', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 // FIX: Pass the required 'priceId' here.
//                 body: JSON.stringify({
//                     userId: user.id,
//                     priceId: PRO_PLAN_STRIPE_PRICE_ID // <--- CRITICAL ADDITION
//                 }),
//             });

//             const session = await response.json();

//             if (session.url) {
//                 // STEP 2: Redirect the user to the Stripe Checkout page
//                 window.location.href = session.url;
//             } else {
//                 // If the API returns a message but no URL (e.g., error from the server)
//                 const errorMessage = session.message || "Stripe session creation failed, no URL returned.";
//                 console.error(errorMessage);
//                 throw new Error(errorMessage);
//             }
//         } catch (error) {
//             console.error("Upgrade Error:", error);
//             // In a real app, display a user-friendly error message here
//         } finally {
//             // Reset loading state if redirection failed (i.e., we are still on the page)
//             setIsLoading(false);
//         }
//     }, [user]);

//     // Calculate progress as a percentage
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Progress is based on USED tokens
//         const calculatedValue = (usedTokens / currentLimit) * 100;
//         return Math.min(calculatedValue, 100);
//     }

//     if (!isLoaded || !user || !userData) {
//         // Wait for both Clerk user and Convex userData to load
//         return null;
//     }

//     // Safely get the primary email
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';

//     // Function to format numbers with commas (e.g., 5000 -> 5,000)
//     const formatNumber = (num) => {
//         return num.toLocaleString();
//     };

//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                     // Add onError handler for robustness
//                     onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60/cccccc/000000?text=JD" }}
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Display REMAINING tokens / TOTAL limit */}
//                 <h2 className='text-xl font-semibold'>
//                     {formatNumber(remainingTokens)} / {formatNumber(currentLimit)}
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     {/* The progress value should represent the percentage of tokens USED, not remaining. */}
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3 h-2'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className={`p-1 rounded-lg px-2 text-sm font-medium ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
//                         {isPro ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border border-indigo-200 rounded-2xl shadow-lg'>
//                     <div className='flex justify-between items-center'>
//                         <div>
//                             <h2 className='font-bold text-lg'>Pro Plan</h2>
//                             <h2 className='text-sm text-gray-600'>{formatNumber(PRO_PLAN_LIMIT)} Tokens/Month</h2>
//                         </div>
//                         <h2 className='font-bold text-xl text-indigo-600'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3 border-indigo-100' />

//                     {/* ONLY DISPLAY THE UPGRADE BUTTON (or disabled "Pro Plan Active") */}
//                     <Button
//                         className='w-full bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                         onClick={handleUpgrade}
//                         disabled={isPro || isLoading} // Disable if already Pro or loading
//                     >
//                         {isLoading ? (
//                             <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                         ) : (
//                             <>
//                                 <Wallet2 className='mr-2 h-4 w-4' />
//                                 {isPro ? 'Pro Plan Active' : 'Upgrade to Pro'}
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;

// Credits.jsx (Ensure this file is marked "use client" if using Next.js App Router)

// "use client";

// import React, { useState, useCallback } from 'react';
// import { Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle, Check } from 'lucide-react';
// import { useAction, useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // CRITICAL: Check your path

// // --- CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // The Stripe Price ID must match your Stripe dashboard setup and your convex/stripe.js file
// const PLANS = [
//     { name: 'Basic (Free)', price: '0', limit: FREE_PLAN_LIMIT, icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', limit: PRO_PLAN_LIMIT, icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];


// // --- Custom Modal Component (Keep this consistent) ---
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText }) => {
//     if (!isOpen) return null;

//     const isError = title.includes('Failed');
//     const isSuccess = title.includes('Redirecting') || title.includes('Successfully');

//     let icon = <AlertTriangle className="h-6 w-6 text-yellow-500" />;
//     let iconColor = 'text-yellow-500';

//     if (isError) {
//         icon = <XCircle className="h-6 w-6 text-red-500" />;
//         iconColor = 'text-red-500';
//     } else if (isSuccess) {
//         icon = <Check className="h-6 w-6 text-green-500" />;
//         iconColor = 'text-green-500';
//     }

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4" aria-modal="true">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 card-shadow transform transition-all duration-300 scale-100">
//                 <div className="flex items-center space-x-3 mb-4">
//                     <span className={iconColor}>{icon}</span>
//                     <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//                 </div>
//                 <p className="text-gray-600 mb-6">{message}</p>
//                 <div className="flex justify-end space-x-3">
//                     <button
//                         onClick={onConfirm}
//                         className='px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700'
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Component ---

// export default function Credits() {
//     // ######################################################
//     // 1. ALL HOOKS MUST BE DECLARED UNCONDITIONALLY AT THE TOP
//     // ######################################################

//     // Convex Hooks
//     const user = useQuery(api.users.getUser); // Fetch the current user data
//     const createStripeSession = useAction(api.stripe.createStripeSession); // Action for upgrade

//     // State Hooks
//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, title: '', message: '' });

//     // Function Hooks
//     const closeModal = useCallback(() => {
//         setModal({ isOpen: false, type: null, title: '', message: '' });
//     }, []);

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             // CRITICAL: This is the call that failed with 400 Bad Request
//             const sessionUrl = await createStripeSession({
//                 priceId: planPriceId
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your upgrade.`,
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirect to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             // Display the error message from the Convex server action
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed (400 Bad Request)',
//                 message: `Server Error: ${e.message}. Please ensure you are logged in.`,
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     // ######################################################
//     // 2. CONDITIONAL RENDERING STARTS HERE (After all Hooks)
//     // ######################################################

//     // Handle loading state
//     if (user === undefined) {
//         return (
//             <div className="flex items-center justify-center p-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     // Handle unauthenticated user
//     if (user === null) {
//         return <p>Please log in to manage your subscription.</p>;
//     }

//     const currentPlan = user.plan || 'Free'; // Use the plan status from Convex
//     const currentCredits = user.credits || 0; // Use the credits from Convex

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
//         const isLoading = loadingPriceId === plan.priceId;

//         if (isPro) {
//             if (currentPlan === 'Pro') {
//                 return (<div className="text-center py-3 rounded-xl font-semibold text-lg text-indigo-600 bg-indigo-100">Current Plan</div>);
//             } else {
//                 // UPGRADE button
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center"
//                     >
//                         {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />Redirecting...</>) : (<>Upgrade to Pro</>)}
//                     </button>
//                 );
//             }
//         }

//         if (plan.name.includes('(Free)') && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }
//     };


//     return (
//         <div className="p-4 bg-white rounded-lg shadow-xl">
//             <h2 className="text-2xl font-bold mb-4">Token and Plan Status</h2>

//             {/* --- Token Usage --- */}
//             <div className="mb-6 p-4 border rounded-lg bg-gray-50">
//                 <p className="text-lg font-semibold text-gray-700">Token Usage:</p>
//                 <p className="text-3xl font-extrabold text-indigo-600">
//                     {currentCredits.toLocaleString()} / {(currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                     Current Plan: <span className="font-medium text-green-600">{currentPlan}</span>
//                 </p>
//             </div>

//             {/* --- Plan Cards --- */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`p-6 rounded-xl border-2 transition-all duration-300 ${currentPlan === plan.name.replace(/\s\(Free\)/, '') ? 'border-indigo-600 shadow-lg' : 'border-gray-200'}`}>
//                         <div className="flex items-center mb-4">
//                             <plan.icon className="h-6 w-6 text-indigo-600 mr-3" />
//                             <h3 className="text-xl font-bold">{plan.name}</h3>
//                         </div>
//                         <p className="text-3xl font-extrabold mb-4">
//                             ${plan.price}
//                         </p>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {/* Success/Error Modal */}
//             {modal.isOpen && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                 />
//             )}
//         </div>
//     );
// }

// Credits.jsx

// "use client";

// import React, { useState, useCallback } from 'react';
// import { Loader2, DollarSign, Zap, XCircle, ChevronRight, AlertTriangle, Check } from 'lucide-react';
// import { useAction, useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Verify this path

// // --- CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', limit: FREE_PLAN_LIMIT, icon: DollarSign, priceId: 'price_free', },
//     {
//         name: 'Pro',
//         price: '10.00',
//         limit: PRO_PLAN_LIMIT,
//         icon: Zap,
//         // 🚨 CRITICAL: UPDATE THIS WITH YOUR ACTUAL STRIPE PRICE ID
//         // Example format: 'price_1O1zQ9LjsaK2gP93G4xY7zU'
//         priceId: 'REPLACE_THIS_WITH_YOUR_ACTUAL_STRIPE_PRICE_ID',
//         isPopular: true,
//     },
// ];

// // --- Custom Modal Component (The structure from previous iterations) ---
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText }) => {
//     if (!isOpen) return null;

//     const isError = title.includes('Failed');
//     const isSuccess = title.includes('Redirecting') || title.includes('Successfully');

//     let icon = <AlertTriangle className="h-6 w-6 text-yellow-500" />;
//     let iconColor = 'text-yellow-500';

//     if (isError) {
//         icon = <XCircle className="h-6 w-6 text-red-500" />;
//         iconColor = 'text-red-500';
//     } else if (isSuccess) {
//         icon = <Check className="h-6 w-6 text-green-500" />;
//         iconColor = 'text-green-500';
//     }

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4" aria-modal="true">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 card-shadow transform transition-all duration-300 scale-100">
//                 <div className="flex items-center space-x-3 mb-4">
//                     <span className={iconColor}>{icon}</span>
//                     <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//                 </div>
//                 <p className="text-gray-600 mb-6">{message}</p>
//                 <div className="flex justify-end space-x-3">
//                     <button
//                         onClick={onConfirm}
//                         className='px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700'
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Component ---

// export default function Credits() {
//     // 1. ALL HOOKS MUST BE DECLARED UNCONDITIONALLY AT THE TOP
//     const user = useQuery(api.users.getUser);
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, title: '', message: '' });

//     const closeModal = useCallback(() => {
//         setModal({ isOpen: false, type: null, title: '', message: '' });
//     }, []);

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         // Validation to catch users who forget to update the placeholder
//         if (planPriceId === 'REPLACE_THIS_WITH_YOUR_ACTUAL_STRIPE_PRICE_ID') {
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Configuration Error',
//                 message: 'You must replace the placeholder Stripe ID in Credits.jsx with your actual ID from the Stripe dashboard.',
//             });
//             return;
//         }

//         setLoadingPriceId(planPriceId);

//         try {
//             const sessionUrl = await createStripeSession({
//                 priceId: planPriceId
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your upgrade.`,
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirect to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);

//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed (400 Bad Request)',
//                 message: `Server Error: ${e.message}. Fix: Ensure your Stripe Price ID is correct and exists in Stripe.`,
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     // 2. Conditional Rendering
//     if (user === undefined) {
//         return (
//             <div className="flex items-center justify-center p-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     if (user === null) {
//         return <p>Please log in to manage your subscription.</p>;
//     }

//     const currentPlan = user.plan || 'Free';
//     const currentCredits = user.credits || 0;

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId !== 'price_free';
//         const isLoading = loadingPriceId === plan.priceId;

//         if (isPro) {
//             if (currentPlan === 'Pro') {
//                 return (<div className="text-center py-3 rounded-xl font-semibold text-lg text-indigo-600 bg-indigo-100">Current Plan</div>);
//             } else {
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center"
//                     >
//                         {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />Redirecting...</>) : (<>Upgrade to Pro</>)}
//                     </button>
//                 );
//             }
//         }

//         if (plan.name.includes('(Free)') && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }
//     };


//     return (
//         <div className="p-4 bg-white rounded-lg shadow-xl">
//             <h2 className="text-2xl font-bold mb-4">Token and Plan Status</h2>

//             {/* Token Usage: Displays actual data from Convex */}
//             <div className="mb-6 p-4 border rounded-lg bg-gray-50">
//                 <p className="text-lg font-semibold text-gray-700">Token Usage:</p>
//                 <p className="text-3xl font-extrabold text-indigo-600">
//                     {currentCredits.toLocaleString()} / {(currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                     Current Plan: <span className="font-medium text-green-600">{currentPlan}</span>
//                 </p>
//             </div>

//             {/* Plan Cards */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`p-6 rounded-xl border-2 transition-all duration-300 ${currentPlan === plan.name.replace(/\s\(Free\)/, '') ? 'border-indigo-600 shadow-lg' : 'border-gray-200'}`}>
//                         <div className="flex items-center mb-4">
//                             <plan.icon className="h-6 w-6 text-indigo-600 mr-3" />
//                             <h3 className="text-xl font-bold">{plan.name}</h3>
//                         </div>
//                         <p className="text-3xl font-extrabold mb-4">
//                             ${plan.price}
//                         </p>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {/* Success/Error Modal */}
//             {modal.isOpen && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                 />
//             )}
//         </div>
//     );
// }

// Credits.jsx

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react'; // Import Loader2
// import { useAction } from 'convex/react'; // Import useAction
// import { api } from '@/convex/_generated/api'; // Import api

// // --- CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // 🚨 CRITICAL: REPLACE THIS WITH YOUR ACTUAL STRIPE PRICE ID
// // Example format: 'price_1O1zQ9LjsaK2gP93G4xY7zU'
// const PRO_PRICE_ID = 'REPLACE_THIS_WITH_YOUR_ACTUAL_STRIPE_PRICE_ID';

// // --- Component Definition ---

// function Credits() {
//     // 1. HOOKS (Declared Unconditionally at the top)
//     const { userData } = useContext(UserContext); // Assumes userData is the Convex user object
//     const { isLoaded, user } = useUser();
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const [loading, setLoading] = useState(false);

//     // --- Utility Functions ---

//     const CalculateProgress = () => {
//         // Use the plan field from the Convex user data
//         const totalTokens = userData?.plan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//         // Credits are the REMAINING credits
//         const remainingCredits = Number(userData?.credits) || 0;

//         // Calculate USED tokens for a typical progress bar
//         const usedCredits = totalTokens - remainingCredits;

//         if (totalTokens === 0) return 0;

//         // Return percentage of used tokens
//         return (usedCredits / totalTokens) * 100;
//     }

//     const handleUpgrade = useCallback(async () => {
//         // 🚨 CRITICAL VALIDATION: Check for placeholder ID
//         if (PRO_PRICE_ID.includes('REPLACE_THIS')) {
//             alert('Configuration Error: Please update the PRO_PRICE_ID in Credits.jsx!');
//             return;
//         }

//         setLoading(true);

//         try {
//             const sessionUrl = await createStripeSession({
//                 priceId: PRO_PRICE_ID
//             });

//             if (sessionUrl) {
//                 // Redirect to Stripe checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade Error:', e);
//             // This is where the 'No such price' error is caught
//             alert(`Upgrade Failed: ${e.message}. Check your Stripe Price ID configuration.`);
//             setLoading(false);
//         }
//     }, [createStripeSession]);


//     // --- Early Exit for Loading/Unauthenticated State ---
//     if (!isLoaded || !user) {
//         return null;
//     }

//     // Determine current plan status for display
//     const currentPlan = userData?.plan === 'Pro' ? 'Paid Plan' : 'Free Plan';
//     const totalTokensDisplay = userData?.plan === 'Pro' ? '1,00,000' : '50,000';
//     const remainingCreditsDisplay = (userData?.credits || 0).toLocaleString();

//     // Determine upgrade button state
//     const isPro = userData?.plan === 'Pro';
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';


//     // --- JSX Rendering ---
//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Display remaining credits out of total limit */}
//                 <h2>{remainingCreditsDisplay}/{totalTokensDisplay}</h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {currentPlan}
//                     </h2>
//                 </div>

//                 {/* --- Upgrade Card --- */}
//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             {/* Display 100,000 tokens (corrected from 100,001) */}
//                             <h2>1,00,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />

//                     {/* Upgrade Button Logic */}
//                     {isPro ? (
//                         <Button className='w-full' disabled>
//                             Current Plan Active
//                         </Button>
//                     ) : (
//                         <Button
//                             className='w-full'
//                             onClick={handleUpgrade}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...</>
//                             ) : (
//                                 <><Wallet2 className='mr-2 h-4 w-4' /> Upgrade $10</>
//                             )}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;

// Credits.jsx

// app\(main)\dashboard\_components\Credits.jsx

// Credits.jsx

// Credits.jsx

// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext, useState, useCallback } from 'react'
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2 } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // 🚨 CRITICAL: REPLACE THIS VALUE with your actual Stripe Price ID.
// const PRO_PRICE_ID = 'REPLACE_THIS_WITH_YOUR_ACTUAL_STRIPE_PRICE_ID';

// // --- Component Definition ---

// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const [loading, setLoading] = useState(false);

//     const CalculateProgress = () => {
//         const totalTokens = userData?.plan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//         const remainingCredits = Number(userData?.credits) || 0;
//         const usedCredits = totalTokens - remainingCredits;
//         if (totalTokens === 0) return 0;
//         return (usedCredits / totalTokens) * 100;
//     }

//     const handleUpgrade = useCallback(async () => {
//         // 🚨 This check prevents the console error you were getting
//         if (PRO_PRICE_ID.includes('REPLACE_THIS')) {
//             alert('Configuration Error: Please update the PRO_PRICE_ID in Credits.jsx!');
//             return;
//         }

//         setLoading(true);

//         try {
//             const sessionUrl = await createStripeSession({
//                 priceId: PRO_PRICE_ID
//             });

//             if (sessionUrl) {
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade Error:', e);
//             alert(`Upgrade Failed (Server Error): ${e.message}. Fix: Ensure your Stripe Price ID is correct.`);
//             setLoading(false);
//         }
//     }, [createStripeSession]);


//     if (!isLoaded || !user || userData === undefined) {
//         return null;
//     }

//     const currentPlan = userData?.plan === 'Pro' ? 'Paid Plan' : 'Free Plan';
//     const totalTokensDisplay = (userData?.plan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT).toLocaleString();
//     const remainingCreditsDisplay = (userData?.credits || 0).toLocaleString();

//     const isPro = userData?.plan === 'Pro';
//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';


//     return (
//         <div className='w-full'>
//             {/* Profile Information (Existing code) */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* This dynamically shows the remaining/total tokens */}
//                 <h2>{remainingCreditsDisplay}/{totalTokensDisplay}</h2>

//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {currentPlan}
//                     </h2>
//                 </div>

//                 {/* Upgrade Card */}
//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>{PRO_PLAN_LIMIT.toLocaleString()} Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />

//                     {/* Upgrade Button Logic */}
//                     {isPro ? (
//                         <Button className='w-full' disabled>
//                             Current Plan Active
//                         </Button>
//                     ) : (
//                         <Button
//                             className='w-full'
//                             onClick={handleUpgrade}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...</>
//                             ) : (
//                                 <><Wallet2 className='mr-2 h-4 w-4' /> Upgrade $10</>
//                             )}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits;


// import { useMutation, useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { useUser } from '@clerk/clerk-react';
// import { Wallet2, Loader2 } from 'lucide-react';

// // Custom Modal Component (Assuming this exists and is functional)
// const CustomModal = ({ isOpen, title, messages, onConfirm, onClose, type }) => {
//     if (!isOpen) return null;

//     const isSuccess = type === 'success';

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100">
//                 <div className="flex justify-between items-start">
//                     <h2 className={`text-xl font-bold ${isSuccess ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>{title}</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
//                         <span className="sr-only">Close</span>
//                         &times;
//                     </button>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                     {messages.map((msg, index) => (
//                         <p key={index} className="text-sm text-gray-600 dark:text-gray-400">{msg}</p>
//                     ))}
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                     <button
//                         onClick={isSuccess ? onClose : onConfirm}
//                         className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${isSuccess
//                             ? 'bg-green-600 text-white hover:bg-green-700'
//                             : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                             }`}
//                     >
//                         {isSuccess ? 'OK' : 'Confirm'}
//                     </button>
//                     {!isSuccess && (
//                         <button
//                             onClick={onClose}
//                             className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };


// const CreditPlans = () => {
//     const { user: clerkUser } = useUser();
//     const user = useQuery(api.users.getUser);

//     // Mutation to create the Stripe checkout session
//     const createStripeSession = useMutation(api.stripe.createStripeSession);

//     // State for the confirmation modal
//     const [modal, setModal] = useState({
//         isOpen: false,
//         title: '',
//         messages: [],
//         type: 'confirm', // 'confirm' or 'success'
//         onConfirm: () => { },
//     });
//     // State for loading status during payment processing
//     const [isLoading, setIsLoading] = useState(false);

//     // Hardcoded plan details for display
//     const PLANS = {
//         FREE: {
//             name: 'Free Plan',
//             credits: 50000,
//             price: 'Free',
//             priceId: null, // No Stripe Price ID for the free plan
//             isCurrent: user?.plan === 'Free',
//             description: '50,000 Tokens/Month',
//             buttonText: 'Current Plan',
//         },
//         PRO: {
//             name: 'Pro Plan',
//             credits: 100000,
//             price: '$10/Month',
//             priceId: 'PRO_PRICE_ID', // Placeholder/Error state reference - Actual ID is used on the Convex server
//             isCurrent: user?.plan === 'Pro',
//             description: '100,000 Tokens/Month',
//             buttonText: 'Upgrade to Pro',
//         },
//     };

//     /**
//      * Handles the click event for upgrading to the Pro plan.
//      */
//     const handleUpgradeClick = () => {
//         const proPlan = PLANS.PRO;

//         // Check for the error condition you previously saw
//         if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !process.env.PRO_PRICE_ID) {
//             setModal({
//                 isOpen: true,
//                 title: 'Configuration Error',
//                 messages: [
//                     'Please ensure the following environment variables are set in your Convex dashboard and local environment:',
//                     '1. STRIPE_SECRET_KEY',
//                     '2. PRO_PRICE_ID (Stripe Price ID for Pro Plan)',
//                     '3. CLERK_WEBHOOK_SECRET',
//                     'Also check that your Clerk and Stripe environment variables are correctly configured for webhooks.',
//                 ],
//                 type: 'error',
//                 onConfirm: () => setModal({ ...modal, isOpen: false }),
//             });
//             return;
//         }

//         // Show confirmation modal before proceeding
//         setModal({
//             isOpen: true,
//             title: 'Are you absolutely sure?',
//             messages: [
//                 `${clerkUser?.fullName || 'User'}`,
//                 `${clerkUser?.primaryEmailAddress?.emailAddress || ''}`,
//                 `Token Usage: ${user?.credits || 0}/${PLANS.FREE.credits}`,
//                 `Current Plan: ${user?.plan || 'Loading...'}`,
//                 `${proPlan.name}: ${proPlan.description} for ${proPlan.price}`,
//             ],
//             type: 'confirm',
//             onConfirm: () => handleConfirmUpgrade(proPlan),
//             onClose: () => setModal({ ...modal, isOpen: false }),
//         });
//     };

//     /**
//      * Confirms the upgrade and initiates the Stripe session.
//      * @param {Object} plan - The plan object.
//      */
//     const handleConfirmUpgrade = async (plan) => {
//         setModal({ ...modal, isOpen: false }); // Close confirmation modal
//         setIsLoading(true);

//         try {
//             // Get the current URL to use for success/cancel redirects
//             const returnUrl = window.location.origin + "/dashboard";

//             // Call the new Convex mutation to create the Stripe session
//             const sessionUrl = await createStripeSession({ returnUrl });

//             // Redirect the user to the Stripe Checkout page
//             if (sessionUrl) {
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Failed to get a valid Stripe session URL.");
//             }

//         } catch (error) {
//             console.error("Upgrade Failed:", error);
//             setModal({
//                 isOpen: true,
//                 title: 'Upgrade Failed (400 Bad Request)',
//                 messages: [`Server Error: ${error.message}`, 'Please ensure you are logged in and that the PRO_PRICE_ID and STRIPE_SECRET_KEY are correctly set in your Convex environment variables.'],
//                 type: 'error',
//                 onClose: () => setModal({ ...modal, isOpen: false }),
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // --- Helper function for rendering the plan cards ---
//     const renderPlanButton = (plan) => {
//         if (plan.isCurrent) {
//             return (
//                 <button
//                     className="w-full py-2 mt-4 bg-green-500 text-white font-bold rounded-lg cursor-not-allowed opacity-75 transition-colors duration-300"
//                     disabled
//                 >
//                     {plan.buttonText}
//                 </button>
//             );
//         }

//         return (
//             <button
//                 onClick={handleUpgradeClick}
//                 className="w-full py-2 mt-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
//                 disabled={isLoading}
//             >
//                 {isLoading ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
//                 ) : (
//                     <Wallet2 className="mr-2 h-4 w-4 inline-block" />
//                 )}
//                 {isLoading ? 'Redirecting...' : plan.buttonText}
//             </button>
//         );
//     };


//     return (
//         <div className="p-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Your Plan</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

//                 {/* --- Free Plan Card --- */}
//                 <div className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 ${PLANS.FREE.isCurrent ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'}`}>
//                     <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{PLANS.FREE.name}</h2>
//                     <p className="text-4xl font-black text-gray-900 dark:text-white mb-4">{PLANS.FREE.price}</p>
//                     <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{PLANS.FREE.description}</p>
//                     <div className="text-center">
//                         <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
//                             Current Credits: {user ? user.credits.toLocaleString() : '...'}
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                             {PLANS.FREE.credits.toLocaleString()} total
//                         </p>
//                     </div>
//                     {renderPlanButton(PLANS.FREE)}
//                 </div>

//                 {/* --- Pro Plan Card --- */}
//                 <div className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 ${PLANS.PRO.isCurrent ? 'border-green-500' : 'border-indigo-600'}`}>
//                     <h2 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">{PLANS.PRO.name}</h2>
//                     <p className="text-4xl font-black text-gray-900 dark:text-white mb-4">{PLANS.PRO.price}</p>
//                     <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{PLANS.PRO.description}</p>
//                     <div className="text-center">
//                         <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
//                             Total Credits: {PLANS.PRO.credits.toLocaleString()}
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                             Available for Pro Subscribers
//                         </p>
//                     </div>
//                     {renderPlanButton(PLANS.PRO)}
//                 </div>

//             </div>

//             {/* Modal for confirmation or errors */}
//             <CustomModal
//                 isOpen={modal.isOpen}
//                 title={modal.title}
//                 messages={modal.messages}
//                 onConfirm={modal.onConfirm}
//                 onClose={() => setModal({ ...modal, isOpen: false })}
//                 type={modal.type}
//             />

//         </div>
//     );
// };

// export default CreditPlans;


// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext, useState } from 'react' // Import useState
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react'; // Import Loader2 and Zap for loading/upgrade icon

// // --- MOCK/ASSUMED CONVEX INTEGRATION FOR DEMO ---
// // NOTE: In your actual project, you must ensure 'useMutation' is imported 
// // from 'convex/react' and 'api' is configured correctly.
// const useMutation = (apiPath) => {
//     // Mock mutation call that simulates creating a Stripe session and returning a URL
//     return async (args) => {
//         console.log("Mock Stripe Session Created for:", apiPath, args.returnUrl);
//         // This is a mock URL. In your running app, it will be the real Stripe link.
//         const STRIPE_PRO_PRICE_ID_MOCK = 'price_1Oa1xI2eZvKYlo2CcjK8a4t5';
//         return `https://mock-stripe-checkout.com/session_12345?price=${STRIPE_PRO_PRICE_ID_MOCK}`;
//     };
// };

// const api = {
//     stripe: {
//         createStripeSession: "stripe:createStripeSession", // Matches the name used in the convex file
//     },
// };
// // --- END MOCK/ASSUMED CONVEX INTEGRATION FOR DEMO ---

// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to manage the loading status of the upgrade button
//     const [isLoading, setIsLoading] = useState(false);

//     // Use the mutation hook for the Stripe session creation (replace useMutation with actual import in your file)
//     const createStripeSession = useMutation(api.stripe.createStripeSession);

//     const CalculateProgress = () => {
//         // Use the correct token limits (100000 for Paid/Pro, 5000 for Free)
//         const totalTokens = userData?.subscriptionId ? 100000 : 5000;
//         const usedCredits = Number(userData?.credits) || 0;

//         if (totalTokens === 0) return 0;

//         const calculatedValue = (usedCredits / totalTokens) * 100;

//         // Ensure the value does not exceed 100
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Handles the upgrade button click, initiating the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         setIsLoading(true);
//         try {
//             // Define the return URL where the user will be redirected after checkout.
//             const returnUrl = window.location.origin + "/dashboard";

//             // Call the Convex mutation to create the Stripe session
//             const sessionUrl = await createStripeSession({ returnUrl });

//             // Redirect the user to the Stripe Checkout page
//             if (sessionUrl) {
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Failed to get a valid Stripe session URL.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Use a custom alert/modal in a real app, but using window.alert for quick feedback here
//             window.alert("Upgrade failed. Please check the console for details.");
//         } finally {
//             // Only set loading to false if an error occurs and redirection didn't happen
//             setIsLoading(false);
//         }
//     }


//     if (!isLoaded || !user) {
//         return null;
//     }

//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';
//     const isPaidUser = !!userData?.subscriptionId;

//     // Determine the button content based on subscription status and loading state
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     // Paid users should ideally be directed to Stripe's Customer Portal for management.
//     // For now, we disable it and just show the status.
//     const buttonHandler = isPaidUser ? () => { /* Future Stripe Portal link */ } : handleUpgradeClick;
//     const buttonDisabled = isPaidUser || isLoading;


//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Updated token display for 1,00,000 paid tokens */}
//                 <h2>{userData?.credits || '0'}/{isPaidUser ? '1,00,000' : '5,000'}</h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {isPaidUser ? 'Paid Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>1,00,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />
//                     {/* Updated Button to handle the upgrade logic and loading state */}
//                     <Button
//                         className='w-full'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext, useState } from 'react'
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// // 🛑 CRITICAL FIX: Add the Convex imports needed for mutations
// import { useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Adjust the path if necessary for your project structure

// // --- REMOVED PLACEHOLDERS (useMutation and api) ---
// // The original placeholder code is now removed to force the use of 
// // your project's actual imports when running locally. 
// // If your local environment is correctly set up, this component should 
// // now use the real Convex hooks.
// // --- END REMOVED PLACEHOLDERS ---


// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to manage the loading status of the upgrade button
//     const [isLoading, setIsLoading] = useState(false);

//     // This now uses the correctly imported 'useMutation'
//     const createStripeSession = useMutation(api.stripe.createStripeSession);

//     const CalculateProgress = () => {
//         // Use the correct token limits (100000 for Paid/Pro, 5000 for Free)
//         const totalTokens = userData?.subscriptionId ? 100000 : 5000;
//         const usedCredits = Number(userData?.credits) || 0;

//         if (totalTokens === 0) return 0;

//         const calculatedValue = (usedCredits / totalTokens) * 100;

//         // Ensure the value does not exceed 100
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Handles the upgrade button click, initiating the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         setIsLoading(true);
//         try {
//             // Define the return URL where the user will be redirected after checkout.
//             const returnUrl = window.location.origin + "/dashboard";

//             // Call the Convex mutation to create the Stripe session
//             const sessionUrl = await createStripeSession({ returnUrl });

//             // Redirect the user to the Stripe Checkout page
//             if (sessionUrl) {
//                 // The crucial step: redirect the browser to the Stripe session URL
//                 window.location.href = sessionUrl;
//             } else {
//                 // If sessionUrl is null or undefined, the mutation failed to return the URL.
//                 // We'll log the error and stop the loading state.
//                 throw new Error("Failed to get a valid Stripe session URL from the server.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Display a user-friendly message based on the error
//             window.alert(`Upgrade failed. Please check your browser console for error details.`);
//         } finally {
//             // Only set loading to false if an error occurred before successful redirection
//             // (If redirection succeeds, this code won't run as the page unloads)
//             setIsLoading(false);
//         }
//     }


//     if (!isLoaded || !user) {
//         return null;
//     }

//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';
//     const isPaidUser = !!userData?.subscriptionId;

//     // Determine the button content based on subscription status and loading state
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     // Handle button action: Upgrade for free users, future management for paid users
//     const buttonHandler = isPaidUser ? () => { console.log("Direct to Stripe Customer Portal (Future Feature)"); } : handleUpgradeClick;
//     const buttonDisabled = isPaidUser || isLoading;


//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Updated token display for 1,00,000 paid tokens */}
//                 <h2>{userData?.credits || '0'}/{isPaidUser ? '1,00,000' : '5,000'}</h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {isPaidUser ? 'Paid Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>1,00,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />
//                     {/* Updated Button to handle the upgrade logic and loading state */}
//                     <Button
//                         className='w-full'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext'
// import React, { useContext, useState } from 'react'
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// // 🛑 CRITICAL FIX: Change to useAction since stripe.createStripeSession is an Action
// import { useAction } from 'convex/react'; // CHANGED: from useMutation
// import { api } from '@/convex/_generated/api'; // Adjust the path if necessary for your project structure

// // --- REMOVED PLACEHOLDERS (useMutation and api) ---
// // The original placeholder code is now removed to force the use of 
// // your project's actual imports when running locally. 
// // If your local environment is correctly set up, this component should 
// // now use the real Convex hooks.
// // --- END REMOVED PLACEHOLDERS ---


// function Credits() {
//     const { userData } = useContext(UserContext);
//     const { isLoaded, user } = useUser();

//     // State to manage the loading status of the upgrade button
//     const [isLoading, setIsLoading] = useState(false);

//     // FIX: Using useAction now, as createStripeSession is an Action
//     const createStripeSession = useAction(api.stripe.createStripeSession); // CHANGED: from useMutation

//     const CalculateProgress = () => {
//         // Use the correct token limits (100000 for Paid/Pro, 5000 for Free)
//         const totalTokens = userData?.subscriptionId ? 100000 : 5000;
//         const usedCredits = Number(userData?.credits) || 0;

//         if (totalTokens === 0) return 0;

//         const calculatedValue = (usedCredits / totalTokens) * 100;

//         // Ensure the value does not exceed 100
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Handles the upgrade button click, initiating the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         setIsLoading(true);
//         try {
//             // Define the return URL where the user will be redirected after checkout.
//             const returnUrl = window.location.origin + "/dashboard";

//             // Call the Convex action to create the Stripe session
//             const sessionUrl = await createStripeSession({ returnUrl });

//             // Redirect the user to the Stripe Checkout page
//             if (sessionUrl) {
//                 // The crucial step: redirect the browser to the Stripe session URL
//                 window.location.href = sessionUrl;
//             } else {
//                 // If sessionUrl is null or undefined, the action failed to return the URL.
//                 // We'll log the error and stop the loading state.
//                 throw new Error("Failed to get a valid Stripe session URL from the server.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Display a user-friendly message based on the error
//             window.alert(`Upgrade failed. Please check your browser console for error details.`);
//         } finally {
//             // Only set loading to false if an error occurred before successful redirection
//             // (If redirection succeeds, this code won't run as the page unloads)
//             setIsLoading(false);
//         }
//     }


//     if (!isLoaded || !user) {
//         return null;
//     }

//     const primaryEmail = user.primaryEmailAddress?.emailAddress || 'Email not available';
//     const isPaidUser = !!userData?.subscriptionId;

//     // Determine the button content based on subscription status and loading state
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     // Handle button action: Upgrade for free users, future management for paid users
//     const buttonHandler = isPaidUser ? () => { console.log("Direct to Stripe Customer Portal (Future Feature)"); } : handleUpgradeClick;
//     const buttonDisabled = isPaidUser || isLoading;


//     return (
//         <div className='w-full'>
//             {/* 1. Profile Information: Picture, Name, and Email */}
//             <div className='flex gap-5 items-center mb-5'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full'
//                     alt="User Profile"
//                 />
//                 <div>
//                     <h2 className='text-lg font-bold'>{user?.fullName || user?.username || 'User'}</h2>
//                     <h2 className='text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             <hr className='my-3' />

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold'>Token Usage</h2>
//                 {/* Updated token display for 1,00,000 paid tokens */}
//                 <h2>{userData?.credits || '0'}/{isPaidUser ? '1,00,000' : '5,000'}</h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='my-3'
//                     />
//                 </div>

//                 <div className='flex justify-between items-center mt-3'>
//                     <h2 className='font-bold'>Current Plan</h2>
//                     <h2 className='p-1 bg-secondary rounded-lg px-2'>
//                         {isPaidUser ? 'Paid Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 <div className='mt-5 p-5 border rounded-2xl'>
//                     <div className='flex justify-between'>
//                         <div>
//                             <h2 className='font-bold'>Pro Plan</h2>
//                             <h2>1,00,000 Tokens</h2>
//                         </div>
//                         <h2 className='font-bold'>$10/Month</h2>
//                     </div>
//                     <hr className='my-3' />
//                     {/* Updated Button to handle the upgrade logic and loading state */}
//                     <Button
//                         className='w-full'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- UPDATED HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000; // Updated as requested
// const PRO_PLAN_LIMIT = 100000;


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         const totalTokens = userData?.subscriptionId ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//         const usedCredits = Number(userData?.credits) || 0;

//         if (totalTokens === 0) return 0;

//         const calculatedValue = (usedCredits / totalTokens) * 100;

//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             const returnUrl = window.location.origin + "/dashboard";

//             const sessionUrl = await createStripeSession({ returnUrl });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Stripe session URL was null or undefined, check Convex logs for errors.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError("Upgrade failed. Check console and Convex logs for the 'AUTHENTICATION FAILED' error.");
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//     const usedCredits = Number(userData?.credits) || 0;

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { console.log("Direct to Stripe Customer Portal (Future Feature)"); }
//         : handleUpgradeClick;

//     const buttonDisabled = isPaidUser || isLoading;


//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 <Image
//                     src={user?.imageUrl}
//                     width={60}
//                     height={60}
//                     className='rounded-full h-14 w-14 object-cover'
//                     alt="User Profile"
//                     unoptimized
//                 />
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={CalculateProgress()}
//                         className='h-3'
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {CalculateProgress().toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Error:</p>
//                         <p>{upgradeError}</p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className='w-full h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- UPDATED HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000; // Updated as requested
// const PRO_PLAN_LIMIT = 100000;


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     // CRITICAL FIX: Ensure 'userData.credits' is always parsed as a number.
//     // Use Number() or parseInt(). I will use Number() for simplicity.
//     const usedCredits = Number(userData?.credits) || 0;
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             // NOTE: For local development, this needs to be http://localhost:3000
//             const returnUrl = window.location.origin + "/dashboard";

//             const sessionUrl = await createStripeSession({ returnUrl });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw an error if the URL is missing (often due to Convex action failure)
//                 throw new Error("Stripe session URL was null or undefined, check Convex logs for errors.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown error.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open('https://billing.stripe.com/p/login/YOUR_STRIPE_CUSTOMER_PORTAL_LINK_GOES_HERE', '_blank'); } // Direct to Stripe Portal (you need to replace this link)
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'


//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={CalculateProgress()}
//                         // Dynamically change color based on usage, Tailwind CSS classes allow this.
//                         className={`h-3 ${CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         // Add an explicit color for the bar itself if using shadcn progress
//                         indicatorClassName={CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600'}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {CalculateProgress().toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Error:</p>
//                         <p>{upgradeError}</p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className='w-full h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- UPDATED HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000; // Updated as requested
// const PRO_PLAN_LIMIT = 100000;


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     // CRITICAL FIX: Ensure 'userData.credits' is always parsed as a number.
//     // Use Number() or parseInt(). I will use Number() for simplicity.
//     const usedCredits = Number(userData?.credits) || 0;
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             const returnUrl = window.location.origin + "/dashboard";

//             // CRITICAL FIX: Pass the priceKey argument to match the new Convex action signature
//             const sessionUrl = await createStripeSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in PRICE_ID_MAP
//             });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw an error if the URL is missing (often due to Convex action failure)
//                 throw new Error("Stripe session URL was null or undefined, check Convex logs for errors.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown error.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open('https://billing.stripe.com/p/login/YOUR_STRIPE_CUSTOMER_PORTAL_LINK_GOES_HERE', '_blank'); } // Direct to Stripe Portal (you need to replace this link)
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'


//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={CalculateProgress()}
//                         // Dynamically change color based on usage, Tailwind CSS classes allow this.
//                         className={`h-3 ${CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         // Add an explicit color for the bar itself if using shadcn progress
//                         indicatorClassName={CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600'}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {CalculateProgress().toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Error:</p>
//                         <p>{upgradeError}</p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className='w-full h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors'
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- UPDATED HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     // CRITICAL FIX: Ensure 'userData.credits' is always parsed as a number.
//     const usedCredits = Number(userData?.credits) || 0;
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             const returnUrl = window.location.origin + "/dashboard";

//             // CRITICAL FIX: Pass the priceKey argument to match the new Convex action signature
//             const sessionUrl = await createStripeSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in PRICE_ID_MAP
//             });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw an error if the URL is missing (often due to Convex action failure)
//                 throw new Error("Stripe session URL was null or undefined, check Convex logs for errors.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown error.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open('https://billing.stripe.com/p/login/YOUR_STRIPE_CUSTOMER_PORTAL_LINK_GOES_HERE', '_blank'); } // Direct to Stripe Portal (you need to replace this link)
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'

//     // Determine progress bar indicator color
//     const indicatorColorClass = CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600';

//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={CalculateProgress()}
//                         // FIX: Ensure the Tailwind class is applied correctly to the indicator
//                         indicatorClassName={indicatorColorClass}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {CalculateProgress().toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Error:</p>
//                         <p>{upgradeError}</p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         // FIX: Added 'focus:ring' classes for accessibility and consistent styling
//                         className={`w-full h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isPaidUser ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
//                             }`}
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // NOTE: This is a placeholder. You MUST replace this with the actual link
// // to your Stripe Customer Portal for managing subscriptions.
// const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/YOUR_STRIPE_CUSTOMER_PORTAL_LINK_GOES_HERE';


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     // CRITICAL: Ensure 'userData.credits' is always parsed as a number.
//     const usedCredits = Number(userData?.credits) || 0;
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             const returnUrl = window.location.origin + "/dashboard";

//             // Pass the priceKey argument to match the Convex action signature
//             const sessionUrl = await createStripeSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in PRICE_ID_MAP on Convex
//             });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw an error if the URL is missing (often due to Convex action failure)
//                 throw new Error("Stripe session URL was null or undefined, check Convex logs for errors.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown error.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open(STRIPE_PORTAL_URL, '_blank'); } // Direct to Stripe Portal
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'

//     // Determine progress bar indicator color: red if close to limit on Free Plan
//     const indicatorColorClass = CalculateProgress() > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600';

//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={CalculateProgress()}
//                         // Ensure the Tailwind class is applied correctly to the indicator
//                         indicatorClassName={indicatorColorClass}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {CalculateProgress().toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Error:</p>
//                         <p>{upgradeError}</p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className={`w-full h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isPaidUser
//                                 ? 'bg-gray-600 hover:bg-gray-700 text-white' // Gray for manage button
//                                 : 'bg-indigo-600 hover:bg-indigo-700 text-white' // Indigo for upgrade button
//                             }`}
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api';

// // --- HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// /**
//  * CRITICAL FIX/NOTE:
//  * The 404 error is usually caused by the Convex action failing to talk to Stripe 
//  * (due to missing or incorrect CONVEX_SECRET_STRIPE_WEBHOOK_SECRET and STRIPE_SECRET_KEY 
//  * in your Convex dashboard) OR the Price ID in PRICE_ID_MAP is incorrect.
//  * This component's logic is sound.
//  */

// // NOTE: This placeholder URL MUST be updated in a live environment to a valid Stripe Customer Portal link.
// const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/PLACEHOLDER_FOR_STRIPE_CUSTOMER_PORTAL';


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // Convex action to initiate Stripe checkout
//     const createStripeSession = useAction(api.stripe.createStripeSession);

//     // CRITICAL: Ensure 'userData.credits' is always parsed as a number.
//     const usedCredits = Number(userData?.credits) || 0;
//     // Check if subscriptionId is a non-empty string to confirm payment status
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Stripe checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for Stripe
//             // Ensure this URL is correct and handled by a routing logic (e.g., in _app.js or a dedicated page)
//             const returnUrl = window.location.origin + "/dashboard";

//             // Pass the priceKey argument to match the Convex action signature
//             const sessionUrl = await createStripeSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in PRICE_ID_MAP on Convex
//             });

//             if (sessionUrl) {
//                 // Redirect user to Stripe's checkout page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw a more descriptive error if the URL is missing
//                 throw new Error("Stripe session URL was not returned. This likely means the Convex action failed. Check your Stripe and Convex Environment Variables (API Keys, Price ID, Webhook Secret) and your Convex logs.");
//             }

//         } catch (error) {
//             console.error("Stripe Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown network error. Check console for details.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open(STRIPE_PORTAL_URL, '_blank'); } // Direct to Stripe Portal
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'

//     // Determine progress bar indicator color: red if close to limit on Free Plan
//     const progressValue = CalculateProgress();
//     const indicatorColorClass = progressValue > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600';

//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={progressValue}
//                         // Ensure the Tailwind class is applied correctly to the indicator
//                         indicatorClassName={indicatorColorClass}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {progressValue.toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Upgrade Issue:</p>
//                         <p>{upgradeError}</p>
//                         {/* Specific guidance for the user */}
//                         <p className='mt-2 font-medium'>
//                             <span className='text-red-900'>Debugging Tip:</span> If you see an error related to "session URL was not returned," this is a Convex/Stripe backend issue. Check your Convex deployment logs for errors related to **Stripe API keys or Price ID configuration**.
//                         </p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className={`w-full h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isPaidUser
//                             ? 'bg-gray-600 hover:bg-gray-700 text-white' // Gray for manage button
//                             : 'bg-indigo-600 hover:bg-indigo-700 text-white' // Indigo for upgrade button
//                             }`}
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/lib/convex/_generated/api';
// // --- HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // NOTE: This placeholder URL is used for the "Manage Subscription" button only
// const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/PLACEHOLDER_FOR_STRIPE_CUSTOMER_PORTAL';


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // 💡 FIX: Switched from api.stripe.createStripeSession to the new mock action
//     const createMockSession = useAction(api.mockPayments.createCheckoutSession);

//     // CRITICAL: Ensure 'userData.credits' is always parsed as a number.
//     const usedCredits = Number(userData?.credits) || 0;
//     // Check if subscriptionId is a non-empty string to confirm payment status
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Mock checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for the mock session
//             const returnUrl = window.location.origin;

//             // 💡 CRITICAL CHANGE: Call the mock payment action
//             const sessionUrl = await createMockSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in the Mock config
//             });

//             if (sessionUrl) {
//                 // Redirect user to the local mock payment page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw a more descriptive error if the URL is missing
//                 throw new Error("Mock session URL was not returned. Check your Convex logs.");
//             }

//         } catch (error) {
//             console.error("Mock Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown network error. Check console for details.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open(STRIPE_PORTAL_URL, '_blank'); } // Direct to Stripe Portal
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'

//     // Determine progress bar indicator color: red if close to limit on Free Plan
//     const progressValue = CalculateProgress();
//     const indicatorColorClass = progressValue > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600';

//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={progressValue}
//                         // Ensure the Tailwind class is applied correctly to the indicator
//                         indicatorClassName={indicatorColorClass}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {progressValue.toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Upgrade Issue:</p>
//                         <p>{upgradeError}</p>
//                         {/* Specific guidance for the user */}
//                         <p className='mt-2 font-medium'>
//                             <span className='text-red-900'>Debugging Tip:</span> If you see an error related to "session URL was not returned," this is a Convex backend issue. Check your Convex deployment logs for errors related to **the mock action or authentication**.
//                         </p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className={`w-full h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isPaidUser
//                             ? 'bg-gray-600 hover:bg-gray-700 text-white' // Gray for manage button
//                             : 'bg-indigo-600 hover:bg-indigo-700 text-white' // Indigo for upgrade button
//                             }`}
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits

// import { UserContext } from '@/app/_context/UserContext';
// import React, { useContext, useState } from 'react';
// import Image from 'next/image';
// import { useUser } from '@clerk/nextjs';
// // Assuming Progress, Button are shadcn/ui components available
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Wallet2, Loader2, Zap } from 'lucide-react';
// import { useAction } from 'convex/react';
// // The 'api' import is technically not needed for this specific fix, 
// // but we'll keep it as it might be used elsewhere.
// import { api } from '@/lib/convex/_generated/api';

// // --- HARDCODED LIMITS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // NOTE: This placeholder URL is used for the "Manage Subscription" button only
// const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/PLACEHOLDER_FOR_STRIPE_CUSTOMER_PORTAL';


// function Credits() {
//     // Context provides Convex user data (credits, subscriptionId)
//     const { userData } = useContext(UserContext);

//     // Clerk hook provides authenticated user profile data (email, image)
//     const { isLoaded, user } = useUser();

//     const [isLoading, setIsLoading] = useState(false);
//     const [upgradeError, setUpgradeError] = useState(null);

//     // 🌟🌟🌟 THE CRITICAL FIX IS HERE 🌟🌟🌟
//     // useAction requires the function path as a string literal.
//     const createMockSession = useAction("mockPayments:createCheckoutSession");
//     // 💡 Note: If you were using a query or mutation, you would use:
//     // const userDataQuery = useQuery(api.users.getOrCreateUser); 

//     // CRITICAL: Ensure 'userData.credits' is always parsed as a number.
//     const usedCredits = Number(userData?.credits) || 0;
//     // Check if subscriptionId is a non-empty string to confirm payment status
//     const isPaidUser = !!userData?.subscriptionId;
//     const currentLimit = isPaidUser ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;


//     /**
//      * Calculates the token usage progress percentage.
//      */
//     const CalculateProgress = () => {
//         if (currentLimit === 0) return 0;
//         // Calculate usage percentage relative to the current limit
//         const calculatedValue = (usedCredits / currentLimit) * 100;

//         // Cap the progress bar visually at 100% even if usage exceeds limit
//         return Math.min(calculatedValue, 100);
//     }

//     /**
//      * Initiates the Mock checkout process.
//      */
//     const handleUpgradeClick = async () => {
//         // Critical check: Ensure user data is present before calling Convex action
//         if (!isLoaded || !user || !user.primaryEmailAddress) {
//             console.error("Clerk user is not fully loaded or email is missing. Cannot proceed.");
//             setUpgradeError("Authentication data missing. Please try refreshing.");
//             return;
//         }

//         // Prevent running if the hook is somehow unavailable (though unlikely here)
//         if (!createMockSession) {
//             setUpgradeError("Convex mock function not loaded. Check your console/server.");
//             return;
//         }

//         setIsLoading(true);
//         setUpgradeError(null);
//         try {
//             // Use the current domain as the return URL for the mock session
//             const returnUrl = window.location.origin;

//             // 💡 CRITICAL CHANGE: Call the mock payment action
//             const sessionUrl = await createMockSession({
//                 returnUrl,
//                 priceKey: 'price_pro' // This corresponds to the 'price_pro' key in the Mock config
//             });

//             if (sessionUrl) {
//                 // Redirect user to the local mock payment page
//                 window.location.href = sessionUrl;
//             } else {
//                 // Throw a more descriptive error if the URL is missing
//                 throw new Error("Mock session URL was not returned. Check your Convex logs.");
//             }

//         } catch (error) {
//             console.error("Mock Upgrade Failed:", error);
//             // Inform the user about the error
//             setUpgradeError(`Upgrade failed: ${error.message || 'Unknown network error. Check console for details.'}`);
//             setIsLoading(false);
//         }
//     }


//     // Loading state while Clerk loads user data
//     if (!isLoaded) {
//         return <div className="animate-pulse w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">Loading User Data...</div>;
//     }

//     // Authenticated User Details
//     const primaryEmail = user?.primaryEmailAddress?.emailAddress || 'Email not available';
//     const fullName = user?.fullName || user?.username || 'User';

//     // --- Button Content Logic ---
//     const buttonContent = isPaidUser ? (
//         <>
//             <Wallet2 className='mr-2 h-4 w-4' /> Manage Subscription
//         </>
//     ) : isLoading ? (
//         <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Redirecting...
//         </>
//     ) : (
//         <>
//             <Zap className='mr-2 h-4 w-4' /> Upgrade $10
//         </>
//     );

//     const buttonHandler = isPaidUser
//         ? () => { window.open(STRIPE_PORTAL_URL, '_blank'); } // Direct to Stripe Portal
//         : handleUpgradeClick;

//     const buttonDisabled = isLoading; // Only disable during loading, allow paid users to click 'Manage'

//     // Determine progress bar indicator color: red if close to limit on Free Plan
//     const progressValue = CalculateProgress();
//     const indicatorColorClass = progressValue > 90 && !isPaidUser ? 'bg-red-500' : 'bg-indigo-600';

//     return (
//         <div className='max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl font-sans border border-gray-100'>

//             {/* 1. Profile Information */}
//             <div className='flex gap-5 items-center mb-5 border-b pb-4'>
//                 {/* Use optional chaining on user before accessing imageUrl */}
//                 {user?.imageUrl && (
//                     <Image
//                         src={user.imageUrl}
//                         width={60}
//                         height={60}
//                         className='rounded-full h-14 w-14 object-cover'
//                         alt="User Profile"
//                         unoptimized
//                     />
//                 )}
//                 <div>
//                     <h2 className='text-xl font-bold text-gray-900'>{fullName}</h2>
//                     <h2 className='text-sm text-gray-500'>{primaryEmail}</h2>
//                 </div>
//             </div>

//             {/* 2. Token Usage and Plan Details */}
//             <div className='w-full'>
//                 <h2 className='font-bold text-lg text-gray-800 mb-1'>Token Usage</h2>

//                 {/* Display correct usage based on the parsed number */}
//                 <h2 className='text-md text-gray-600'>
//                     {usedCredits.toLocaleString()}/{currentLimit.toLocaleString()} used
//                 </h2>

//                 {/* The Progress bar rendering section */}
//                 <div className='w-full my-4'>
//                     <Progress
//                         value={progressValue}
//                         // Ensure the Tailwind class is applied correctly to the indicator
//                         indicatorClassName={indicatorColorClass}
//                     />
//                     <p className='text-xs text-gray-400 mt-1 text-right'>
//                         {progressValue.toFixed(1)}% of limit
//                     </p>
//                 </div>

//                 <div className='flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg border'>
//                     <h2 className='font-bold text-gray-700'>Current Plan</h2>
//                     <h2 className='p-1 bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 text-sm'>
//                         {isPaidUser ? 'Pro Plan' : 'Free Plan'}
//                     </h2>
//                 </div>

//                 {upgradeError && (
//                     <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         <p className="font-semibold">Upgrade Issue:</p>
//                         <p>{upgradeError}</p>
//                         {/* Specific guidance for the user */}
//                         <p className='mt-2 font-medium'>
//                             <span className='text-red-900'>Debugging Tip:</span> If you see an error related to "session URL was not returned," this is a Convex backend issue. Check your Convex deployment logs for errors related to **the mock action or authentication**.
//                         </p>
//                     </div>
//                 )}

//                 {/* Pro Plan Card */}
//                 <div className='mt-6 p-5 border-2 border-indigo-200 bg-indigo-50 rounded-xl text-center'>
//                     <div className='flex justify-between items-center mb-3'>
//                         <div>
//                             <h2 className='font-extrabold text-indigo-800 text-xl'>Pro Plan</h2>
//                             <h2 className='text-sm text-indigo-600'>{PRO_PLAN_LIMIT.toLocaleString()} Tokens/mo</h2>
//                         </div>
//                         <h2 className='font-extrabold text-2xl text-indigo-800'>$10/Month</h2>
//                     </div>

//                     <p className='text-sm text-indigo-600 mb-5 text-left'>
//                         Unleash full creative and professional power.
//                     </p>

//                     <Button
//                         className={`w-full h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isPaidUser
//                             ? 'bg-gray-600 hover:bg-gray-700 text-white' // Gray for manage button
//                             : 'bg-indigo-600 hover:bg-indigo-700 text-white' // Indigo for upgrade button
//                             }`}
//                         onClick={buttonHandler}
//                         disabled={buttonDisabled}
//                     >
//                         {buttonContent}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Credits


"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Wallet2, Loader2 } from "lucide-react";
import { UserContext } from "@/app/_context/UserContext";
// import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useQuery } from "convex/react";
import { useAction, useMutation, useQuery } from "convex/react";

function Credits() {
    // userData contains fields like { credits: number, subscriptionId: string | undefined }
    const { userData } = useContext(UserContext);
    const currentUser = useQuery(api.users.getCurrentUser);

    const { isLoaded, user } = useUser();

    const [isLoading, setIsLoading] = useState(false);

    // Dodo Payments checkout action

    // const touchUser = useMutation(api.webhooks.touchUser);
    const createCheckout = useAction(api.payments.createCheckout);

    const FREE_PLAN_LIMIT = 50000;
    const PRO_PLAN_LIMIT = 200000;

    const isPro = currentUser?.plan === "Pro";
    const currentLimit = isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;

    const remainingTokens = Number(currentUser?.credits ?? 0);

    const usedTokens = (isPro ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT) - remainingTokens;
    // Dodo Payments Upgrade (Checkout)
    const handleUpgrade = async () => {
        try {
            setIsLoading(true);
            const { checkout_url } = await createCheckout({
                product_cart: [{ product_id: "pdt_d7xTwPzjbG1kamAWlugb5", quantity: 1 }], // replace with your actual Dodo product ID
                returnUrl: `${window.location.origin}${window.location.pathname}?payment_success=true`
            });
            window.location.href = checkout_url;
        } catch (error) {
            console.error("Error creating checkout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 NEW EFFECT: Triggers refresh on successful return
    // ------------------------------------
    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
        
    //     console.log("PAGE LOAD: Checking URL for payment_success...");

    //     if (urlParams.get('payment_success') === 'true') {
    //         console.log("✅ Payment success detected in URL. Forcing Convex query refresh...");
            
    //         // Call the mutation to "touch" the user
    //         touchUser()
    //             .then(() => {
    //                 console.log("✅ User data refreshed! Tokens should now be visible.");
    //             })
    //             .catch((error) => {
    //                 console.error("Error touching user for refresh:", error);
    //             });

    //         // Clean the URL param *after* triggering the refresh
    //         window.history.replaceState({}, '', window.location.pathname);
    //     }
    // }, [touchUser]); // Depend on touchUser


    // Cancel plan (optional if Dodo supports subscription cancel)
    const handleCancelPlan = async () => {
        // You can implement a Dodo cancel API action later if needed.
        alert("Cancel plan functionality will be added soon.");
    };

    const CalculateProgress = () => {
        if (currentLimit === 0) return 0;
        const calculatedValue = ((currentLimit - remainingTokens) / currentLimit) * 100;
        // return Math.min(calculatedValue, 100);
        return Math.min(Math.max(calculatedValue, 0), 100);
    };

    if (!isLoaded || !user) {
        return null; // Clerk not ready yet
    }

    // Check 2: 🔥 RECOMMENDED ADDITION FOR SMOOTH UX
    // If currentUser is undefined, the Convex query is still fetching.
    if (currentUser === undefined) {
        return (
            <div className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }
    
    // Check 3: If currentUser is null, the user is authenticated but not in Convex.
    // In your logic, getOrCreateUser should prevent this, so returning null is fine.
    if (currentUser === null) {
        return null; 
    }

    const primaryEmail =
        user.primaryEmailAddress?.emailAddress || "Email not available";

    const formatNumber = (num) => num.toLocaleString();

    return (
        <div className="w-full">
            {/* Profile Info */}
            <div className="flex gap-5 items-center mb-5">
                <Image
                    src={user?.imageUrl}
                    width={60}
                    height={60}
                    className="rounded-full"
                    alt="User Profile"
                />
                <div>
                    <h2 className="text-lg font-bold">
                        {user?.fullName || user?.username || "User"}
                    </h2>
                    <h2 className="text-gray-500">{primaryEmail}</h2>
                </div>
            </div>

            <hr className="my-3" />

            {/* Token Usage */}
            <div className="w-full">
                <h2 className="font-bold">Token Usage</h2>
                <h2 className="text-xl font-semibold">
                    {formatNumber(remainingTokens)} / {formatNumber(currentLimit)}
                </h2>

                <div className="w-full">
                    <Progress value={CalculateProgress()} className="my-3 h-2" />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <h2 className="font-bold">Current Plan</h2>
                    <h2
                        className={`p-1 rounded-lg px-2 text-sm font-medium ${isPro
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-green-100 text-green-700"
                            }`}
                    >
                        {isPro ? "Pro Plan" : "Free Plan"}
                    </h2>
                </div>

                {/* Upgrade / Cancel Section */}
                <div className="mt-5 p-5 border border-indigo-200 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-lg">Pro Plan</h2>
                            <h2 className="text-sm text-gray-600">
                                {formatNumber(PRO_PLAN_LIMIT)}
                            </h2>
                        </div>
                        <h2 className="font-bold text-xl text-indigo-600">$5</h2>
                    </div>
                    <hr className="my-3 border-indigo-100" />

                    {isPro ? (
                        <Button
                            className="w-full bg-red-500 hover:bg-red-600 transition-colors"
                            onClick={handleCancelPlan}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Cancel Pro Plan"
                            )}
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            onClick={handleUpgrade}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Wallet2 className="mr-2 h-4 w-4" /> Upgrade to Pro
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Credits;
