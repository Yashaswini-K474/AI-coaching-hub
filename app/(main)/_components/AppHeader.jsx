// import React from 'react'
// import Image from 'next/image'
// import { UserButton } from '@stackframe/stack'

// function AppHeader() {
//     return (
//         <div className='p-3 shadow-sm flex justify-between items-center '>
//             <Image src={'/logo.svg'} alt='logo'
//                 width={50}
//                 height={50}
//             />

//             <UserButton />
//         </div>
//     )
// }

// export default AppHeader


"use client";
import React from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";

function AppHeader() {
    const { isSignedIn } = useUser();

    return (
        <div className="p-3 shadow-sm flex justify-between items-center">
            <Image
                src={"/logo.svg"}
                alt="logo"
                width={50}
                height={50}
            />

            {/* {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
            ) : ( */}

            {isSignedIn ? (
                <UserButton afterSignOutUrl="/dashboard" />
            ) : (
                <a
                    href="/sign-in"
                    className="text-blue-600 font-medium hover:underline"
                >
                    Sign In
                </a>
            )}
        </div>
    );
}

export default AppHeader;
