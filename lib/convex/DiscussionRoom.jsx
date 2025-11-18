// import { createContext } from "react";
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values"

// export const CreateNewRoom = mutation({
//     args: {
//         coachingOption: v.string(),
//         topic: v.string(),
//         expertName: v.string(),

//     },
//     handler: async (ctx, args) => {
//         const result = await ctx.db.insert('DiscussionRoom', {
//             coachingOption: args.coachingOption,
//             topic: args.topic,
//             expertName: args.expertName
//         });

//         return result;
//     }
// })
// export const GetDiscussionRoom = query({
//     args: {
//         id: v.id('DiscussionRoom')
//     },
//     handler: async (ctx, args) => {
//         const result = await ctx.db.get(args.id);
//         return result;
//     }
// })

// export const UpdateConversation = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         conversation: v.any()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             conversation: args.conversation
//         })
//     }
// })

// export const UpdateSummery = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         summery: v.any()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             summery: args.summery
//         })
//     }
// })

// 'use client';

// import { useState, useEffect } from "react";
// import { GetDiscussionRoom, UpdateConversation, UpdateSummery } from "../discussion-room/[roomid]/_components/discussion-room";

// import { useParams } from "next/navigation";

// export default function DiscussionRoomPage() {
//     const params = useParams(); // get roomid from URL
//     const roomId = params.roomid;

//     const [room, setRoom] = useState(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [loading, setLoading] = useState(true);

//     // Fetch room data
//     useEffect(() => {
//         async function fetchRoom() {
//             try {
//                 const result = await GetDiscussionRoom({ id: roomId });
//                 setRoom(result);
//             } catch (err) {
//                 console.error("Error fetching room:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchRoom();
//     }, [roomId]);

//     if (loading) return <div>Loading...</div>;
//     if (!room) return <div>Room not found</div>;

//     // Add new message to conversation
//     const handleSendMessage = async () => {
//         if (!newMessage.trim()) return;

//         const updatedConversation = room.conversation ? [...room.conversation, newMessage] : [newMessage];

//         try {
//             await UpdateConversation({ id: roomId, conversation: updatedConversation });
//             setRoom({ ...room, conversation: updatedConversation });
//             setNewMessage("");
//         } catch (err) {
//             console.error("Error updating conversation:", err);
//         }
//     };

//     return (
//         <div style={{ padding: "20px" }}>
//             <h1>Discussion Room</h1>
//             <h2>Topic: {room.topic}</h2>
//             <h3>Expert: {room.expertName}</h3>
//             <h4>Coaching Option: {room.coachingOption}</h4>

//             <div style={{ marginTop: "20px" }}>
//                 <h3>Conversation:</h3>
//                 <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "100px" }}>
//                     {room.conversation && room.conversation.length > 0 ? (
//                         room.conversation.map((msg, index) => <div key={index}>{msg}</div>)
//                     ) : (
//                         <div>No messages yet.</div>
//                     )}
//                 </div>

//                 <div style={{ marginTop: "10px" }}>
//                     <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type a message"
//                         style={{ padding: "5px", width: "70%" }}
//                     />
//                     <button onClick={handleSendMessage} style={{ padding: "5px 10px", marginLeft: "10px" }}>
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// convex/discussionRoom.js

// convex/discussionroom.js

// convex/discussionroom.js

// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values"

// // --- Helper Function to get Convex User ID ---
// // This function performs the secure lookup using the Clerk ID provided by Convex context.
// const getUserId = async (ctx) => {
//     // 1. Get the authenticated identity from Clerk
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//         console.error("Authentication identity not found.");
//         return null;
//     }

//     const clerkUserId = identity.subject;

//     // 2. Query the 'users' table using the indexed 'by_clerk_user_id'
//     // This relies on the index you added to schema.js and the clerkUserId being saved in users.js
//     const user = await ctx.db
//         .query("users")
//         .withIndex("by_clerk_user_id", (q) =>
//             q.eq("clerkUserId", clerkUserId)
//         )
//         .unique();

//     // 3. Return the Convex ID (_id) or null
//     return user ? user._id : null;
// };
// // ---------------------------------------------


// export const CreateNewRoom = mutation({
//     args: {
//         coachingOption: v.string(),
//         topic: v.string(),
//         expertName: v.string(),
//         uid: v.id('users')
//     },
//     handler: async (ctx, args) => {
//         // 🛑 CRITICAL FIX: Get the user's Convex ID
//         const userId = await getUserId(ctx);

//         if (!userId) {
//             // Throw error if user's ID could not be found, ensuring uid is not null
//             throw new Error("User must be authenticated to create a room.");
//         }

//         const result = await ctx.db.insert('DiscussionRoom', {
//             coachingOption: args.coachingOption,
//             topic: args.topic,
//             expertName: args.expertName,
//             uid: args.uid
//         });

//         return result;
//     }
// })

// export const GetDiscussionRoom = query({
//     args: {
//         id: v.id('DiscussionRoom')
//     },
//     handler: async (ctx, args) => {
//         const result = await ctx.db.get(args.id);

//         // Optional Security Check: Ensure only the room owner can view it
//         // const userId = await getUserId(ctx);
//         // if (!userId || result?.uid.toString() !== userId.toString()) {
//         //     throw new Error("Unauthorized access");
//         // }

//         return result;
//     }
// })

// export const UpdateConversation = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         conversation: v.any()
//     },
//     handler: async (ctx, args) => {
//         // Optional Security Check: Ensure only the room owner can update it
//         // const room = await ctx.db.get(args.id);
//         // const userId = await getUserId(ctx);
//         // if (!userId || room?.uid.toString() !== userId.toString()) {
//         //     throw new Error("Unauthorized update");
//         // }

//         await ctx.db.patch(args.id, {
//             conversation: args.conversation
//         })
//     }
// })

// export const UpdateSummery = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         summery: v.any()
//     },
//     handler: async (ctx, args) => {
//         // Optional Security Check: Ensure only the room owner can update it
//         // const room = await ctx.db.get(args.id);
//         // const userId = await getUserId(ctx);
//         // if (!userId || room?.uid.toString() !== userId.toString()) {
//         //     throw new Error("Unauthorized update");
//         // }

//         await ctx.db.patch(args.id, {
//             summery: args.summery
//         })
//     }
// })

// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values"

// // --- Helper Function to get Convex User ID ---
// // This function performs the secure lookup using the Clerk ID provided by Convex context.
// const getUserId = async (ctx) => {
//     // 1. Get the authenticated identity from Clerk
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//         console.error("Authentication identity not found.");
//         return null;
//     }

//     const clerkUserId = identity.subject;

//     // 2. Query the 'users' table using the indexed 'by_clerk_user_id'
//     const user = await ctx.db
//         .query("users")
//         .withIndex("by_clerk_user_id", (q) =>
//             q.eq("clerkUserId", clerkUserId)
//         )
//         .unique();

//     // 3. Return the Convex ID (_id) or null
//     return user ? user._id : null;
// };
// // ---------------------------------------------


// export const CreateNewRoom = mutation({
//     args: {
//         // Only include arguments passed from the client
//         coachingOption: v.string(),
//         topic: v.string(),
//         expertName: v.string(),
//         // uid is NOT in the args validator
//     },
//     handler: async (ctx, args) => {
//         // ✅ The correct place to get the user's Convex ID securely
//         const userId = await getUserId(ctx);

//         if (!userId) {
//             // Throw error if user's ID could not be found.
//             throw new Error("User must be authenticated to create a room.");
//         }

//         const result = await ctx.db.insert('DiscussionRoom', {
//             coachingOption: args.coachingOption,
//             topic: args.topic,
//             expertName: args.expertName,
//             // ✅ Add the secure, server-side retrieved userId to the document
//             uid: userId
//         });

//         return result;
//     }
// })

// export const GetDiscussionRoom = query({
//     args: {
//         id: v.id('DiscussionRoom')
//     },
//     handler: async (ctx, args) => {
//         const result = await ctx.db.get(args.id);
//         return result;
//     }
// })

// export const UpdateConversation = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         conversation: v.any()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             conversation: args.conversation
//         })
//     }
// })

// export const UpdateSummery = mutation({
//     args: {
//         id: v.id('DiscussionRoom'),
//         summery: v.any()
//     },
//     handler: async (ctx, args) => {
//         await ctx.db.patch(args.id, {
//             summery: args.summery
//         })
//     }
// })

// convex/DiscussionRoom.js

// convex/DiscussionRoom.js

import { mutation, query } from "./_generated/server";
import { v } from "convex/values"

// --- Helper Function to get Convex User ID ---
const getUserId = async (ctx) => {
    // 1. Get the authenticated identity from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        console.error("DEBUG: Authentication Failed. ctx.auth.getUserIdentity() returned null.");
        return null; // Return null if not authenticated
    }

    const clerkUserId = identity.subject;

    // 2. CRITICAL FIX: Use the index name defined in the schema: 'by_clerk_user_id'
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_user_id", (q) => // <-- CORRECTED: Matches schema.js
            q.eq("clerkUserId", clerkUserId)  // <-- CORRECTED: Matches schema.js
        )
        .unique();

    if (!user) {
        // The UserSync component still needs to run to prevent this warning
        console.warn(`DEBUG: User authenticated (Clerk ID: ${clerkUserId}), but missing in Convex 'users' table.`);
    }

    // 3. Return the Convex ID (_id) or null
    return user ? user._id : null;
};
// ---------------------------------------------


export const CreateNewRoom = mutation({
    args: {
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        if (!userId) {
            // This error will be the final symptom until the user syncs successfully.
            throw new Error("User record not found in database. Please refresh or contact support.");
        }

        const result = await ctx.db.insert('DiscussionRoom', {
            coachingOption: args.coachingOption,
            topic: args.topic,
            expertName: args.expertName,
            uid: userId
        });

        return result;
    }
})

// ... (Rest of the file remains unchanged: GetDiscussionRoom, UpdateConversation, UpdateSummery)
export const GetDiscussionRoom = query({
    args: {
        id: v.id('DiscussionRoom')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
})

export const UpdateConversation = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        conversation: v.any()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            conversation: args.conversation
        })
    }
})

export const UpdateSummery = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        summery: v.any()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            summery: args.summery
        })
    }
})

export const GetAllDiscussionRoom = query({
    args: {
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('DiscussionRoom')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect()
        return result;
    }
})

