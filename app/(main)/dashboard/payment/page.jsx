// "use client";

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useAction } from 'convex/react';
// import { api } from "../../../convex/_generated/api";
// import { Loader2, CheckCircle, XCircle } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// // NOTE: This page handles the redirect from Stripe after payment
// function PaymentSuccessPage() {
//     // Hooks for navigation and backend interaction
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const verifyPaymentAction = useAction(api.stripe.verifyPayment);

//     // State for UI feedback
//     const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
//     const [message, setMessage] = useState('Verifying your payment and updating your account...');

//     useEffect(() => {
//         const sessionId = searchParams.get('session_id');

//         if (!sessionId) {
//             setStatus('error');
//             setMessage('Error: Missing payment session ID. Please contact support.');
//             // Redirect after a delay
//             setTimeout(() => router.replace('/dashboard'), 5000);
//             return;
//         }

//         const handleVerification = async () => {
//             try {
//                 // Call the Convex Action to securely verify payment
//                 const result = await verifyPaymentAction({ sessionId });

//                 if (result.success) {
//                     setStatus('success');
//                     setMessage("Payment confirmed! Your account has been upgraded to the Pro Plan (1,00,000 Tokens).");
//                 } else {
//                     // This handles cases where Stripe verified the session, but validation failed (e.g., already paid or error in updateSubscription)
//                     setStatus('error');
//                     setMessage(`Verification Issue: ${result.message}. Please check your plan status on the dashboard.`);
//                 }
//             } catch (error) {
//                 // Catches network or Convex action invocation errors
//                 console.error("Payment verification failed at the Action layer:", error);
//                 setStatus('error');
//                 setMessage("An internal error occurred during verification. Please try refreshing the page or contact support.");
//             } finally {
//                 // CRITICAL: Redirect the user back to the main dashboard after a small delay
//                 setTimeout(() => {
//                     // Use router.push to force a hard reload of dashboard data
//                     router.push('/dashboard');
//                 }, 3000);
//             }
//         };

//         handleVerification();
//     }, [searchParams, router, verifyPaymentAction]); // Run once when the component mounts

//     const getIcon = () => {
//         if (status === 'verifying') return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
//         if (status === 'success') return <CheckCircle className="h-12 w-12 text-green-500" />;
//         return <XCircle className="h-12 w-12 text-red-500" />;
//     };

//     const getTitle = () => {
//         if (status === 'verifying') return 'Processing Payment...';
//         if (status === 'success') return 'Payment Successful!';
//         return 'Payment Failed or Error';
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
//             <Card className="w-full max-w-md shadow-2xl rounded-xl">
//                 <CardHeader className="text-center">
//                     <CardTitle className={`text-2xl font-bold ${status === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
//                         {getTitle()}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col items-center justify-center text-center p-6">
//                     <div className="mb-6">
//                         {getIcon()}
//                     </div>
//                     <p className="text-gray-600 mb-4">{message}</p>
//                     {status === 'verifying' && (
//                         <p className="text-sm text-gray-500">You will be redirected automatically in a moment.</p>
//                     )}
//                     {(status === 'success' || status === 'error') && (
//                         <button
//                             onClick={() => router.push('/dashboard')}
//                             className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
//                         >
//                             Go to Dashboard
//                         </button>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

// export default PaymentSuccessPage;

// "use client";

// import { useEffect, useState } from 'react';
// // Imports necessary for a Next.js App Router component
// import { useSearchParams, useRouter } from 'next/navigation';
// // Imports necessary for Convex backend interaction
// import { useAction } from 'convex/react';
// import { api } from "../../../convex/_generated/api";
// import { Loader2, CheckCircle, XCircle } from 'lucide-react';
// // Assuming these are your utility components
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// // NOTE: This page handles the redirect from Stripe after payment
// function PaymentSuccessPage() {
//     // Hooks for navigation and backend interaction
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     // This hook calls the Convex Action that verifies payment and updates user data
//     const verifyPaymentAction = useAction(api.stripe.verifyPayment);

//     // State for UI feedback
//     const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
//     const [message, setMessage] = useState('Verifying your payment and updating your account...');

//     useEffect(() => {
//         const sessionId = searchParams.get('session_id');

//         // Function to handle the final navigation
//         const redirectToDashboard = (delay = 3000) => {
//             console.log("CRITICAL: Redirecting to dashboard in", delay / 1000, "seconds...");
//             setTimeout(() => {
//                 // *** FIX: Using window.location.href to force a hard browser reload ***
//                 window.location.href = '/dashboard';
//             }, delay);
//         };

//         if (!sessionId) {
//             setStatus('error');
//             setMessage('Error: Missing payment session ID. Please contact support.');
//             redirectToDashboard(5000); // Redirect even on error
//             return;
//         }

//         const handleVerification = async () => {
//             try {
//                 // 1. Call the Convex Action to securely verify payment
//                 console.log(`Attempting to verify session: ${sessionId}`);
//                 const result = await verifyPaymentAction({ sessionId });

//                 if (result.success) {
//                     // 2. Success path: User data (credits) updated in Convex
//                     setStatus('success');
//                     setMessage("Payment confirmed! Your account has been upgraded to the Pro Plan (1,00,000 Tokens).");
//                 } else {
//                     // 3. Verification failure (e.g., session already processed)
//                     setStatus('error');
//                     // Check your Convex logs for the actual error message sent back in `result.message`
//                     setMessage(`Verification Issue: ${result.message || 'Payment session validation failed.'} Please check your plan status on the dashboard.`);
//                 }
//             } catch (error) {
//                 // 4. Catches network or action invocation errors
//                 console.error("Payment verification failed at the Action layer:", error);
//                 setStatus('error');
//                 setMessage("An internal error occurred during verification. Please try refreshing the page or contact support.");
//             } finally {
//                 // 5. Always redirect after processing attempt, regardless of outcome
//                 redirectToDashboard(3000);
//             }
//         };

//         handleVerification();
//     }, [searchParams, verifyPaymentAction]); // Dependencies look correct

//     const getIcon = () => {
//         if (status === 'verifying') return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
//         if (status === 'success') return <CheckCircle className="h-12 w-12 text-green-500" />;
//         return <XCircle className="h-12 w-12 text-red-500" />;
//     };

//     const getTitle = () => {
//         if (status === 'verifying') return 'Processing Payment...';
//         if (status === 'success') return 'Payment Successful!';
//         return 'Payment Failed or Error';
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
//             <Card className="w-full max-w-md shadow-2xl rounded-xl">
//                 <CardHeader className="text-center">
//                     <CardTitle className={`text-2xl font-bold ${status === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
//                         {getTitle()}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col items-center justify-center text-center p-6">
//                     <div className="mb-6">
//                         {getIcon()}
//                     </div>
//                     <p className="text-gray-600 mb-4">{message}</p>
//                     {status === 'verifying' && (
//                         <p className="text-sm text-gray-500">You will be redirected automatically in a moment.</p>
//                     )}
//                     {(status === 'success' || status === 'error') && (
//                         <button
//                             // When clicked, force a hard reload
//                             onClick={() => window.location.href = '/dashboard'}
//                             className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
//                         >
//                             Go to Dashboard Now
//                         </button>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

// export default PaymentSuccessPage;

// import React, { useState, useCallback, useMemo } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';

// // --- MOCKING EXTERNAL LIBRARIES AND CONSTANTS ---

// // Constants for Plan Limits
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;
// const STRIPE_CHECKOUT_URL = 'https://checkout.stripe.com/mock-session-redirect-success';

// // 1. Mocking Clerk's useUser hook
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// // 2. Mocking Backend Functions (Now just returning a promise)
// const mockCreateStripeSession = async (priceId) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     console.log(`[MOCK] Simulating Stripe checkout session creation for priceId: ${priceId}`);
//     return { url: STRIPE_CHECKOUT_URL };
// };

// const mockDowngradeSubscription = async () => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     console.log("[MOCK] Plan successfully cancelled on backend. Returning success.");
//     return { success: true };
// };

// // --- Custom Modal Component (Replaces alert/confirm) ---

// const CustomModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, showCancel }) => {
//     if (!isOpen) return null;

//     const isError = title.includes('Failed');
//     const isSuccess = title.includes('Cancelled') || title.includes('Redirecting');
//     const isConfirm = title.includes('sure?');

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
//                     {showCancel && (
//                         <button
//                             onClick={onCancel}
//                             className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                     <button
//                         onClick={onConfirm}
//                         className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isConfirm
//                             ? 'bg-red-600 text-white hover:bg-red-700'
//                             : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                             }`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Component ---

// // Placeholder Data for Plans
// const PLANS = [
//     {
//         name: 'Basic (Free)',
//         price: '0',
//         currency: '$',
//         interval: 'mo',
//         description: 'Perfect for individual use and essential features.',
//         features: [
//             'Access to standard features',
//             `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Email support'
//         ],
//         icon: DollarSign,
//         priceId: 'price_free',
//     },
//     {
//         name: 'Pro',
//         price: '10.00',
//         currency: '$',
//         interval: 'mo',
//         description: 'Unlock everything for power users and small teams.',
//         features: [
//             'All Basic features',
//             `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Priority 24/7 support',
//             'Advanced analytics'
//         ],
//         icon: Zap,
//         priceId: 'price_pro',
//         isPopular: true,
//     },
// ];


// const SubscriptionPage = () => {
//     const { isSignedIn, isLoaded } = useUser();

//     // --- State representing user's current subscription status and usage (Mocked from Convex) ---
//     // Using a single state object to ensure all related values update together on render.
//     const [userData, setUserData] = useState({
//         plan: 'Pro', // Initial state set to 'Pro' to simulate an active subscription
//         tokensUsed: 85000, // MODIFIED: Set to a higher value for clearer visual change on cancel.
//     });
//     // -----------------------------------------------------------------------------------------

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({
//         isOpen: false,
//         type: null,
//         planName: ''
//     });

//     // Computed values derived from userData
//     const currentPlan = userData.plan;
//     const tokenUsed = userData.tokensUsed;
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//     const tokenPercentage = (tokenUsed / tokenLimit) * 100;


//     // --- Subscription Handlers ---

//     // 1. Handle initiation of Stripe Checkout (Upgrade)
//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);
//         try {
//             const session = await mockCreateStripeSession(planPriceId);

//             // In a real application, you would redirect to Stripe here:
//             // window.location.href = session.url; 

//             // For the mock, we simulate the redirect and update the state to Pro
//             setUserData({
//                 plan: 'Pro',
//                 tokensUsed: 0, // Reset tokens on new subscription for mock visibility
//             });

//             setModal({
//                 isOpen: true,
//                 type: 'success',
//                 title: 'Upgrade Initiated! Redirecting...',
//                 message: `Simulating redirection to Stripe at: ${session.url}. The local state has been updated to 'Pro' for demonstration.`,
//                 planName: 'Pro'
//             });

//         } catch (e) {
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: 'An error occurred during checkout. Please try again.',
//                 planName: 'Pro'
//             });
//         } finally {
//             setLoadingPriceId(null);
//         }
//     }, []);


//     // 2. Handle Plan Cancellation
//     const handleConfirmCancel = useCallback(async () => {
//         setModal(prev => ({ ...prev, isOpen: false })); // Close confirmation modal
//         setLoadingPriceId('price_pro');

//         try {
//             await mockDowngradeSubscription();

//             // CRITICAL FIX: Update the centralized state object to 'Free' plan.
//             setUserData({
//                 plan: 'Free',
//                 tokensUsed: 0, // Tokens reset to 0 upon cancellation
//             });
//             console.log("SUCCESS: Plan state updated directly to 'Free'. Tokens reset to 0.");

//             setModal({
//                 isOpen: true,
//                 type: 'success',
//                 title: 'Plan Cancelled Successfully!',
//                 message: `Your Pro Plan has been successfully cancelled. You are now on the Basic (Free) plan, with a ${FREE_PLAN_LIMIT.toLocaleString()} token limit.`,
//                 planName: 'Pro'
//             });

//         } catch (e) {
//             console.error('Cancellation error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Cancellation Failed',
//                 message: 'Could not cancel the plan due to a server error. Please try again.',
//                 planName: 'Pro'
//             });
//         } finally {
//             setLoadingPriceId(null);
//         }
//     }, []);


//     // --- UI Rendering Functions ---

//     const openCancelConfirmation = () => {
//         setModal({
//             isOpen: true,
//             type: 'confirmCancel',
//             title: 'Are you absolutely sure?',
//             message: `Cancelling your Pro Plan will revert your monthly token limit to ${FREE_PLAN_LIMIT.toLocaleString()} and reset your current token usage immediately.`,
//             planName: 'Pro'
//         });
//     };

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };


//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
//         const isLoading = loadingPriceId === plan.priceId;

//         // Logic for the Pro Card
//         if (isPro) {
//             // If the current plan is 'Pro', show the CANCEL button
//             if (currentPlan === 'Pro') {
//                 return (
//                     <button
//                         onClick={openCancelConfirmation}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Cancelling...
//                             </>
//                         ) : (
//                             'Cancel Pro Plan'
//                         )}
//                     </button>
//                 );
//             } else {
//                 // If the current plan is NOT 'Pro' (i.e., 'Free'), show the UPGRADE button
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 Upgrade for ${plan.price}
//                                 <ChevronRight className="h-5 w-5 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 );
//             }
//         }

//         // Logic for the Basic/Free Card
//         if (plan.priceId === 'price_free') {
//             if (currentPlan === 'Free') {
//                 return (
//                     <div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">
//                         Current Plan
//                     </div>
//                 );
//             } else {
//                 return (
//                     <div className="text-center py-3 text-lg font-semibold text-gray-500 bg-gray-100 rounded-xl">
//                         Available to Downgrade
//                     </div>
//                 );
//             }
//         }
//     };


//     if (!isLoaded) {
//         return (
//             <div className="flex items-center justify-center p-8 min-h-screen">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     if (!isSignedIn) {
//         return (
//             <div className="p-8 text-center text-gray-600">
//                 You must be signed in to view subscription plans.
//             </div>
//         );
//     }

//     // Determine the tokens to display: if on the Free plan, force display of 0 tokens used
//     const displayedTokensUsed = currentPlan === 'Free' ? 0 : tokenUsed;
//     // Re-calculate percentage based on displayed tokens for the progress bar
//     const displayedTokenPercentage = (displayedTokensUsed / tokenLimit) * 100;


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <script src="https://cdn.tailwindcss.com"></script>
//             <style jsx global>{`
//                 /* Font for consistency */
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
//                 body { font-family: 'Inter', sans-serif; }
//                 .card-shadow {
//                     box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03);
//                 }
//             `}</style>

//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">
//                 Subscription Management
//             </h1>
//             <p className="text-xl text-gray-500 mb-8 max-w-2xl text-center">
//                 Manage your plan and track your usage.
//             </p>

//             {/* Token Usage Card */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow w-full max-w-4xl mb-12">
//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <Crown className={`h-6 w-6 mr-2 ${currentPlan === 'Pro' ? 'text-yellow-500' : 'text-green-600'}`} />
//                         Current Plan: <span className="ml-2">{currentPlan === 'Pro' ? 'Pro Plan' : 'Basic (Free)'}</span>
//                     </h2>
//                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentPlan === 'Pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
//                         {currentPlan === 'Pro' ? 'Active' : 'Free Tier'}
//                     </span>
//                 </div>

//                 <p className="text-lg text-gray-600 mb-4">
//                     Token Usage: <span className="font-mono font-semibold text-gray-900">{displayedTokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
//                 </p>

//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                         className={`h-2.5 rounded-full transition-all duration-500 ${displayedTokenPercentage > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         style={{ width: `${Math.min(displayedTokenPercentage, 100)}%` }}
//                     ></div>
//                 </div>
//                 {tokenPercentage > 80 && currentPlan === 'Pro' && (
//                     <p className="text-sm text-red-500 mt-2">
//                         You are nearing your token limit! Consider upgrading or managing your usage.
//                     </p>
//                 )}
//             </div>

//             {/* Pricing Cards */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => {
//                     const isPro = plan.priceId === 'price_pro';

//                     return (
//                         <div
//                             key={plan.name}
//                             className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 card-shadow ${isPro
//                                 ? currentPlan === 'Pro'
//                                     ? 'border-indigo-600 ring-4 ring-indigo-100 transform scale-[1.02]'
//                                     : 'border-gray-300 hover:border-indigo-400'
//                                 : currentPlan === 'Free'
//                                     ? 'border-green-600 ring-4 ring-green-100'
//                                     : 'border-gray-200'
//                                 }`}
//                         >
//                             {isPro && (
//                                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
//                                     {currentPlan === 'Pro' ? 'YOUR PLAN' : 'BEST VALUE'}
//                                 </span>
//                             )}

//                             <div className="flex items-center mb-4">
//                                 <plan.icon className="h-8 w-8 text-indigo-600 mr-3" />
//                                 <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
//                             </div>

//                             <p className="text-gray-500 mb-6 min-h-[40px]">{plan.description}</p>

//                             <div className="mb-8">
//                                 <span className="text-5xl font-extrabold text-gray-900">
//                                     {plan.currency}{plan.price.split('.')[0]}
//                                 </span>
//                                 {plan.price !== '0' && (
//                                     <span className="text-xl font-medium text-gray-500">
//                                         .{plan.price.split('.')[1]}/{plan.interval}
//                                     </span>
//                                 )}
//                             </div>

//                             <ul className="space-y-3 mb-10">
//                                 {plan.features.map((feature, index) => (
//                                     <li key={index} className="flex items-start text-gray-700">
//                                         <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
//                                         <span className="text-base">{feature}</span>
//                                     </li>
//                                 ))}
//                             </ul>

//                             {renderPlanButton(plan)}
//                         </div>
//                     );
//                 })}
//             </div>

//             <p className="mt-12 text-sm text-gray-400 text-center max-w-md">
//                 Note: This entire page is simulated. The **Pro Plan** is active by default. Cancelling it or Upgrading it modifies the mock state.
//             </p>

//             {/* Confirmation Modal */}
//             {modal.type === 'confirmCancel' && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={handleConfirmCancel}
//                     onCancel={closeModal}
//                     confirmText="Yes, Cancel Plan"
//                     showCancel={true}
//                 />
//             )}

//             {/* Success/Error/Redirect Modal */}
//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     onCancel={() => { }}
//                     confirmText="Close"
//                     showCancel={false}
//                 />
//             )}
//         </div>
//     );
// };

// // Export the main component
// export default SubscriptionPage;

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// // CORRECTED IMPORT PATHS
// import { useAction } from 'convex/react';
// import { api } from '../convex/_generated/api'; // Assuming 'convex' is at the root of the app

// // --- MOCKING EXTERNAL LIBRARIES AND CONSTANTS ---

// // Constants for Plan Limits
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // 1. Mocking Clerk's useUser hook (Kept as is for local testing)
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// // --- Custom Modal Component (Replaces alert/confirm) ---

// const CustomModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, showCancel }) => {
//     if (!isOpen) return null;

//     const isError = title.includes('Failed');
//     const isSuccess = title.includes('Cancelled') || title.includes('Redirecting') || title.includes('Successfully');
//     const isConfirm = title.includes('sure?');

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
//                     {showCancel && (
//                         <button
//                             onClick={onCancel}
//                             className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                     <button
//                         onClick={onConfirm}
//                         className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isConfirm
//                             ? 'bg-red-600 text-white hover:bg-red-700'
//                             : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                             }`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Main Component ---

// // Placeholder Data for Plans
// const PLANS = [
//     {
//         name: 'Basic (Free)',
//         price: '0',
//         currency: '$',
//         interval: 'mo',
//         description: 'Perfect for individual use and essential features.',
//         features: [
//             'Access to standard features',
//             `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Email support'
//         ],
//         icon: DollarSign,
//         priceId: 'price_free',
//     },
//     {
//         name: 'Pro',
//         price: '10.00',
//         currency: '$',
//         interval: 'mo',
//         description: 'Unlock everything for power users and small teams.',
//         features: [
//             'All Basic features',
//             `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Priority 24/7 support',
//             'Advanced analytics'
//         ],
//         icon: Zap,
//         // CRITICAL: This priceId must match the one used in the Convex Action
//         priceId: 'price_pro',
//         isPopular: true,
//     },
// ];


// export default function App() {
//     // --- HOOKS FOR REAL FUNCTIONALITY ---
//     // Use the action to create a Stripe checkout session
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     // Use the action to cancel the subscription
//     const cancelPlanAction = useAction(api.stripe.cancelPlan);
//     // ------------------------------------

//     const { isSignedIn, isLoaded } = useUser();

//     // --- State representing user's current subscription status and usage (Mocked) ---
//     const [userData, setUserData] = useState({
//         plan: 'Free', // Set to 'Free' to allow testing the Upgrade button immediately
//         tokensUsed: 10000,
//     });
//     // -----------------------------------------------------------------------------------------

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({
//         isOpen: false,
//         type: null,
//         planName: ''
//     });

//     // Computed values derived from userData
//     const currentPlan = userData.plan;
//     const tokenUsed = userData.tokensUsed;
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//     const tokenPercentage = (tokenUsed / tokenLimit) * 100;


//     // --- Subscription Handlers ---

//     // 1. Handle initiation of Stripe Checkout (Upgrade)
//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         // ONLY proceed if the plan is NOT free (i.e., we have a real Stripe price ID)
//         if (planPriceId === 'price_free') {
//             setLoadingPriceId(null);
//             return;
//         }

//         try {
//             // CALL THE REAL CONVEX ACTION to get the Stripe URL
//             // This assumes the 'stripe' module is correctly defined in convex/stripe.ts
//             const sessionUrl = await createStripeSession({
//                 priceId: planPriceId
//             });

//             if (sessionUrl) {
//                 // CRITICAL: Perform the redirection to Stripe
//                 console.log(`Redirecting to Stripe Checkout at: ${sessionUrl}`);
//                 // Redirect the user's browser to the Stripe session URL
//                 window.location.href = sessionUrl;
//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }

//             // Show a temporary success modal before the redirect happens
//             setModal({
//                 isOpen: true,
//                 type: 'success',
//                 title: 'Redirecting to Payment...',
//                 message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                 planName: 'Pro'
//             });

//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred: ${e.message}. Please check console for details.`,
//                 planName: 'Pro'
//             });
//         } finally {
//             // Keep loading state until redirect occurs or error is shown
//         }
//     }, [createStripeSession]);


//     // 2. Handle Plan Cancellation
//     const handleConfirmCancel = useCallback(async () => {
//         setModal(prev => ({ ...prev, isOpen: false })); // Close confirmation modal
//         setLoadingPriceId('price_pro'); // Use price_pro as a general loading key for the Pro card

//         try {
//             // CALL THE REAL CONVEX ACTION to cancel the plan
//             const result = await cancelPlanAction({}); // Action infers Clerk ID

//             if (result.success) {
//                 // MOCK Frontend State Update for quick visibility, should be synced from Convex
//                 setUserData({
//                     plan: 'Free',
//                     tokensUsed: 0,
//                 });

//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Plan Cancelled Successfully!',
//                     message: `Your Pro Plan has been successfully cancelled. You are now on the Basic (Free) plan.`,
//                     planName: 'Pro'
//                 });
//             } else {
//                 setModal({
//                     isOpen: true,
//                     type: 'error',
//                     title: 'Cancellation Failed',
//                     message: result.message || 'Could not cancel the plan due to a server error. Please try again.',
//                     planName: 'Pro'
//                 });
//             }

//         } catch (e) {
//             console.error('Cancellation error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Cancellation Failed',
//                 message: 'An internal error occurred during cancellation. Please try again.',
//                 planName: 'Pro'
//             });
//         } finally {
//             setLoadingPriceId(null);
//         }
//     }, [cancelPlanAction]);


//     // --- UI Rendering Functions ---

//     const openCancelConfirmation = () => {
//         setModal({
//             isOpen: true,
//             type: 'confirmCancel',
//             title: 'Are you absolutely sure?',
//             message: `Cancelling your Pro Plan will revert your monthly token limit to ${FREE_PLAN_LIMIT.toLocaleString()} and reset your current token usage immediately.`,
//             planName: 'Pro'
//         });
//     };

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };


//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
//         const isLoading = loadingPriceId === plan.priceId;

//         // Logic for the Pro Card
//         if (isPro) {
//             // If the current plan is 'Pro', show the CANCEL button
//             if (currentPlan === 'Pro') {
//                 return (
//                     <button
//                         onClick={openCancelConfirmation}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Cancelling...
//                             </>
//                         ) : (
//                             'Cancel Pro Plan'
//                         )}
//                     </button>
//                 );
//             } else {
//                 // If the current plan is NOT 'Pro' (i.e., 'Free'), show the UPGRADE button
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Redirecting...
//                             </>
//                         ) : (
//                             <>
//                                 Upgrade for ${plan.price}
//                                 <ChevronRight className="h-5 w-5 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 );
//             }
//         }

//         // Logic for the Basic/Free Card
//         if (plan.priceId === 'price_free') {
//             if (currentPlan === 'Free') {
//                 return (
//                     <div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">
//                         Current Plan
//                     </div>
//                 );
//             } else {
//                 return (
//                     <div className="text-center py-3 text-lg font-semibold text-gray-500 bg-gray-100 rounded-xl">
//                         Available to Downgrade
//                     </div>
//                 );
//             }
//         }
//     };


//     if (!isLoaded) {
//         return (
//             <div className="flex items-center justify-center p-8 min-h-screen">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     if (!isSignedIn) {
//         return (
//             <div className="p-8 text-center text-gray-600">
//                 You must be signed in to view subscription plans.
//             </div>
//         );
//     }

//     // Determine the tokens to display: if on the Free plan, force display of 0 tokens used
//     const displayedTokensUsed = currentPlan === 'Free' ? tokenUsed : tokenUsed;
//     // Re-calculate percentage based on displayed tokens for the progress bar
//     const displayedTokenPercentage = (displayedTokensUsed / tokenLimit) * 100;


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             {/* Load Tailwind CSS */}
//             <script src="https://cdn.tailwindcss.com"></script>
//             <style jsx global>{`
//                 /* Font for consistency */
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
//                 body { font-family: 'Inter', sans-serif; }
//                 .card-shadow {
//                     box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03);
//                 }
//             `}</style>

//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">
//                 Subscription Management
//             </h1>
//             <p className="text-xl text-gray-500 mb-8 max-w-2xl text-center">
//                 Manage your plan and track your usage.
//             </p>

//             {/* Token Usage Card */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow w-full max-w-4xl mb-12">
//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <Crown className={`h-6 w-6 mr-2 ${currentPlan === 'Pro' ? 'text-yellow-500' : 'text-green-600'}`} />
//                         Current Plan: <span className="ml-2">{currentPlan === 'Pro' ? 'Pro Plan' : 'Basic (Free)'}</span>
//                     </h2>
//                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentPlan === 'Pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
//                         {currentPlan === 'Pro' ? 'Active' : 'Free Tier'}
//                     </span>
//                 </div>

//                 <p className="text-lg text-gray-600 mb-4">
//                     Token Usage: <span className="font-mono font-semibold text-gray-900">{displayedTokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
//                 </p>

//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                         className={`h-2.5 rounded-full transition-all duration-500 ${displayedTokenPercentage > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         style={{ width: `${Math.min(displayedTokenPercentage, 100)}%` }}
//                     ></div>
//                 </div>
//                 {(tokenPercentage > 80 && currentPlan === 'Pro') && (
//                     <p className="text-sm text-red-500 mt-2">
//                         <AlertTriangle className="h-4 w-4 inline mr-1" />
//                         You are nearing your token limit! Consider managing your usage or contacting support.
//                     </p>
//                 )}
//                 {currentPlan === 'Free' && (tokenUsed > FREE_PLAN_LIMIT) && (
//                     <p className="text-sm text-red-500 mt-2">
//                         <AlertTriangle className="h-4 w-4 inline mr-1" />
//                         You have exceeded your Free plan limit and service may be restricted. Please upgrade to Pro.
//                     </p>
//                 )}
//             </div>

//             {/* Pricing Cards */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => {
//                     const isPro = plan.priceId === 'price_pro';

//                     return (
//                         <div
//                             key={plan.name}
//                             className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 card-shadow ${isPro
//                                 ? currentPlan === 'Pro'
//                                     ? 'border-indigo-600 ring-4 ring-indigo-100 transform scale-[1.02]'
//                                     : 'border-gray-300 hover:border-indigo-400'
//                                 : currentPlan === 'Free'
//                                     ? 'border-green-600 ring-4 ring-green-100'
//                                     : 'border-gray-200 hover:border-green-400'
//                                 }`}
//                         >
//                             {isPro && (
//                                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
//                                     {currentPlan === 'Pro' ? 'YOUR PLAN' : 'BEST VALUE'}
//                                 </span>
//                             )}

//                             <div className="flex items-center mb-4">
//                                 <plan.icon className="h-8 w-8 text-indigo-600 mr-3" />
//                                 <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
//                             </div>

//                             <p className="text-gray-500 mb-6 min-h-[40px]">{plan.description}</p>

//                             <div className="mb-8">
//                                 <span className="text-5xl font-extrabold text-gray-900">
//                                     {plan.currency}{plan.price.split('.')[0]}
//                                 </span>
//                                 {plan.price !== '0' && (
//                                     <span className="text-xl font-medium text-gray-500">
//                                         .{plan.price.split('.')[1]}/{plan.interval}
//                                     </span>
//                                 )}
//                                 {plan.price === '0' && (
//                                     <span className="text-xl font-medium text-gray-500">
//                                         /mo
//                                     </span>
//                                 )}
//                             </div>

//                             <ul className="space-y-3 mb-10">
//                                 {plan.features.map((feature, index) => (
//                                     <li key={index} className="flex items-start text-gray-700">
//                                         <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
//                                         <span className="text-base">{feature}</span>
//                                     </li>
//                                 ))}
//                             </ul>

//                             {renderPlanButton(plan)}
//                         </div>
//                     );
//                 })}
//             </div>

//             <p className="mt-12 text-sm text-gray-400 text-center max-w-md">
//                 Note: This page simulates Stripe integration. The local **Plan** is set to **Basic (Free)** by default for demonstration. Upgrading will redirect you to a mock Stripe session.
//             </p>

//             {/* Confirmation Modal */}
//             {modal.type === 'confirmCancel' && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={handleConfirmCancel}
//                     onCancel={closeModal}
//                     confirmText="Yes, Cancel Plan"
//                     showCancel={true}
//                 />
//             )}

//             {/* Success/Error/Redirect Modal */}
//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     onCancel={() => { }}
//                     confirmText="Close"
//                     showCancel={false}
//                 />
//             )}
//         </div>
//     );
// };

// payment page.js (Confirmed correct for client-side functionality)
// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Assuming 'convex' is at the root of the app

// // --- MOCKING EXTERNAL LIBRARIES AND CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (Ensure you are using the real Clerk in production)
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// // Custom Modal Component (Simplified for non-cancellation use)
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

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Perfect for individual use and essential features.', features: ['Access to standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users and small teams.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support', 'Advanced analytics'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];


// export default function App() {
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser();

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button immediately
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 10000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;
//     const tokenUsed = userData.tokensUsed;
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//     const tokenPercentage = (tokenUsed / tokenLimit) * 100;


//     // 1. Handle initiation of Stripe Checkout (Upgrade)
//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         if (planPriceId === 'price_free') {
//             setLoadingPriceId(null);
//             return;
//         }

//         try {
//             // CRITICAL STEP: Call the Convex Action to get the Stripe URL
//             const sessionUrl = await createStripeSession({
//                 priceId: planPriceId
//             });

//             if (sessionUrl) {
//                 // Show a temporary success modal before the redirect happens
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 // CRITICAL: Perform the redirection to Stripe
//                 setTimeout(() => {
//                     window.location.href = sessionUrl;
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred: ${e.message}. Please check console for details.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null); // Stop loading if error occurred before redirect
//         } finally {
//             // Loading state will be cleared by redirect or error
//         }
//     }, [createStripeSession]);


//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };


//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
//         const isLoading = loadingPriceId === plan.priceId;

//         if (isPro) {
//             if (currentPlan === 'Pro') {
//                 return (
//                     <div className="text-center py-3 rounded-xl font-semibold text-lg text-indigo-600 bg-indigo-100">
//                         Current Plan
//                     </div>
//                 );
//             } else {
//                 // Show UPGRADE button
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)} // <-- Correctly calls the handler with priceId
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Redirecting...
//                             </>
//                         ) : (
//                             <>
//                                 Upgrade for ${plan.price}
//                                 <ChevronRight className="h-5 w-5 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 );
//             }
//         }

//         if (plan.priceId === 'price_free') {
//             return (
//                 <div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">
//                     Current Plan
//                 </div>
//             );
//         }
//     };


//     if (!isLoaded || !isSignedIn) {
//         return (
//             <div className="flex items-center justify-center p-8 min-h-screen">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     const displayedTokensUsed = tokenUsed;
//     const displayedTokenPercentage = (displayedTokensUsed / tokenLimit) * 100;


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <script src="https://cdn.tailwindcss.com"></script>
//             <style jsx global>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
//                 body { font-family: 'Inter', sans-serif; }
//                 .card-shadow { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03); }
//             `}</style>

//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-500 mb-8 max-w-2xl text-center">Manage your plan and track your usage.</p>

//             {/* Token Usage Card */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow w-full max-w-4xl mb-12">
//                 {/* ... Token Usage Display ... */}
//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <Crown className={`h-6 w-6 mr-2 ${currentPlan === 'Pro' ? 'text-yellow-500' : 'text-green-600'}`} />
//                         Current Plan: <span className="ml-2">{currentPlan === 'Pro' ? 'Pro Plan' : 'Basic (Free)'}</span>
//                     </h2>
//                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentPlan === 'Pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
//                         {currentPlan === 'Pro' ? 'Active' : 'Free Tier'}
//                     </span>
//                 </div>
//                 <p className="text-lg text-gray-600 mb-4">
//                     Token Usage: <span className="font-mono font-semibold text-gray-900">{displayedTokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
//                 </p>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                         className={`h-2.5 rounded-full transition-all duration-500 ${displayedTokenPercentage > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         style={{ width: `${Math.min(displayedTokenPercentage, 100)}%` }}
//                     ></div>
//                 </div>
//                 {currentPlan === 'Free' && (tokenUsed >= FREE_PLAN_LIMIT) && (
//                     <p className="text-sm text-red-500 mt-2">
//                         <AlertTriangle className="h-4 w-4 inline mr-1" />
//                         You have reached your Free plan limit. Please **Upgrade to Pro** to continue using the service.
//                     </p>
//                 )}
//             </div>

//             {/* Pricing Cards */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => {
//                     const isPro = plan.priceId === 'price_pro';
//                     return (
//                         <div
//                             key={plan.name}
//                             className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 card-shadow ${isPro
//                                 ? currentPlan === 'Pro'
//                                     ? 'border-indigo-600 ring-4 ring-indigo-100 transform scale-[1.02]'
//                                     : 'border-gray-300 hover:border-indigo-400'
//                                 : currentPlan === 'Free'
//                                     ? 'border-green-600 ring-4 ring-green-100'
//                                     : 'border-gray-200 hover:border-green-400'
//                                 }`}
//                         >
//                             {isPro && (
//                                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
//                                     {currentPlan === 'Pro' ? 'YOUR PLAN' : 'BEST VALUE'}
//                                 </span>
//                             )}
//                             {/* ... Plan Details ... */}
//                             <div className="flex items-center mb-4"><plan.icon className="h-8 w-8 text-indigo-600 mr-3" /><h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2></div>
//                             <p className="text-gray-500 mb-6 min-h-[40px]">{plan.description}</p>
//                             <div className="mb-8">
//                                 <span className="text-5xl font-extrabold text-gray-900">{plan.currency}{plan.price.split('.')[0]}</span>
//                                 {plan.price !== '0' && (<span className="text-xl font-medium text-gray-500">.{plan.price.split('.')[1]}/{plan.interval}</span>)}
//                                 {plan.price === '0' && (<span className="text-xl font-medium text-gray-500">/mo</span>)}
//                             </div>
//                             <ul className="space-y-3 mb-10">
//                                 {plan.features.map((feature, index) => (<li key={index} className="flex items-start text-gray-700"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" /><span className="text-base">{feature}</span></li>))}
//                             </ul>
//                             {renderPlanButton(plan)}
//                         </div>
//                     );
//                 })}
//             </div>

//             <p className="mt-12 text-sm text-gray-400 text-center max-w-md">
//                 Note: This page simulates Stripe integration. Upgrading will redirect you to a mock Stripe session via the Convex Action.
//             </p>

//             {/* Success/Error/Redirect Modal */}
//             {(modal.type === 'success' || modal.type === 'error') && (
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
// };

// payment page.js

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Corrected import path

// // --- MOCKING EXTERNAL LIBRARIES AND CONSTANTS ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // 1. Mocking Clerk's useUser hook (Replace with real Clerk hook in production)
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// // --- Custom Modal Component (Simplified) ---

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

// // Placeholder Data for Plans
// const PLANS = [
//     {
//         name: 'Basic (Free)',
//         price: '0',
//         currency: '$',
//         interval: 'mo',
//         description: 'Perfect for individual use and essential features.',
//         features: [
//             'Access to standard features',
//             `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Email support'
//         ],
//         icon: DollarSign,
//         priceId: 'price_free',
//     },
//     {
//         name: 'Pro',
//         price: '10.00',
//         currency: '$',
//         interval: 'mo',
//         description: 'Unlock everything for power users and small teams.',
//         features: [
//             'All Basic features',
//             `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`,
//             'Priority 24/7 support',
//             'Advanced analytics'
//         ],
//         icon: Zap,
//         priceId: 'price_pro',
//         isPopular: true,
//     },
// ];


// export default function App() {
//     // --- HOOKS FOR REAL FUNCTIONALITY ---
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser();

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 10000, // Example usage
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({
//         isOpen: false,
//         type: null,
//         planName: ''
//     });

//     // Computed values derived from userData
//     const currentPlan = userData.plan;
//     const tokenUsed = userData.tokensUsed;
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT : FREE_PLAN_LIMIT;
//     const tokenPercentage = (tokenUsed / tokenLimit) * 100;


//     // --- Subscription Handlers ---

//     // 1. Handle initiation of Stripe Checkout (Upgrade)
//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         if (planPriceId === 'price_free') {
//             setLoadingPriceId(null);
//             return;
//         }

//         try {
//             const sessionUrl = await createStripeSession({
//                 priceId: planPriceId
//             });

//             if (sessionUrl) {
//                 // Show a temporary success modal before the redirect happens
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 // CRITICAL: Perform the redirection to Stripe
//                 setTimeout(() => {
//                     window.location.href = sessionUrl;
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred: ${e.message}. Please check console for details.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         } finally {
//             // Loading state remains until redirect or error
//         }
//     }, [createStripeSession]);


//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };


//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
//         const isLoading = loadingPriceId === plan.priceId;

//         // Logic for the Pro Card
//         if (isPro) {
//             if (currentPlan === 'Pro') {
//                 return (
//                     <div className="text-center py-3 rounded-xl font-semibold text-lg text-indigo-600 bg-indigo-100">
//                         Current Plan
//                     </div>
//                 );
//             } else {
//                 // Show UPGRADE button for Free users
//                 return (
//                     <button
//                         onClick={() => handleUpgrade(plan.priceId)}
//                         disabled={isLoading}
//                         className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 flex items-center justify-center"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                                 Redirecting...
//                             </>
//                         ) : (
//                             <>
//                                 Upgrade for ${plan.price}
//                                 <ChevronRight className="h-5 w-5 ml-1" />
//                             </>
//                         )}
//                     </button>
//                 );
//             }
//         }

//         // Logic for the Basic/Free Card
//         if (plan.priceId === 'price_free') {
//             return (
//                 <div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">
//                     Current Plan
//                 </div>
//             );
//         }
//     };


//     if (!isLoaded || !isSignedIn) {
//         return (
//             <div className="flex items-center justify-center p-8 min-h-screen">
//                 <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//             </div>
//         );
//     }

//     const displayedTokensUsed = tokenUsed;
//     const displayedTokenPercentage = (displayedTokensUsed / tokenLimit) * 100;


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <script src="https://cdn.tailwindcss.com"></script>
//             <style jsx global>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
//                 body { font-family: 'Inter', sans-serif; }
//                 .card-shadow { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03); }
//             `}</style>

//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-500 mb-8 max-w-2xl text-center">Manage your plan and track your usage.</p>

//             {/* Token Usage Card */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow w-full max-w-4xl mb-12">
//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                         <Crown className={`h-6 w-6 mr-2 ${currentPlan === 'Pro' ? 'text-yellow-500' : 'text-green-600'}`} />
//                         Current Plan: <span className="ml-2">{currentPlan === 'Pro' ? 'Pro Plan' : 'Basic (Free)'}</span>
//                     </h2>
//                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentPlan === 'Pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
//                         {currentPlan === 'Pro' ? 'Active' : 'Free Tier'}
//                     </span>
//                 </div>
//                 <p className="text-lg text-gray-600 mb-4">
//                     Token Usage: <span className="font-mono font-semibold text-gray-900">{displayedTokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
//                 </p>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div
//                         className={`h-2.5 rounded-full transition-all duration-500 ${displayedTokenPercentage > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
//                         style={{ width: `${Math.min(displayedTokenPercentage, 100)}%` }}
//                     ></div>
//                 </div>
//                 {currentPlan === 'Free' && (tokenUsed >= FREE_PLAN_LIMIT) && (
//                     <p className="text-sm text-red-500 mt-2">
//                         <AlertTriangle className="h-4 w-4 inline mr-1" />
//                         You have reached your Free plan limit. Please **Upgrade to Pro** to continue using the service.
//                     </p>
//                 )}
//             </div>

//             {/* Pricing Cards */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => {
//                     const isPro = plan.priceId === 'price_pro';
//                     return (
//                         <div
//                             key={plan.name}
//                             className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 card-shadow ${isPro
//                                 ? currentPlan === 'Pro'
//                                     ? 'border-indigo-600 ring-4 ring-indigo-100 transform scale-[1.02]'
//                                     : 'border-gray-300 hover:border-indigo-400'
//                                 : currentPlan === 'Free'
//                                     ? 'border-green-600 ring-4 ring-green-100'
//                                     : 'border-gray-200 hover:border-green-400'
//                                 }`}
//                         >
//                             {isPro && (
//                                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
//                                     {currentPlan === 'Pro' ? 'YOUR PLAN' : 'BEST VALUE'}
//                                 </span>
//                             )}
//                             <div className="flex items-center mb-4"><plan.icon className="h-8 w-8 text-indigo-600 mr-3" /><h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2></div>
//                             <p className="text-gray-500 mb-6 min-h-[40px]">{plan.description}</p>
//                             <div className="mb-8">
//                                 <span className="text-5xl font-extrabold text-gray-900">{plan.currency}{plan.price.split('.')[0]}</span>
//                                 {plan.price !== '0' && (<span className="text-xl font-medium text-gray-500">.{plan.price.split('.')[1]}/{plan.interval}</span>)}
//                                 {plan.price === '0' && (<span className="text-xl font-medium text-gray-500">/mo</span>)}
//                             </div>
//                             <ul className="space-y-3 mb-10">
//                                 {plan.features.map((feature, index) => (<li key={index} className="flex items-start text-gray-700"><Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" /><span className="text-base">{feature}</span></li>))}
//                             </ul>
//                             {renderPlanButton(plan)}
//                         </div>
//                     );
//                 })}
//             </div>

//             <p className="mt-12 text-sm text-gray-400 text-center max-w-md">
//                 Note: This page simulates Stripe integration. **The error has been fixed in the Convex backend code**. Upgrading should now redirect you to Stripe.
//             </p>

//             {/* Success/Error/Redirect Modal */}
//             {(modal.type === 'success' || modal.type === 'error') && (
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
// };

// payment page.js (Ensure this file is marked "use client")

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Ensure this path is correct

// // --- CONSTANTS AND MOCKING ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (REPLACE WITH REAL CLERK HOOK)
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// // ... (CustomModal component remains the same) ...


// export default function App() {
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser();

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     // In production, this would come from a Convex 'getUser' query
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000, // Matching the image's usage
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
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
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirection to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Server error: ${e.message}.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }
//     };

//     // ... (rest of the component JSX, using the correct token logic) ...

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             {/* ... Token Usage Card JSX ... */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className="relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 card-shadow">
//                         {/* ... Plan Details ... */}
//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>
//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal isOpen={modal.isOpen} title={modal.title} message={modal.message} onConfirm={closeModal} confirmText="Close" />
//             )}
//         </div>
//     );
// };

// payment page.js (Ensure this file is marked "use client")

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Ensure this path is correct

// // --- CONSTANTS AND MOCKING ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (REPLACE WITH REAL CLERK HOOK)
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// // CustomModal component (Assuming it remains the same)
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
//     if (!isOpen) return null;

//     const IconComponent = type === 'error' ? XCircle : Check;
//     const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
//                 <div className="flex flex-col items-center">
//                     <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
//                         <IconComponent className="h-6 w-6" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
//                     <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//                     <button
//                         onClick={onConfirm}
//                         className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser();

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             const returnUrl = window.location.origin + "/dashboard/payment"; // Use payment page as return URL

//             // CRITICAL FIX: The Convex action expects 'priceKey' and 'returnUrl'
//             const sessionUrl = await createStripeSession({
//                 priceKey: planPriceId, // planPriceId here is 'price_pro'
//                 returnUrl: returnUrl,
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirection to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Server error: ${e.message}.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }

//         // Render a placeholder button for other plans that aren't the current one
//         return (
//             <button
//                 disabled={true}
//                 className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//                 Contact Sales
//             </button>
//         );
//     };

//     // Assuming the rest of the component JSX is about rendering the plan cards
//     // NOTE: This component does not display token usage, focusing only on plans.

//     // Fallback for userData, in a real app, this should be queried from Convex
//     const tokensUsed = userData.tokensUsed.toLocaleString();
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

//             {/* Current Token Usage Summary Card (Added for completeness) */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
//                     <p className="text-lg text-gray-600 mt-1">
//                         **{tokensUsed} / {tokenLimit}** tokens used this month.
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
//                     <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
//                         {plan.isPopular && (
//                             <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
//                                 Most Popular
//                             </div>
//                         )}

//                         {/* Plan Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
//                             <p className="text-gray-500 mb-6">{plan.description}</p>
//                             <div className="text-5xl font-extrabold text-gray-900">
//                                 {plan.currency}{plan.price}
//                                 <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
//                             </div>
//                         </div>

//                         <ul className="space-y-4 mb-10">
//                             {plan.features.map((feature, index) => (
//                                 <li key={index} className="flex items-start text-gray-700">
//                                     <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                     type={modal.type}
//                 />
//             )}
//         </div>
//     );
// };

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Ensure this path is correct

// // --- CONSTANTS AND MOCKING ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (REPLACE WITH REAL CLERK HOOK)
// const useUser = () => ({
//     isLoaded: true, // Assuming data is loaded for the mock
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// // CustomModal component (Assuming it remains the same)
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
//     if (!isOpen) return null;

//     const IconComponent = type === 'error' ? XCircle : Check;
//     const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
//                 <div className="flex flex-col items-center">
//                     <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
//                         <IconComponent className="h-6 w-6" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
//                     <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//                     <button
//                         onClick={onConfirm}
//                         className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     const createStripeSession = useAction(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser(); // use isLoaded here

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             // Use the current URL pathname for the return URL base, making it more flexible
//             const returnUrl = window.location.origin + window.location.pathname;

//             // CRITICAL FIX: The Convex action expects 'priceKey' and 'returnUrl'
//             const sessionUrl = await createStripeSession({
//                 priceKey: planPriceId, // planPriceId here is 'price_pro'
//                 returnUrl: returnUrl,
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirection to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Server error: ${e.message}.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }

//         // Render a placeholder button for other plans that aren't the current one
//         return (
//             <button
//                 disabled={true}
//                 className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//                 Contact Sales
//             </button>
//         );
//     };

//     // Show a loading state if the user data isn't loaded yet (only relevant if useUser is not mocked)
//     if (!isLoaded) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//                 <p className="ml-2 text-gray-600">Loading user authentication...</p>
//             </div>
//         );
//     }

//     // Fallback for userData, in a real app, this should be queried from Convex
//     const tokensUsed = userData.tokensUsed.toLocaleString();
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

//             {/* Current Token Usage Summary Card (Added for completeness) */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
//                     <p className="text-lg text-gray-600 mt-1">
//                         **{tokensUsed} / {tokenLimit}** tokens used this month.
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
//                     <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
//                         {plan.isPopular && (
//                             <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
//                                 Most Popular
//                             </div>
//                         )}

//                         {/* Plan Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
//                             <p className="text-gray-500 mb-6">{plan.description}</p>
//                             <div className="text-5xl font-extrabold text-gray-900">
//                                 {plan.currency}{plan.price}
//                                 <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
//                             </div>
//                         </div>

//                         <ul className="space-y-4 mb-10">
//                             {plan.features.map((feature, index) => (
//                                 <li key={index} className="flex items-start text-gray-700">
//                                     <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                     type={modal.type}
//                 />
//             )}
//         </div>
//     );
// };

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { useAction, useMutation } from 'convex/react'; // <-- FIX 1: ADDED useMutation
// import { api } from '@/convex/_generated/api'; // Ensure this path is correct

// // --- CONSTANTS AND MOCKING ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (REPLACE WITH REAL CLERK HOOK)
// const useUser = () => ({
//     isLoaded: true, // Assuming data is loaded for the mock
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// // CustomModal component (Assuming it remains the same)
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
//     if (!isOpen) return null;

//     const IconComponent = type === 'error' ? XCircle : Check;
//     const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
//                 <div className="flex flex-col items-center">
//                     <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
//                         <IconComponent className="h-6 w-6" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
//                     <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//                     <button
//                         onClick={onConfirm}
//                         className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     const createStripeSession = useMutation(api.stripe.createStripeSession); // <-- FIX 2: Switched useAction to useMutation
//     const { isSignedIn, isLoaded } = useUser(); // use isLoaded here

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             // Use the current URL pathname for the return URL base, making it more flexible
//             const returnUrl = window.location.origin + window.location.pathname;

//             // CRITICAL FIX: The Convex action expects 'priceKey' and 'returnUrl'
//             const sessionUrl = await createStripeSession({
//                 priceKey: planPriceId, // planPriceId here is 'price_pro'
//                 returnUrl: returnUrl,
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirection to Stripe
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Server error: ${e.message}.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }

//         // Render a placeholder button for other plans that aren't the current one
//         return (
//             <button
//                 disabled={true}
//                 className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//                 Contact Sales
//             </button>
//         );
//     };

//     // Show a loading state if the user data isn't loaded yet (only relevant if useUser is not mocked)
//     if (!isLoaded) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//                 <p className="ml-2 text-gray-600">Loading user authentication...</p>
//             </div>
//         );
//     }

//     // Fallback for userData, in a real app, this should be queried from Convex
//     const tokensUsed = userData.tokensUsed.toLocaleString();
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

//             {/* Current Token Usage Summary Card (Added for completeness) */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
//                     <p className="text-lg text-gray-600 mt-1">
//                         **{tokensUsed} / {tokenLimit}** tokens used this month.
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
//                     <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
//                         {plan.isPopular && (
//                             <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
//                                 Most Popular
//                             </div>
//                         )}

//                         {/* Plan Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
//                             <p className="text-gray-500 mb-6">{plan.description}</p>
//                             <div className="text-5xl font-extrabold text-gray-900">
//                                 {plan.currency}{plan.price}
//                                 <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
//                             </div>
//                         </div>

//                         <ul className="space-y-4 mb-10">
//                             {plan.features.map((feature, index) => (
//                                 <li key={index} className="flex items-start text-gray-700">
//                                     <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                     type={modal.type}
//                 />
//             )}
//         </div>
//     );
// };

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
// import { c, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api'; // Ensure this path is correct

// // --- CONSTANTS AND MOCKING ---
// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking Clerk's useUser hook (REPLACE WITH REAL CLERK HOOK)
// const useUser = () => ({
//     isLoaded: true, // Assuming data is loaded for the mock
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// // CustomModal component (Assuming it remains the same)
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
//     if (!isOpen) return null;

//     const IconComponent = type === 'error' ? XCircle : Check;
//     const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
//                 <div className="flex flex-col items-center">
//                     <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
//                         <IconComponent className="h-6 w-6" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
//                     <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//                     <button
//                         onClick={onConfirm}
//                         className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     // FIX: useMutation is correct for an action that modifies state/data (even if it's external like creating a Stripe session)
//     const createStripeSession = useMutation(api.stripe.createStripeSession);
//     const { isSignedIn, isLoaded } = useUser();

//     // MOCK: Set plan to 'Free' to allow testing the Upgrade button
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             // Use the current URL pathname for the return URL base, making it more flexible
//             const returnUrl = window.location.origin + window.location.pathname;

//             // CRITICAL STEP: Call the Convex mutation to generate the Stripe Session URL
//             const sessionUrl = await createStripeSession({
//                 priceKey: planPriceId, // planPriceId here is 'price_pro'
//                 returnUrl: returnUrl,
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to Stripe to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 // Short timeout before redirecting to allow the modal to show
//                 setTimeout(() => {
//                     window.location.href = sessionUrl; // Redirection to Stripe Checkout Page
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Server error: ${e.message}.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }

//         // Render a placeholder button for other plans that aren't the current one
//         return (
//             <button
//                 disabled={true}
//                 className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//                 Contact Sales
//             </button>
//         );
//     };

//     // Show a loading state if the user data isn't loaded yet (only relevant if useUser is not mocked)
//     if (!isLoaded) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//                 <p className="ml-2 text-gray-600">Loading user authentication...</p>
//             </div>
//         );
//     }

//     // Fallback for userData, in a real app, this should be queried from Convex
//     const tokensUsed = userData.tokensUsed.toLocaleString();
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

//             {/* Current Token Usage Summary Card (Added for completeness) */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
//                     <p className="text-lg text-gray-600 mt-1">
//                         **{tokensUsed} / {tokenLimit}** tokens used this month.
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
//                     <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
//                         {plan.isPopular && (
//                             <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
//                                 Most Popular
//                             </div>
//                         )}

//                         {/* Plan Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
//                             <p className="text-gray-500 mb-6">{plan.description}</p>
//                             <div className="text-5xl font-extrabold text-gray-900">
//                                 {plan.currency}{plan.price}
//                                 <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
//                             </div>
//                         </div>

//                         <ul className="space-y-4 mb-10">
//                             {plan.features.map((feature, index) => (
//                                 <li key={index} className="flex items-start text-gray-700">
//                                     <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                     type={modal.type}
//                 />
//             )}
//         </div>
//     );
// };

// "use client"

// import React, { useState, useCallback } from 'react';
// import { Check, Loader2, DollarSign, Zap, Crown, XCircle } from 'lucide-react';

// // --- CONSTANTS AND MOCKING ---
// // NOTE: All Convex and external backend imports have been removed. 
// // The payment logic is simulated via local mock functions to ensure 
// // the component compiles and runs in this self-contained environment.

// const FREE_PLAN_LIMIT = 50000;
// const PRO_PLAN_LIMIT = 100000;

// // Mocking the user hook for UI display purposes
// const useUser = () => ({
//     isLoaded: true,
//     isSignedIn: true,
//     user: {
//         id: 'user_mock_123',
//         firstName: 'Example',
//         emailAddresses: [{ emailAddress: 'user@example.com' }],
//     },
// });

// const PLANS = [
//     { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
//     { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
// ];

// /**
//  * MOCK: This simulates the backend action (like the Convex `createCheckoutSession` action)
//  * that generates a secure Stripe checkout URL.
//  */
// const useStripeMutationMock = () => {
//     // This function returns the asynchronous action the button calls
//     return useCallback(async ({ priceKey, returnUrl }) => {
//         // Log to console to show the simulated call
//         console.log(`Simulating Stripe Session creation for price: ${priceKey}. Return URL: ${returnUrl}`);

//         // Simulate network delay for a realistic feel
//         await new Promise(resolve => setTimeout(resolve, 800));

//         // Return a MOCK URL simulating the secure Stripe Checkout page
//         if (priceKey === 'price_pro') {
//             return 'https://mock-stripe-checkout.com/session-id-12345';
//         }

//         throw new Error('Invalid price key provided to mock payment system.');
//     }, []);
// };

// // CustomModal component for alerts and redirection messages
// const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
//     if (!isOpen) return null;

//     const IconComponent = type === 'error' ? XCircle : Check;
//     const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
//                 <div className="flex flex-col items-center">
//                     <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
//                         <IconComponent className="h-6 w-6" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
//                     <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
//                     <button
//                         onClick={onConfirm}
//                         className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
//                     >
//                         {confirmText}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     // Uses the local mock function instead of an external hook
//     const createStripeSession = useStripeMutationMock();
//     const { isLoaded } = useUser();

//     // MOCK: User data state, set to 'Free' to allow the upgrade button to show
//     const [userData] = useState({
//         plan: 'Free',
//         tokensUsed: 50000,
//     });

//     const [loadingPriceId, setLoadingPriceId] = useState(null);
//     const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

//     const currentPlan = userData.plan;

//     const handleUpgrade = useCallback(async (planPriceId) => {
//         setLoadingPriceId(planPriceId);

//         try {
//             // Get the base URL for Stripe redirection success/failure
//             const returnUrl = window.location.origin + window.location.pathname;

//             // Call the (mocked) function to generate the Stripe Session URL
//             const sessionUrl = await createStripeSession({
//                 priceKey: planPriceId,
//                 returnUrl: returnUrl,
//             });

//             if (sessionUrl) {
//                 setModal({
//                     isOpen: true,
//                     type: 'success',
//                     title: 'Redirecting to Payment...',
//                     message: `You are being redirected to a secure payment page to complete your subscription purchase.`,
//                     planName: 'Pro'
//                 });

//                 // Short timeout before redirecting to allow the modal to show
//                 setTimeout(() => {
//                     // Redirects to the secure payment page (mock URL for this demo)
//                     window.location.href = sessionUrl;
//                 }, 1000);

//             } else {
//                 throw new Error("Stripe session URL was empty.");
//             }
//         } catch (e) {
//             console.error('Upgrade error:', e);
//             setModal({
//                 isOpen: true,
//                 type: 'error',
//                 title: 'Upgrade Failed',
//                 message: `An error occurred. Please check the console for details.`,
//                 planName: 'Pro'
//             });
//             setLoadingPriceId(null);
//         }
//     }, [createStripeSession]);

//     const closeModal = () => {
//         setModal({ isOpen: false, type: null, planName: '' });
//     };

//     const renderPlanButton = (plan) => {
//         const isPro = plan.priceId === 'price_pro';
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

//         if (plan.priceId === 'price_free' && currentPlan === 'Free') {
//             return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
//         }

//         // Placeholder button for other plans
//         return (
//             <button
//                 disabled={true}
//                 className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
//             >
//                 Current Plan
//             </button>
//         );
//     };

//     if (!isLoaded) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//                 <p className="ml-2 text-gray-600">Loading user authentication...</p>
//             </div>
//         );
//     }

//     const tokensUsed = userData.tokensUsed.toLocaleString();
//     const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
//             <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
//             <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

//             {/* Current Token Usage Summary Card */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
//                     <p className="text-lg text-gray-600 mt-1">
//                         **{tokensUsed} / {tokenLimit}** tokens used this month.
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
//                     <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
//                 {PLANS.map((plan) => (
//                     <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
//                         {plan.isPopular && (
//                             <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
//                                 Most Popular
//                             </div>
//                         )}

//                         {/* Plan Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
//                             <p className="text-gray-500 mb-6">{plan.description}</p>
//                             <div className="text-5xl font-extrabold text-gray-900">
//                                 {plan.currency}{plan.price}
//                                 <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
//                             </div>
//                         </div>

//                         <ul className="space-y-4 mb-10">
//                             {plan.features.map((feature, index) => (
//                                 <li key={index} className="flex items-start text-gray-700">
//                                     <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {renderPlanButton(plan)}
//                     </div>
//                 ))}
//             </div>

//             {(modal.type === 'success' || modal.type === 'error') && (
//                 <CustomModal
//                     isOpen={modal.isOpen}
//                     title={modal.title}
//                     message={modal.message}
//                     onConfirm={closeModal}
//                     confirmText="Close"
//                     type={modal.type}
//                 />
//             )}
//         </div>
//     );
// };

"use client"

import React, { useState, useCallback } from 'react';
import { Check, Loader2, DollarSign, Zap, Crown, XCircle } from 'lucide-react';

// --- CONSTANTS AND MOCKING ---
// NOTE: All Convex and external backend imports have been removed. 
// The payment logic is simulated via local mock functions to ensure 
// the component compiles and runs in this self-contained environment.

const FREE_PLAN_LIMIT = 50000;
const PRO_PLAN_LIMIT = 200000;

// Mocking the user hook for UI display purposes
const useUser = () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
        id: 'user_mock_123',
        firstName: 'Example',
        emailAddresses: [{ emailAddress: 'user@example.com' }],
    },
});

const PLANS = [
    { name: 'Basic (Free)', price: '0', currency: '$', interval: 'mo', description: 'Essential features.', features: ['Standard features', `${FREE_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Email support'], icon: DollarSign, priceId: 'price_free', },
    { name: 'Pro', price: '10.00', currency: '$', interval: 'mo', description: 'Unlock everything for power users.', features: ['All Basic features', `${PRO_PLAN_LIMIT.toLocaleString()} monthly token limit`, 'Priority 24/7 support'], icon: Zap, priceId: 'price_pro', isPopular: true, },
];

/**
 * MOCK: This hook is now removed as we are not simulating a Stripe Session.
 * We will simply use the local state.
 */
// const useStripeMutationMock = () => { ... }; // REMOVED

// CustomModal component for alerts and redirection messages
const CustomModal = ({ isOpen, title, message, onConfirm, confirmText, type }) => {
    if (!isOpen) return null;

    const IconComponent = type === 'error' ? XCircle : Check;
    const colorClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
                <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full ${colorClass} text-white mb-4`}>
                        <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
                    <button
                        onClick={onConfirm}
                        className={`w-full py-2 rounded-lg font-semibold text-white ${colorClass} hover:opacity-90 transition-opacity`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App() {
    // const createStripeSession = useStripeMutationMock(); // REMOVED
    const { isLoaded } = useUser();

    // 💡 CRITICAL CHANGE: userData is now stateful so we can update the 'plan'
    const [userData, setUserData] = useState({
        plan: 'Free', // Initial plan
        tokensUsed: 50000,
    });

    const [loadingPriceId, setLoadingPriceId] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: null, planName: '' });

    const currentPlan = userData.plan;

    // 💡 CRITICAL CHANGE: Simplified handleUpgrade to simulate local success
    const handleUpgrade = useCallback(async (planPriceId) => {
        if (planPriceId !== 'price_pro') return; // Only 'Pro' can be upgraded to

        setLoadingPriceId(planPriceId);

        try {
            // STEP 1: Simulate Network Delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // STEP 2: Update Mock State (Simulate Database/Backend change)
            setUserData(prev => ({
                ...prev,
                plan: 'Pro', // Change plan from 'Free' to 'Pro'
                tokensUsed: 0, // Optionally reset tokens
            }));

            // STEP 3: Display Success Message
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Payment Successful!',
                message: `Your account has been upgraded to the Pro Plan. Enjoy ${PRO_PLAN_LIMIT.toLocaleString()} monthly tokens!`,
                planName: 'Pro'
            });
        } catch (e) {
            // In this local simulation, an error shouldn't happen, but good practice to catch
            console.error('Mock Upgrade error:', e);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Upgrade Failed',
                message: `A simulated error occurred.`,
                planName: 'Pro'
            });
        } finally {
            // 💡 IMPORTANT: Clear loading state *after* state update and modal show
            setLoadingPriceId(null);
        }
    }, []); // Dependency array is now empty since external hooks are removed

    const closeModal = () => {
        setModal({ isOpen: false, type: null, planName: '' });
    };

    const renderPlanButton = (plan) => {
        const isPro = plan.priceId === 'price_pro';
        const isLoading = loadingPriceId === plan.priceId;

        if (isPro) {
            if (currentPlan === 'Pro') {
                return (<div className="text-center py-3 rounded-xl font-semibold text-lg text-indigo-600 bg-indigo-100">Current Plan</div>);
            } else {
                return (
                    <button
                        onClick={() => handleUpgrade(plan.priceId)} // Calls the new local upgrade logic
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center"
                    >
                        {/* Updated text to reflect local processing */}
                        {isLoading ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />Processing...</>) : (<>Upgrade to Pro</>)}
                    </button>
                );
            }
        }

        // Rest of the logic remains the same
        if (plan.priceId === 'price_free' && currentPlan === 'Free') {
            return (<div className="text-center py-3 text-lg font-semibold text-green-600 bg-green-100 rounded-xl">Current Plan</div>);
        }

        // Placeholder button for other plans
        return (
            <button
                disabled={true}
                className="w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-500 cursor-not-allowed"
            >
                Current Plan
            </button>
        );
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="ml-2 text-gray-600">Loading user authentication...</p>
            </div>
        );
    }

    const tokensUsed = userData.tokensUsed.toLocaleString();
    const tokenLimit = currentPlan === 'Pro' ? PRO_PLAN_LIMIT.toLocaleString() : FREE_PLAN_LIMIT.toLocaleString();


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-[Inter]">
            <h1 className="text-4xl font-extrabold text-gray-900 mt-12 mb-4">Subscription Management</h1>
            <p className="text-xl text-gray-600 mb-12">Choose the plan that's right for you.</p>

            {/* Current Token Usage Summary Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-10 w-full max-w-4xl flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Your Usage</h2>
                    <p className="text-lg text-gray-600 mt-1">
                        **{tokensUsed} / {tokenLimit}** tokens used this month.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Crown className={`h-6 w-6 ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <p className="text-xl font-semibold text-indigo-600">{currentPlan} Plan</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
                {PLANS.map((plan) => (
                    <div key={plan.name} className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 shadow-xl ${plan.isPopular ? 'border-indigo-600 shadow-indigo-200' : 'border-gray-200'}`}>
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
                                Most Popular
                            </div>
                        )}

                        {/* Plan Details */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
                            <p className="text-gray-500 mb-6">{plan.description}</p>
                            <div className="text-5xl font-extrabold text-gray-900">
                                {plan.currency}{plan.price}
                                <span className="text-xl font-medium text-gray-500">/{plan.interval}</span>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-gray-700">
                                    <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {renderPlanButton(plan)}
                    </div>
                ))}
            </div>

            {modal.isOpen && ( // Condition simplified as only success or error is relevant here
                <CustomModal
                    isOpen={modal.isOpen}
                    title={modal.title}
                    message={modal.message}
                    onConfirm={closeModal}
                    confirmText="Got It" // Changed "Close" to "Got It" for success
                    type={modal.type}
                />
            )}
        </div>
    );
};