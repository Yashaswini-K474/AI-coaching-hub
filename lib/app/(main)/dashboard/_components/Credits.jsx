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
//         const totalTokens = userData?.subscriptionId ? cr : 5000;
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
//                             className='w-full bg-red-600 hover:bg-red-700 transition-colors'
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
