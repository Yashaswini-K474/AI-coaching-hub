// "use client"
// import { Button } from '@/components/ui/button';
// import { useUser } from '@stackframe/stack'
// import React from 'react'
// import { ExpertsList } from '@/services/Options';
// import Image from 'next/image';
// import { BlurFade } from '@/components/magicui/blur-fade';
// import UserInputDialog from './UserInputDialog';



// function FeatureAssistants() {
//     const user = useUser();
//     return (
//         <div >
//             <div className='flex justify-between items-center'>
//                 <div>
//                     <h2 className='font-medium text-gray-500'>My Workspace</h2>
//                     <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName}</h2>

//                 </div>
//                 <Button className="bg-primary text-white px-4 py-2 rounded">Profile</Button>
//             </div>
//             <div className='grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10'>
//                 {ExpertsList.map((option, index) => (
//                     <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
//                         <div key={index} className='p-3 bg-secondary round-3xl flex flex-col justify-center items-center'>
//                             <UserInputDialog coachingOption={option}>
//                                 <div key={index} className='flex flex-col justify-center items-center'>
//                                     <Image src={option.icon} alt={option.name}
//                                         width={150}
//                                         height={150}
//                                         className='h-[70px] w-[70px] bg-gray-200 rounded-md shadow-2xl shadow-gray-400 transform hover:rotate-12 hover:scale-125 cursor-pointer transition duration-300 border border-gray '
//                                     />
//                                     <h2 className='mt-2'>{option.name}</h2>
//                                 </div>
//                             </UserInputDialog>
//                         </div>
//                     </BlurFade>
//                 ))}

//             </div>
//         </div>
//     )
// }

// export default FeatureAssistants

// "use client";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import React from "react";
// import { ExpertsList } from "@/services/Options";
// import Image from "next/image";
// import { BlurFade } from "@/components/magicui/blur-fade";
// import UserInputDialog from "./UserInputDialog";

// function FeatureAssistants() {
//     const { user, isLoaded, isSignedIn } = useUser();

//     if (!isLoaded) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="font-medium text-gray-500">My Workspace</h2>
//                     <h2 className="text-3xl font-bold">
//                         Welcome back,{" "}
//                         {isSignedIn ? user.fullName || user.username || "User" : "Guest"}
//                     </h2>
//                 </div>
//                 <Button className="bg-primary text-white px-4 py-2 rounded">
//                     Profile
//                 </Button>
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10">
//                 {ExpertsList.map((option, index) => (
//                     <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
//                         <div
//                             key={index}
//                             className="p-3 bg-secondary round-3xl flex flex-col justify-center items-center"
//                         >
//                             <UserInputDialog coachingOption={option}>
//                                 <div className="flex flex-col justify-center items-center">
//                                     <Image
//                                         src={option.icon}
//                                         alt={option.name}
//                                         width={150}
//                                         height={150}
//                                         className="h-[70px] w-[70px] bg-gray-200 rounded-md shadow-2xl shadow-gray-400 transform hover:rotate-12 hover:scale-125 cursor-pointer transition duration-300 border border-gray"
//                                     />
//                                     <h2 className="mt-2">{option.name}</h2>
//                                 </div>
//                             </UserInputDialog>
//                         </div>
//                     </BlurFade>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default FeatureAssistants;

// "use client";

// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import React from "react";
// import { ExpertsList } from "@/services/Options";
// import Image from "next/image";
// import UserInputDialog from "./UserInputDialog";

// function FeatureAssistants() {
//     const { user, isLoaded, isSignedIn } = useUser();

//     if (!isLoaded) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className='mt-2'>
//             {/* My Workspace Section (Top) */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="font-medium text-gray-500">My Workspace</h2>
//                     <h2 className="text-3xl font-bold">
//                         Welcome back,{" "}
//                         {isSignedIn ? user.fullName || user.username || "User" : "Guest"}
//                     </h2>
//                 </div>
//                 <Button className="bg-primary text-white px-4 py-2 rounded">
//                     Profile
//                 </Button>
//             </div>

//             {/* Feature Assistants Grid */}
//             <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10">
//                 {ExpertsList.map((option, index) => (
//                     <UserInputDialog key={index} coachingOption={option}>

//                         {/* 🛑 CLEAN FIX: Pass the single div directly. NO FRAGMENT. */}
//                         <div
//                             className="p-3 bg-secondary round-3xl flex flex-col justify-center items-center cursor-pointer 
//                                        transition duration-300 hover:shadow-lg hover:scale-[1.03]"
//                         >
//                             <Image
//                                 src={option.icon}
//                                 alt={option.name}
//                                 width={150}
//                                 height={150}
//                                 className="h-[70px] w-[70px] bg-gray-200 rounded-md shadow-2xl shadow-gray-400 
//                                            transform hover:rotate-12 hover:scale-125 transition duration-300 border border-gray"
//                             />
//                             <h2 className="mt-2">{option.name}</h2>
//                         </div>

//                     </UserInputDialog>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default FeatureAssistants;

"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { ExpertsList } from "@/services/Options";
import Image from "next/image";
import UserInputDialog from "./UserInputDialog";
import ProfileDialog from "./ProfileDialog";

function FeatureAssistants() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="mt-2">
            {/* Workspace Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-medium text-gray-500">My Workspace</h2>
                    <h2 className="text-3xl font-bold">
                        Welcome back, {isSignedIn ? user.fullName || user.username || "User" : "Guest"}
                    </h2>
                </div>
                <ProfileDialog>
                    <Button className="bg-primary text-white px-4 py-2 rounded">Profile</Button>
                </ProfileDialog>
            </div>

            {/* Feature Assistants Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10">
                {ExpertsList.map((option, index) => (
                    <UserInputDialog key={index} coachingOption={option}>
                        {/* ✅ DialogTrigger must be a single child element */}
                        <button
                            type="button"
                            className="p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center cursor-pointer
                                       transition duration-300 hover:shadow-lg hover:scale-[1.03]"
                        >
                            <Image
                                src={option.icon}
                                alt={option.name}
                                width={70}
                                height={70}
                                className="object-cover rounded-md shadow-lg"
                            />
                            <div className="mt-2 font-semibold">{option.name}</div>
                        </button>
                    </UserInputDialog>
                ))}
            </div>
        </div>
    );
}

export default FeatureAssistants;
