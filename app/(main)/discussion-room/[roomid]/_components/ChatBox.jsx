// import React, { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
// import { LoaderCircle } from 'lucide-react'
// import { useMutation } from 'convex/react';
// import { useParams } from 'next/navigation';
// import { api } from '@/convex/_generated/api'; //  Ensure API is imported for useMutation
// import { toast, Toaster } from 'sonner';

// //  Accept the new prop: generatedSummery
// function ChatBox({ conversation, enableFeedbackNotes, coachingOption, generatedSummery }) {

//     const [loading, setLoading] = useState(false);
//     const updateSummery = useMutation(api.DiscussionRoom.UpdateSummery)
//     const { roomid } = useParams();

//     const GenerateFeedbackNotes = async () => {
//         setLoading(true);
//         try {
//             // Check if summary is already generated to prevent unnecessary API calls
//             if (generatedSummery) {
//                 setLoading(false);
//                 return;
//             }

//             const result = await AIModelToGenerateFeedbackAndNotes(coachingOption, conversation);
//             console.log("Generated Feedback/Notes:", result.content);

//             await updateSummery({
//                 id: roomid,
//                 summery: result.content
//             })
//             toast('Feedback/Notes Saved!');

//             // The Convex useQuery in page.jsx will automatically refetch and update
//             // the generatedSummery prop, making the notes visible.
//         }
//         catch (e) {
//             console.error("Error generating or saving feedback/notes:", e);
//             toast('Internal server error, Try again')
//         }
//         finally {
//             setLoading(false);

//         }
//     }

//     return (
//         <div>
//             {/* The main chat container */}
//             <div className='h-[60vh] bg-secondary border rounded-xl flex flex-col justify-start p-4 bg-customGray relative overflow-auto scrollbar-hide '>
//                 {conversation.map((item, index) => (
//                     <div key={index} className={`flex ${item.role == 'user' && 'justify-end'}`}>
//                         {item.role == 'assistant' ?
//                             <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md'>{item.content}</h2>
//                             :
//                             <h2 className='p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md justify-end'>{item.content}</h2>}
//                     </div>
//                 ))}
//                 <p className='text-gray-900 leading-relaxed whitespace-pre-wrap'></p>
//             </div>

//             {/* 💡 Display the generated summary/feedback here if it exists */}
//             {generatedSummery && (
//                 <div className="mt-5 p-4 border rounded-xl bg-white shadow-lg">
//                     <h3 className="font-bold text-lg mb-2 text-primary">Generated Feedback/Notes:</h3>
//                     {/* Display the content, using a safe way to handle potential line breaks */}
//                     <p className="whitespace-pre-wrap text-sm">{generatedSummery}</p>
//                 </div>
//             )}

//             {/* Conditional Button/Message */}
//             {!enableFeedbackNotes ?
//                 <h2 className='mt-4 text-gray-400 text-sm'>
//                     At the end of your conversation we will automatically generate feedback/notes from your conversation
//                 </h2>
//                 :
//                 <Button
//                     onClick={GenerateFeedbackNotes}
//                     // Disable button if loading OR if summary is already generated
//                     disabled={loading || generatedSummery}
//                     className='mt-7 w-full'
//                 >
//                     {loading && <LoaderCircle className='animate-spin' />}
//                     {/* Change button text based on state */}
//                     {generatedSummery ? 'Feedback Generated' : 'Generate Feedback/Notes'}
//                 </Button>
//             }
//         </div>
//     )
// }

// export default ChatBox

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
import { LoaderCircle } from 'lucide-react'
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

function ChatBox({ conversation, enableFeedbackNotes, coachingOption, generatedSummery }) {

    const [loading, setLoading] = useState(false);
    const updateSummery = useMutation(api.DiscussionRoom.UpdateSummery)
    const { roomid } = useParams();

    const GenerateFeedbackNotes = async () => {
        setLoading(true);
        try {
            if (generatedSummery) return;

            // Call AI function — returns string directly
            const result = await AIModelToGenerateFeedbackAndNotes(coachingOption, conversation);
            console.log("Generated Feedback/Notes:", result);

            await updateSummery({
                id: roomid,
                summery: String(result) // ✅ ensure string
            });
            toast('Feedback/Notes Saved!');
        } catch (e) {
            console.error("Error generating or saving feedback/notes:", e);
            toast('Internal server error, Try again');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Main chat container */}
            <div className='h-[60vh] bg-secondary border rounded-xl flex flex-col justify-start p-4 bg-customGray relative overflow-auto scrollbar-hide'>
                {conversation.map((item, index) => (
                    <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <h2 className={`p-1 px-2 mt-2 inline-block rounded-md ${item.role === 'assistant' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                            {String(item.content)} {/* ✅ force string */}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Display generated feedback/notes */}
            {generatedSummery && (
                <div className="mt-5 p-4 border rounded-xl bg-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2 text-primary">Generated Feedback/Notes:</h3>
                    <p className="whitespace-pre-wrap text-sm">{String(generatedSummery)}</p> {/* ✅ force string */}
                </div>
            )}

            {/* Conditional button/message */}
            {!enableFeedbackNotes ?
                <h2 className='mt-4 text-gray-400 text-sm'>

                </h2>
                :
                <Button
                    onClick={GenerateFeedbackNotes}
                    disabled={loading || generatedSummery}
                    className='mt-7 w-full'
                >
                    {loading && <LoaderCircle className='animate-spin' />}
                    {generatedSummery ? 'Feedback Generated' : 'Generate Feedback/Notes'}
                </Button>
            }
        </div>
    )
}

export default ChatBox
