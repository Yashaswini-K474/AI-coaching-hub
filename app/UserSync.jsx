// app/UserSync.jsx

'use client';

import { useEffect } from "react";
import { useConvexAuth, useMutation } from "convex/react";
// FINAL FIX: Use the new alias!
import { api } from "@/convex/_generated/api";

// This component ensures the user is synced to the Convex database
export default function UserSync() {
    console.log("UserSync Component is RUNNING!");
    const { isAuthenticated } = useConvexAuth();

    // Get the mutation function from the generated API
    const getOrCreateUser = useMutation(api.users.getOrCreateUser);

    useEffect(() => {
        if (isAuthenticated) {
            getOrCreateUser()
                .then(() => {
                    // This will execute and create the user record
                    console.log("User synced successfully! Room creation should now work.");
                })
                .catch(error => {
                    console.error("CRITICAL ERROR: Failed to execute users:getOrCreateUser. Check the mutation name or database schema.", error);
                });
        }
    }, [isAuthenticated, getOrCreateUser]);

    return null;
}