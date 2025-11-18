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

"use client";

import { useEffect, useState } from 'react';
// Imports necessary for a Next.js App Router component
import { useSearchParams, useRouter } from 'next/navigation';
// Imports necessary for Convex backend interaction
import { useAction } from 'convex/react';
import { api } from "../../../convex/_generated/api";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
// Assuming these are your utility components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// NOTE: This page handles the redirect from Stripe after payment
function PaymentSuccessPage() {
    // Hooks for navigation and backend interaction
    const searchParams = useSearchParams();
    const router = useRouter();
    // This hook calls the Convex Action that verifies payment and updates user data
    const verifyPaymentAction = useAction(api.dodo.verifyPayment);

    // State for UI feedback
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your payment and updating your account...');

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        // Function to handle the final navigation
        const redirectToDashboard = (delay = 3000) => {
            console.log("CRITICAL: Redirecting to dashboard in", delay / 1000, "seconds...");
            setTimeout(() => {
                // *** FIX: Using window.location.href to force a hard browser reload ***
                window.location.href = '/dashboard';
            }, delay);
        };

        if (!sessionId) {
            setStatus('error');
            setMessage('Error: Missing payment session ID. Please contact support.');
            redirectToDashboard(5000); // Redirect even on error
            return;
        }

        const handleVerification = async () => {
            try {
                // 1. Call the Convex Action to securely verify payment
                console.log(`Attempting to verify session: ${sessionId}`);
                const result = await verifyPaymentAction({ sessionId });

                if (result.success) {
                    // 2. Success path: User data (credits) updated in Convex
                    setStatus('success');
                    setMessage("Payment confirmed! Your account has been upgraded to the Pro Plan (2,00,000 Tokens).");
                } else {
                    // 3. Verification failure (e.g., session already processed)
                    setStatus('error');
                    // Check your Convex logs for the actual error message sent back in `result.message`
                    setMessage(`Verification Issue: ${result.message || 'Payment session validation failed.'} Please check your plan status on the dashboard.`);
                }
            } catch (error) {
                // 4. Catches network or action invocation errors
                console.error("Payment verification failed at the Action layer:", error);
                setStatus('error');
                setMessage("An internal error occurred during verification. Please try refreshing the page or contact support.");
            } finally {
                // 5. Always redirect after processing attempt, regardless of outcome
                redirectToDashboard(3000);
            }
        };

        handleVerification();
    }, [searchParams, verifyPaymentAction]); // Dependencies look correct

    const getIcon = () => {
        if (status === 'verifying') return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
        if (status === 'success') return <CheckCircle className="h-12 w-12 text-green-500" />;
        return <XCircle className="h-12 w-12 text-red-500" />;
    };

    const getTitle = () => {
        if (status === 'verifying') return 'Processing Payment...';
        if (status === 'success') return 'Payment Successful!';
        return 'Payment Failed or Error';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className={`text-2xl font-bold ${status === 'error' ? 'text-red-600' : 'text-gray-800'}`}>
                        {getTitle()}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center p-6">
                    <div className="mb-6">
                        {getIcon()}
                    </div>
                    <p className="text-gray-600 mb-4">{message}</p>
                    {status === 'verifying' && (
                        <p className="text-sm text-gray-500">You will be redirected automatically in a moment.</p>
                    )}
                    {(status === 'success' || status === 'error') && (
                        <button
                            // When clicked, force a hard reload
                            onClick={() => window.location.href = '/dashboard'}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                        >
                            Go to Dashboard Now
                        </button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default PaymentSuccessPage;