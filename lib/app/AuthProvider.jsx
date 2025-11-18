// "use client"
// import { useStackApp, useUser } from '@stackframe/stack'
// import { useMutation } from 'convex/react';
// import React, { useEffect, useState } from 'react'
// import { api } from '@/convex/_generated/api';
// import { UserContext } from './_context/UserContext';

// function AuthProvider({ children }) {

//   const user = useUser();
//   const CreateUser = useMutation(api.users.CreateUser);
//   const [userData, setUserData] = useState();
//   useEffect(() => {
//     console.log(user)
//     user && CreateNewUser();
//   }, [user])

//   const CreateNewUser = async () => {
//     const result = await CreateUser({
//       name: user?.displayName,
//       email: user.primaryEmail
//     });
//     console.log(result);
//     setUserData(result);

//   }
//   return (
//     <div>
//       <UserContext.Provider value={{ userData, setUserData }}>
//         {children}
//       </UserContext.Provider>

//     </div>
//   )
// }

// export default AuthProvider


// AuthProvider.js

// 'use client';

// import React, { useEffect, useState } from "react";
// import { useUser, useAuth } from "@clerk/nextjs";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { UserContext } from "./_context/UserContext";

// function AuthProvider({ children, convexClient }) {
//   const { isSignedIn, getToken } = useAuth();
//   const { user } = useUser();
//   const CreateUser = useMutation(api.users.CreateUser); // must be inside client component
//   const [userData, setUserData] = useState(null);

//   // Set Convex auth token when user signs in
//   useEffect(() => {
//     if (!convexClient) return;

//     convexClient.setAuth(async () => {
//       if (!isSignedIn) return null;

//       try {
//         const token = await getToken({ template: "convex" });
//         return token;
//       } catch (err) {
//         console.error("Error fetching Clerk token for Convex:", err);
//         return null;
//       }
//     });
//   }, [isSignedIn, convexClient, getToken]);

//   // Create or update user in Convex when user is available
//   useEffect(() => {
//     if (!user) return;

//     const createOrUpdateUser = async () => {
//       try {
//         const result = await CreateUser({
//           name: user.fullName || user.username || "Anonymous",
//           email: user.primaryEmailAddress?.emailAddress || "",
//         });
//         setUserData(result);
//       } catch (err) {
//         console.error("Error creating user in Convex:", err);
//       }
//     };

//     createOrUpdateUser();
//   }, [user, CreateUser]);

//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default AuthProvider;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useUser, useAuth } from '@clerk/nextjs';
// import { useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { UserContext } from './_context/UserContext';

// function AuthProvider({ children, convexClient }) {
//   // CRITICAL FIX: Get the loading status from Clerk
//   const { isLoaded, isSignedIn, getToken } = useAuth();
//   const { user } = useUser();

//   const [userData, setUserData] = useState(null);

//   // Now safe because ConvexProvider is wrapping this component
//   const createUserMutation = useMutation(api.users.CreateUser);

//   // ✅ Attach Clerk token to Convex
//   useEffect(() => {
//     if (!convexClient) return;

//     convexClient.setAuth(async () => {
//       // Wait for Clerk to load before trying to get the token
//       if (!isLoaded || !isSignedIn) return null;
//       return await getToken({ template: "convex" }).catch(() => null);
//     });
//   }, [isLoaded, isSignedIn, convexClient, getToken]); // Added isLoaded to dependency array

//   // ✅ Create/update Convex user when Clerk user loads
//   useEffect(() => {
//     // Check if Clerk and user data are loaded before proceeding
//     if (!isLoaded || !user) return;

//     createUserMutation({
//       name: user.fullName || user.username || "Anonymous",
//       email: user.primaryEmailAddress?.emailAddress || "",
//     })
//       .then((result) => setUserData(result))
//       .catch((err) => console.error("Error creating user:", err));
//   }, [isLoaded, user, createUserMutation]); // Added isLoaded to dependency array

//   // 🛑 HYDRATION FIX: Prevent rendering complex UI until Clerk state is known
//   // If Clerk is not loaded, return a simple div or null to match the server's minimum output.
//   if (!isLoaded) {
//     // You can return null or a simple loading spinner here if preferred
//     return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       Loading Authentication...
//     </div>;
//   }

//   // Final render when Clerk is loaded
//   return (
//     <UserContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default AuthProvider;

'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserContext } from './_context/UserContext';

function AuthProvider({ children, convexClient }) {
  // CRITICAL FIX: Get the loading status from Clerk
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [userData, setUserData] = useState(null);

  // FIX 1: Renamed the mutation to use the correct function name from users.js
  const getOrCreateUserMutation = useMutation(api.users.getOrCreateUser);

  // ✅ Attach Clerk token to Convex
  useEffect(() => {
    if (!convexClient) return;

    convexClient.setAuth(async () => {
      // Wait for Clerk to load before trying to get the token
      if (!isLoaded || !isSignedIn) return null;
      return await getToken({ template: "convex" }).catch(() => null);
    });
  }, [isLoaded, isSignedIn, convexClient, getToken]); // Added isLoaded to dependency array

  // ✅ Create/update Convex user when Clerk user loads
  useEffect(() => {
    // Check if Clerk and user data are loaded before proceeding
    if (!isLoaded || !user) return;

    // FIX 2: Call the corrected mutation name
    getOrCreateUserMutation({
      name: user.fullName || user.username || "Anonymous",
      email: user.primaryEmailAddress?.emailAddress || "",
    })
      .then((result) => setUserData(result))
      .catch((err) => console.error("Error creating user:", err));
  }, [isLoaded, user, getOrCreateUserMutation]); // Updated dependency array

  // 🛑 HYDRATION FIX: Prevent rendering complex UI until Clerk state is known
  // If Clerk is not loaded, return a simple div or null to match the server's minimum output.
  if (!isLoaded) {
    // You can return null or a simple loading spinner here if preferred
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading Authentication...
    </div>;
  }

  // Final render when Clerk is loaded
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;