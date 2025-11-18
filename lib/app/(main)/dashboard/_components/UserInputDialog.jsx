// "use client";

// import React, { useState } from 'react';
// import Image from 'next/image';

// import { Textarea } from '@/components/ui/textarea';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';
// import { CoachingExpert } from '@/services/Options';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { DialogClose } from '@radix-ui/react-dialog';
// import { useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { LoaderCircle } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Helper function to safely get a string name
// const getCoachingOptionName = (coachingOption, fallback = 'Coaching Option') => {
//     // Only return the name if it is a string, otherwise return the fallback string
//     return typeof coachingOption?.name === 'string'
//         ? coachingOption.name
//         : fallback;
// };

// function UserInputDialog({ children, coachingOption }) {
//     // Hooks that require 'use client'
//     const [selectedExpert, setSelectedExpert] = useState();
//     const [topic, setTopic] = useState();
//     const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     // Hook that requires 'use client'
//     const router = useRouter();
//     // ... rest of the component


//     // ... (rest of your component logic and return statement) ...
//     // Note: The rest of the code is the same as your previously corrected version.

//     // ...
//     // ...

//     const OnClickNext = async () => {
//         setLoading(true);
//         const result = await createDiscussionRoom({
//             topic: topic,
//             coachingOption: getCoachingOptionName(coachingOption, ''),
//             expertName:
//                 typeof selectedExpert === 'string' ? selectedExpert : '',
//         });
//         console.log(result);
//         setLoading(false);
//         setOpenDialog(false);
//         router.push('/discussion-room/' + result);
//     };

//     return (
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//             <DialogTrigger>{children}</DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>
//                         {getCoachingOptionName(coachingOption, 'Coaching Option')}
//                     </DialogTitle>
//                     <DialogDescription asChild>
//                         <div className="mt-3">
//                             <h2 className="text-black">
//                                 Enter a topic to master your skills in{' '}
//                                 {getCoachingOptionName(coachingOption, 'this area')}
//                             </h2>

//                             <Textarea
//                                 placeholder="Enter your topic here..."
//                                 className="mt-2"
//                                 onChange={(e) => setTopic(e.target.value)}
//                             />

//                             <h2 className="text-black mt-5">Select your coaching expert</h2>

//                             <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
//                                 {CoachingExpert.map((expert, index) => (
//                                     <motion.div
//                                         key={index}
//                                         onClick={() =>
//                                             setSelectedExpert(
//                                                 typeof expert.name === 'string' ? expert.name : ''
//                                             )
//                                         }
//                                         whileHover={{ scale: 1.05 }}
//                                         className={`rounded-2xl cursor-pointer p-1 border-primary ${selectedExpert === expert.name ? 'border' : ''
//                                             }`}
//                                     >
//                                         <Image
//                                             src={expert?.avatar}
//                                             alt={
//                                                 typeof expert.name === 'string' ? expert.name : ''
//                                             }
//                                             width={100}
//                                             height={100}
//                                             className="h-[80px] w-[80px] object-cover"
//                                         />
//                                         <h2 className="text-center">
//                                             {typeof expert.name === 'string' ? expert.name : ''}
//                                         </h2>
//                                     </motion.div>
//                                 ))}
//                             </div>

//                             <div className="flex gap-5 justify-end mt-5">
//                                 <DialogClose asChild>
//                                     <Button variant={'ghost'}>Cancel</Button>
//                                 </DialogClose>

//                                 <Button
//                                     disabled={!topic || !selectedExpert || loading}
//                                     onClick={OnClickNext}
//                                 >
//                                     {loading && <LoaderCircle className="animate-spin" />}
//                                     Next
//                                 </Button>
//                             </div>
//                         </div>
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default UserInputDialog;

// "use client";

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { Textarea } from '@/components/ui/textarea';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';
// import { CoachingExpert } from '@/services/Options';
// import { Button } from '@/components/ui/button';
// import { DialogClose } from '@radix-ui/react-dialog';
// import { useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { LoaderCircle } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Helper function remains correct
// const getCoachingOptionName = (coachingOption, fallback = 'Coaching Option') => {
//     return typeof coachingOption?.name === 'string'
//         ? coachingOption.name
//         : fallback;
// };

// // 🛑 MODIFIED: Accepts 'triggerElement' instead of 'children'
// function UserInputDialog({ triggerElement, coachingOption }) {
//     const [selectedExpert, setSelectedExpert] = useState('');
//     const [topic, setTopic] = useState('');
//     const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const router = useRouter();

//     const OnClickNext = async () => {
//         setLoading(true);
//         try {
//             const result = await createDiscussionRoom({
//                 topic: topic,
//                 coachingOption: getCoachingOptionName(coachingOption, 'Unknown Option'),
//                 expertName: selectedExpert,
//             });

//             setLoading(false);
//             setOpenDialog(false);
//             router.push('/discussion-room/' + result);

//         } catch (error) {
//             console.error("Failed to create discussion room:", error);
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>

//             {/* 🛑 FIX: Pass the trigger element as a prop directly to DialogTrigger.
//                This completely bypasses the children prop system that was failing. */}
//             <DialogTrigger asChild>
//                 {triggerElement}
//             </DialogTrigger>

//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>
//                         {getCoachingOptionName(coachingOption, 'Coaching Option')}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="mt-3">
//                     <h2 className="text-black">
//                         Enter a topic to master your skills in{' '}
//                         {getCoachingOptionName(coachingOption, 'this area')}
//                     </h2>

//                     <Textarea
//                         placeholder="Enter your topic here..."
//                         className="mt-2"
//                         onChange={(e) => setTopic(e.target.value)}
//                     />

//                     <h2 className="text-black mt-5">Select your coaching expert</h2>

//                     <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
//                         {CoachingExpert.map((expert, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() =>
//                                     setSelectedExpert(
//                                         typeof expert.name === 'string' ? expert.name : ''
//                                     )
//                                 }
//                                 className={`rounded-2xl cursor-pointer p-1 border-primary
//                                             hover:scale-[1.05] transition-transform duration-150
//                                             ${selectedExpert === expert.name ? 'border' : ''
//                                     }`}
//                             >
//                                 <Image
//                                     src={expert?.avatar}
//                                     alt={
//                                         typeof expert.name === 'string' ? expert.name : ''
//                                     }
//                                     width={100}
//                                     height={100}
//                                     className="h-[80px] w-[80px] object-cover"
//                                 />
//                                 <h2 className="text-center">
//                                     {typeof expert.name === 'string' ? expert.name : ''}
//                                 </h2>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex gap-5 justify-end mt-5">
//                         <DialogClose asChild>
//                             <Button variant={'ghost'}>Cancel</Button>
//                         </DialogClose>

//                         <Button
//                             disabled={!topic || !selectedExpert || loading}
//                             onClick={OnClickNext}
//                         >
//                             {loading ? (
//                                 <span className="flex items-center justify-center">
//                                     <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
//                                     Next
//                                 </span>
//                             ) : (
//                                 "Next"
//                             )}
//                         </Button>
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default UserInputDialog;


// "use client";

// import React, { useContext, useState } from "react";
// import Image from "next/image";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogTrigger,
//     DialogClose,
// } from "@/components/ui/dialog";
// import { CoachingExpert } from "@/services/Options";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { LoaderCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { UserContext } from "@/app/_context/UserContext";

// // Safe helper for coaching option name
// const getCoachingOptionName = (coachingOption, fallback = "Coaching Option") =>
//     typeof coachingOption?.name === "string" ? coachingOption.name : fallback;

// function UserInputDialog({ children, coachingOption }) {
//     const [selectedExpert, setSelectedExpert] = useState("");
//     const [topic, setTopic] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);

//     const router = useRouter();
//     const { userData } = useContext(UserContext);
//     const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

//     const handleNext = async () => {
//         setLoading(true);
//         const result = await createDiscussionRoom({
//             topic,
//             coachingOption: getCoachingOptionName(coachingOption),
//             expertName: selectedExpert,
//             uid: userData?._id
//         });
//         setLoading(false);
//         setOpenDialog(false);
//         router.push("/discussion-room/" + result);
//     };

//     return (
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//             <DialogTrigger asChild>{children}</DialogTrigger>

//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>{getCoachingOptionName(coachingOption)}</DialogTitle>
//                     <DialogDescription asChild>
//                         {/* ✅ Use a div here to prevent <p> nesting issues */}
//                         <div className="mt-3">
//                             <div className="text-black font-semibold mb-2">
//                                 Enter a topic to master your skills in {getCoachingOptionName(coachingOption)}
//                             </div>

//                             <Textarea
//                                 placeholder="Enter your topic here..."
//                                 className="mt-2"
//                                 value={topic}
//                                 onChange={(e) => setTopic(e.target.value)}
//                             />

//                             <div className="text-black font-semibold mt-5 mb-2">
//                                 Select your coaching expert
//                             </div>

//                             <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
//                                 {CoachingExpert.map((expert, index) => (
//                                     <motion.div
//                                         key={index}
//                                         onClick={() => setSelectedExpert(expert.name)}
//                                         whileHover={{ scale: 1.05 }}
//                                         className={`rounded-2xl cursor-pointer p-1 border-primary ${selectedExpert === expert.name ? "border" : ""
//                                             }`}
//                                     >
//                                         <Image
//                                             src={expert.avatar}
//                                             alt={expert.name}
//                                             width={80}
//                                             height={80}
//                                             className="object-cover rounded-lg"
//                                         />
//                                         <div className="text-center mt-1">{expert.name}</div>
//                                     </motion.div>
//                                 ))}
//                             </div>

//                             <div className="flex gap-5 justify-end mt-5">
//                                 <DialogClose asChild>
//                                     <Button variant="ghost">Cancel</Button>
//                                 </DialogClose>
//                                 <Button
//                                     disabled={!topic || !selectedExpert || loading}
//                                     onClick={handleNext}
//                                 >
//                                     {loading && <LoaderCircle className="animate-spin mr-2" />}
//                                     Next
//                                 </Button>
//                             </div>
//                         </div>
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default UserInputDialog;


// "use client";

// import React, { useContext, useState } from "react";
// import Image from "next/image";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//     DialogTrigger,
//     DialogClose,
// } from "@/components/ui/dialog";
// import { CoachingExpert } from "@/services/Options";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { LoaderCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { UserContext } from "@/app/_context/UserContext";
// // 🛑 CRITICAL FIX: Import useUser from Clerk
// import { useUser } from "@clerk/nextjs";

// // Safe helper for coaching option name
// const getCoachingOptionName = (coachingOption, fallback = "Coaching Option") =>
//     typeof coachingOption?.name === "string" ? coachingOption.name : fallback;

// function UserInputDialog({ children, coachingOption }) {
//     const [selectedExpert, setSelectedExpert] = useState("");
//     const [topic, setTopic] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);

//     const router = useRouter();
//     // Assuming you still need to pull userData for other reasons, otherwise this line can be removed
//     const { userData } = useContext(UserContext);
//     const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

//     // ✅ CRITICAL FIX: Get the authentication state from Clerk
//     const { isLoaded, isSignedIn } = useUser();

//     const handleNext = async () => {
//         // 🛑 Guard against running if Clerk has not finished loading the user session
//         if (!isLoaded || !isSignedIn) {
//             console.error("Clerk user state not ready or user is signed out. Mutation aborted.");
//             return;
//         }

//         setLoading(true);
//         // This mutation relies on the server getting the token via ConvexProviderWithClerk
//         const result = await createDiscussionRoom({
//             topic,
//             coachingOption: getCoachingOptionName(coachingOption),
//             expertName: selectedExpert,
//         });

//         setLoading(false);
//         setOpenDialog(false);
//         router.push("/discussion-room/" + result);
//     };

//     // ✅ Define the final disabled state, including the Clerk loading check
//     const isButtonDisabled = !isLoaded || !isSignedIn || !topic || !selectedExpert || loading;


//     return (
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//             {/* If Clerk hasn't loaded, disable the trigger to prevent modal opening */}
//             <DialogTrigger asChild>
//                 <div style={!isLoaded ? { pointerEvents: 'none' } : {}}>
//                     {children}
//                 </div>
//             </DialogTrigger>

//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>{getCoachingOptionName(coachingOption)}</DialogTitle>
//                     <DialogDescription asChild>
//                         <div className="mt-3">
//                             <div className="text-black font-semibold mb-2">
//                                 Enter a topic to master your skills in {getCoachingOptionName(coachingOption)}
//                             </div>

//                             <Textarea
//                                 placeholder="Enter your topic here..."
//                                 className="mt-2"
//                                 value={topic}
//                                 onChange={(e) => setTopic(e.target.value)}
//                             />

//                             <div className="text-black font-semibold mt-5 mb-2">
//                                 Select your coaching expert
//                             </div>

//                             <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
//                                 {CoachingExpert.map((expert, index) => (
//                                     <motion.div
//                                         key={index}
//                                         onClick={() => setSelectedExpert(expert.name)}
//                                         whileHover={{ scale: 1.05 }}
//                                         className={`rounded-2xl cursor-pointer p-1 border-primary ${selectedExpert === expert.name ? "border" : ""
//                                             }`}
//                                     >
//                                         <Image
//                                             src={expert.avatar}
//                                             alt={expert.name}
//                                             width={80}
//                                             height={80}
//                                             className="object-cover rounded-lg"
//                                         />
//                                         <div className="text-center mt-1">{expert.name}</div>
//                                     </motion.div>
//                                 ))}
//                             </div>

//                             <div className="flex gap-5 justify-end mt-5">
//                                 <DialogClose asChild>
//                                     <Button variant="ghost">Cancel</Button>
//                                 </DialogClose>
//                                 <Button
//                                     disabled={isButtonDisabled} // Use the robust disabled check
//                                     onClick={handleNext}
//                                 >
//                                     {/* Show "Loading Auth" if necessary */}
//                                     {!isLoaded ? "Loading..." : (loading && <LoaderCircle className="animate-spin mr-2" />)}
//                                     {isLoaded ? "Next" : "Wait"}
//                                 </Button>
//                             </div>
//                         </div>
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     );
// }

// export default UserInputDialog;

// userinputdialog.js
"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { CoachingExpert } from "@/services/Options";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// FIX: Import BOTH Clerk's useUser and Convex's useConvexAuth
import { useMutation, useConvexAuth } from "convex/react";
import { useUser, useClerk } from "@clerk/nextjs"; // Added useClerk for sign-in logic
import { api } from "@/convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/_context/UserContext";

// Safe helper for coaching option name
const getCoachingOptionName = (coachingOption, fallback = "Coaching Option") =>
    typeof coachingOption?.name === "string" ? coachingOption.name : fallback;

function UserInputDialog({ children, coachingOption }) {
    const [selectedExpert, setSelectedExpert] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const router = useRouter();
    // Assuming you still need to pull userData for other reasons
    const { userData } = useContext(UserContext);
    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

    // ✅ CONVEX FIX: Use useConvexAuth to guard the server mutation
    const { isLoading: isConvexLoading, isAuthenticated: isConvexAuthenticated } = useConvexAuth();

    // ✅ UI UX: Use useUser to manage the Clerk sign-in state
    const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();
    const clerk = useClerk(); // Get Clerk instance for sign-in redirect

    const handleNext = async () => {
        // 🛑 CRITICAL GUARD: Only proceed if Convex is authenticated
        if (!isConvexAuthenticated) {
            console.error("Convex Auth is not ready. Mutation aborted.");
            // If the user is signed into Clerk but not Convex, something is wrong with the webhook/sync.
            // If they aren't signed into Clerk at all, redirect them.
            if (!isClerkSignedIn) {
                clerk.redirectToSignIn();
            }
            return;
        }

        setLoading(true);
        try {
            const result = await createDiscussionRoom({
                topic,
                coachingOption: getCoachingOptionName(coachingOption),
                expertName: selectedExpert,
            });

            setOpenDialog(false);
            router.push("/discussion-room/" + result);
        } catch (error) {
            console.error("Failed to create room:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Define the final disabled state. Use Clerk's loaded state for the UI initially.
    const isReadyToSubmit = isConvexAuthenticated && topic && selectedExpert;
    const isButtonDisabled = isConvexLoading || !isReadyToSubmit || loading;

    // Determine what to display on the button
    const getButtonText = () => {
        if (loading) {
            return "Creating...";
        }
        if (isConvexLoading) {
            return "Loading Auth...";
        }
        if (!isClerkSignedIn) {
            return "Sign In to Continue"; // Better UX message
        }
        if (!isConvexAuthenticated) {
            return "Authentication Pending..."; // This suggests the sync issue
        }
        return "Next";
    }

    // Use Clerk's loaded state for the initial trigger control
    const isTriggerDisabled = !isClerkLoaded;

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <div style={isTriggerDisabled ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                    {children}
                </div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getCoachingOptionName(coachingOption)}</DialogTitle>
                    <DialogDescription asChild>
                        <div className="mt-3">
                            {/* ... (Topic and Expert selection UI remains unchanged) ... */}
                            <div className="text-black font-semibold mb-2">
                                Enter a topic to master your skills in {getCoachingOptionName(coachingOption)}
                            </div>

                            <Textarea
                                placeholder="Enter your topic here..."
                                className="mt-2"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />

                            <div className="text-black font-semibold mt-5 mb-2">
                                Select your coaching expert
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                                {CoachingExpert.map((expert, index) => (
                                    <motion.div
                                        key={index}
                                        onClick={() => setSelectedExpert(expert.name)}
                                        whileHover={{ scale: 1.05 }}
                                        className={`rounded-2xl cursor-pointer p-1 border-primary ${selectedExpert === expert.name ? "border" : ""
                                            }`}
                                    >
                                        <Image
                                            src={expert.avatar}
                                            alt={expert.name}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-lg"
                                        />
                                        <div className="text-center mt-1">{expert.name}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex gap-5 justify-end mt-5">
                                <DialogClose asChild>
                                    <Button variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button
                                    disabled={isButtonDisabled}
                                    onClick={handleNext}
                                >
                                    {loading && <LoaderCircle className="animate-spin mr-2" />}
                                    {getButtonText()}
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default UserInputDialog;