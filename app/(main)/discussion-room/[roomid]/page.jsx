// "use client";

// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// import { UserButton, useAuth } from '@clerk/nextjs';
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';
// import { Loader2Icon, Webcam } from 'lucide-react';


// // ASSUMPTION: You need to import your UserContext here
// import { UserContext } from '@/app/_context/UserContext';

// function DiscussionRoom() {
//   const { roomid } = useParams();

//   const { isLoaded: clerkLoaded } = useAuth();
//   const { userData, setUserData } = useContext(UserContext);

//   const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enableMic, setEnableMic] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [textInput, setTextInput] = useState('');
//   const [forceMicRestart, setForceMicRestart] = useState(false);

//   const abortControllerRef = useRef(null);
//   const [latestAiResponse, setLatestAiResponse] = useState(null);

//   const recognition = useRef(null);

//   const [transcribe, setTranscribe] = useState('');
//   const [conversation, setConversation] = useState([]);

//   const [preferredVoice, setPreferredVoice] = useState(null);
//   const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
//   const videoRef = useRef(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);


//   //  NEW FUNCTION TO EXPLICITLY STOP THE WEBCAM STREAM
//   const stopWebcamStream = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null; // Clear the reference
//       console.log("Webcam stream manually stopped.");
//     }
//   };
//   //  END OF NEW FUNCTION

//   const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
//   const updateUserToken = useMutation(api.users.UpdateUserToken)


//   const updateUserTokenMethod = async (text) => {
//     // Basic check for valid string and user data
//     if (!text || typeof text !== 'string' || !userData || !userData._id || userData.credits === undefined) {
//       return;
//     }

//     // Calculate token count (approx word count)
//     const tokenCount = text.trim().split(/\s+/).length;

//     if (tokenCount === 0) return;

//     const currentCredits = Number(userData.credits);
//     const newCredits = Math.max(0, currentCredits - tokenCount);

//     try {
//       const result = await updateUserToken({
//         id: userData._id,
//         credits: newCredits
//       });

//       // Update local context state on success
//       setUserData(prev => ({
//         ...prev,
//         credits: newCredits
//       }));
//       console.log(`Deducted ${tokenCount} tokens. New balance: ${newCredits}`);

//     } catch (error) {
//       console.error("Failed to update user tokens in Convex:", error);
//     }
//   };



//   // Voice loading useEffect (No change)
//   useEffect(() => {
//     if ('speechSynthesis' in window) {
//       const setVoice = () => {
//         const voices = window.speechSynthesis.getVoices();
//         if (voices.length === 0) return;

//         const preferredNames = [
//           'Google US English',
//           'Google UK English Female',
//           'Microsoft Zira - English (United States)'
//         ];

//         let selectedVoice = voices.find(v => preferredNames.includes(v.name));

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
//         }

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en'));
//         }

//         setPreferredVoice(selectedVoice);
//       };

//       if (window.speechSynthesis.onvoiceschanged !== undefined) {
//         window.speechSynthesis.onvoiceschanged = setVoice;
//       }
//       setVoice();
//     }
//   }, []);


//   // Data Initialization useEffect
//   useEffect(() => {
//     if (DiscussionRoomData) {
//       if (!DiscussionRoomData.conversation) {
//         setConversation([]);
//       } else {
//         setConversation(DiscussionRoomData.conversation);
//       }

//       const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   //  SIMPLE WEBCAM INITIALIZATION useEffect (Camera ON/OFF)
//   useEffect(() => {
//     // Exit if ref is not ready or data is missing
//     if (!videoRef.current || !DiscussionRoomData) return;

//     const currentOption = DiscussionRoomData.coachingOption?.toLowerCase();
//     const isMockInterview = currentOption?.includes('interview');

//     // Logic to START the stream
//     if (isMockInterview) {
//       // Only attempt to start if no stream is currently assigned
//       if (!videoRef.current.srcObject) {
//         navigator.mediaDevices.getUserMedia({ video: true })
//           .then(stream => {
//             if (videoRef.current) {
//               videoRef.current.srcObject = stream;
//               console.log("✅ Webcam stream started for mock interview.");
//             } else {
//               // Handle case where component unmounts quickly
//               stream.getTracks().forEach(track => track.stop());
//             }
//           })
//           .catch(error => {
//             console.error("❌ Webcam access denied or failed:", error);
//             alert("Webcam access denied. Please enable it in your browser settings for the mock interview.");
//           });
//       }
//     } else {
//       // Stop the stream if the option is not 'interview'
//       stopWebcamStream();
//     }

//     // Cleanup function: This is the ultimate guarantee that runs on component UNMOUNT
//     return () => {
//       stopWebcamStream();
//     };

//   }, [DiscussionRoomData]); // Depends only on DiscussionRoomData
//   //  END SIMPLE WEBCAM INITIALIZATION useEffect


//   // STT Logic useEffect (Corrected call to use finalTrimmedText string)
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Browser does not support the Web Speech API.");
//       return;
//     }

//     const startRecognition = () => {
//       if (recognition.current && recognition.current.state === 'listening') return;

//       const newRecognition = new SpeechRecognition();
//       newRecognition.continuous = true;
//       newRecognition.interimResults = true;
//       newRecognition.lang = 'en-IN'
//       newRecognition.maxAlternatives = 5;


//       //  NEW ACCURACY BOOST: Provide a vocabulary list (Grammar)
//       if ('SpeechGrammarList' in window) {
//         const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
//         const grammarList = new SpeechGrammarList();

//         // Define a list of important words/phrases (e.g., technical terms, expert name)
//         const expertName = expert?.name || 'expert';
//         const coachingTerms = "JavaScript, React, Next.js, Convex, Clerk, API, debugging, deployment, scaling, serverless, full-stack, backend, python, C langauge, Teach me , Hello";

//         const grammar = `#JSGF V1.0; grammar terms; public <term> = ${expertName} | ${coachingTerms.split(',').join(' | ')} ;`;
//         grammarList.addFromString(grammar, 1); // 1 is high weight

//         newRecognition.grammars = grammarList;
//         console.log("Added custom speech grammar.");
//       }
//       //  END OF GRAMMAR BOOST


//       //  NEW ACCURACY BOOST SETTINGS
//       try {
//         newRecognition.audioThrottle = 50;           // smoother mic data
//         newRecognition.noiseSuppression = true;      // cleaner speech
//         newRecognition.echoCancellation = true;      // removes echo
//         newRecognition.autoGainControl = true;       // fixes volume issues
//       } catch (e) { console.log('Advanced STT properties not supported by browser.'); }

//       //  REDUCE "no-speech" random errors
//       newRecognition.pauseThreshold = 0.3;
//       newRecognition.idleTimeout = 5000;
//       newRecognition.continuousTimeout = 60000

//       recognition.current = newRecognition;

//       newRecognition.onstart = () => {

//         //  FIX 2: Stop any ongoing AI speech immediately when the microphone starts listening
//         if ('speechSynthesis' in window) {
//           window.speechSynthesis.cancel();
//         }

//         console.log("✅ Speech recognition started. Waiting for input...");
//         if (forceMicRestart) setForceMicRestart(false);
//       };

//       newRecognition.onresult = async (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript;
//           } else {
//             interimTranscript += transcript;
//           }
//         }
//         setTranscribe(interimTranscript.trim());

//         if (finalTranscript.trim()) {
//           const finalTrimmedText = finalTranscript.trim();
//           console.log("Final Transcript captured:", finalTrimmedText);

//           if (enableMic) {
//             setConversation(prev => [...prev, {
//               role: 'user',
//               content: finalTrimmedText,
//             }]);
//           }
//           setTranscribe('');

//           await updateUserTokenMethod(finalTrimmedText);
//         }

//       };

//       newRecognition.onerror = (event) => {
//         if (event.error === 'aborted' || event.error === 'no-speech') {
//           console.log(`Speech recognition safe error: ${event.error}`);
//           return;
//         }

//         console.error(" Speech recognition error:", event.error);
//         if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           alert('Microphone permission denied. Please enable it in your browser settings.');
//         }
//         setEnableMic(false);
//         if (recognition.current) {
//           recognition.current.abort();
//         }
//       };

//       newRecognition.onend = () => {
//         console.log(" Speech recognition ended.");
//       };

//       newRecognition.start();
//     };

//     const stopRecognition = () => {
//       if (recognition.current) {
//         const currentRec = recognition.current;
//         recognition.current = null;
//         if (currentRec.state !== 'inactive') {
//           currentRec.abort();
//         }
//         console.log("Recognition instance stopped.");
//       }
//     };

//     if (enableMic && !loading) {
//       if (!recognition.current || forceMicRestart) {
//         stopRecognition();
//         startRecognition();
//       }
//     } else {
//       stopRecognition();
//     }

//     return () => {
//       stopRecognition();
//     };
//   }, [enableMic, loading, forceMicRestart, updateUserTokenMethod]);




//   //  FIX: AI Model call useEffect with AbortController fix
//   useEffect(() => {
//     let activeController = null;

//     async function fetchData() {
//       if (!DiscussionRoomData || !clerkLoaded) {
//         return;
//       }

//       const lastMessage = conversation[conversation.length - 1];
//       if (conversation.length > 0 &&
//         lastMessage.role === 'user' &&
//         lastMessage.content) {

//         //  FIX 1: Abort previous request if a new user message arrives quickly
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//           abortControllerRef.current = null;
//           console.log("Previous Gemini API call aborted for new request.");
//         }

//         setLoading(true);

//         if (recognition.current) {
//           recognition.current.abort();
//           recognition.current = null;
//           console.log("STT forcefully stopped for API call.");
//         }

//         const conversationHistory = conversation;

//         // Create a new controller for this request
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         activeController = controller; // Local reference for current fetch operation
//         const signal = controller.signal;

//         try {
//           const aiResp = await AIModel(
//             DiscussionRoomData.topic,
//             DiscussionRoomData.coachingOption,
//             conversationHistory,
//             signal
//           );

//           // FIX 2: Only proceed if the request was NOT aborted
//           if (signal.aborted) {
//             console.log('Gemini API call was aborted after response was received. Skipping further processing.');
//             return;
//           }

//           if (aiResp === null || typeof aiResp !== 'string') {
//             console.warn("AI Model returned null or non-string response:", aiResp);
//             setLoading(false);
//             return;
//           }

//           // Deduct tokens for the AI's response
//           await updateUserTokenMethod(aiResp);

//           const aiMessageObject = {
//             role: 'assistant',
//             content: aiResp
//           };

//           const newConversation = [...conversation, aiMessageObject];
//           setConversation(newConversation);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversation
//               });
//               console.log(" Conversation saved successfully to Convex.");
//             } catch (convexSaveError) {
//               console.error(" CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
//             }
//           }

//           setLatestAiResponse(aiResp);

//         } catch (error) {
//           //  FIX 3: Check for AbortError explicitly and handle silently
//           if (error.name === 'AbortError') {
//             console.log('Gemini API call was intentionally aborted.');
//             // Do NOT set loading to false or show an error message, as the abort was intentional (e.g., component unmount or new conversation started)
//             return;
//           }

//           // Handle all other API/network errors
//           console.error(' ERROR during AI model call:', error);

//           const errorMessage = "I'm sorry, I'm having trouble connecting to the expert right now (API error). Please try again in a moment.";

//           const aiErrorResponse = { role: 'assistant', content: errorMessage };

//           const newConversationWithError = [...conversation, aiErrorResponse];
//           setConversation(newConversationWithError);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversationWithError
//               });
//               console.log(" Conversation (with error message) saved successfully to Convex.");
//             } catch (convexError) {
//               console.error(" CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
//             }
//           }

//           setLatestAiResponse(errorMessage);
//         } finally {
//           //  FIX 4: Only clear the ref if it matches the current controller,
//           // preventing race conditions where a newer request's controller is accidentally cleared.
//           if (abortControllerRef.current === activeController) {
//             abortControllerRef.current = null;
//           }
//         }
//       }
//     }

//     fetchData();

//     //  FIX 5: The cleanup function now checks if a controller exists and runs abort.
//     // The AbortError is now correctly handled in the try/catch block above, preventing the console error.
//     return () => {
//       if (activeController) {
//         activeController.abort();
//       }
//     };

//   }, [conversation, DiscussionRoomData, UpdateConversation, updateUserTokenMethod, clerkLoaded]
//   );


//   // Text-to-Speech (TTS) useEffect (FINAL FIXED VERSION)
//   useEffect(() => {

//     //  Always cancel previous speech FIRST — (Fix for "DO NOT BLOCK TTS")
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     setIsSpeaking(false);

//     //  Now safely check for latestAiResponse
//     if (latestAiResponse) {

//       if ('speechSynthesis' in window) {

//         const cleanedResponse = latestAiResponse
//           .replace(/(\*\*|\*|#|\n)/g, '')
//           .replace(/(\s\-\s)/g, ', ')
//           .replace(/(\d+)\.\s?/g, '$1. ');

//         const utterance = new SpeechSynthesisUtterance(cleanedResponse);

//         if (preferredVoice) {
//           utterance.voice = preferredVoice;
//         }

//         utterance.rate = 0.7;

//         utterance.onend = () => {
//           setLoading(false);
//           setLatestAiResponse(null);
//           setIsSpeaking(false);

//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//         };

//         utterance.onerror = () => {
//           setLatestAiResponse(null);
//           setIsSpeaking(false);

//           if (enableMic) {
//             setForceMicRestart(true);
//           }

//           setLoading(false);
//         };

//         if (recognition.current) {
//           recognition.current.abort();
//         }

//         window.speechSynthesis.speak(utterance);
//         setIsSpeaking(true);
//       }

//     }

//     // Cleanup
//     return () => {
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }
//     };

//   }, [latestAiResponse, preferredVoice, enableMic]);


//   const connectToServer = () => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     setEnableMic(true);
//   };


//   // Disconnect function (No change)
//   const disconnect = async (e) => {
//     e.preventDefault();

//     setEnableMic(false);
//     setForceMicRestart(false);
//     setLoading(false);

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       abortControllerRef.current = null;
//     }

//     if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel();
//     }

//     try {
//       if (DiscussionRoomData?._id) {
//         await UpdateConversation({
//           id: DiscussionRoomData._id,
//           conversation: conversation
//         });
//         console.log("Conversation saved successfully on disconnect.");
//       }
//     } catch (error) {
//       console.error("Failed to save conversation on disconnect:", error);
//     }
//     stopWebcamStream();
//     setEnableFeedbackNotes(true);
//   };


//   // Text input submission handler
//   const handleTextSubmit = async (e) => {
//     e.preventDefault();
//     const text = textInput.trim();
//     if (text !== '') {

//       //  FIX 1: Stop any ongoing AI speech immediately upon sending a new message
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }

//       //  FIX: Keep mic ON so Disconnect button remains visible
//       setEnableMic(true);

//       // Deduct tokens for the user's text input
//       await updateUserTokenMethod(text);

//       setConversation(prev => [...prev, {
//         role: 'user',
//         content: text,
//       }]);
//       setTextInput('');
//     }
//   };


//   // Hydration check render guard (Waiting for data/context to load)
//   if (!clerkLoaded || DiscussionRoomData === undefined || userData === undefined) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <Loader2Icon className='animate-spin mr-2' /> Loading Session...
//       </div>
//     );
//   }

//   // Render Logic
//   return (

//     < div className='-mt-28' >
//       <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2 '>
//           <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center bg-customGray relative'>
//             <Image
//               src={expert?.avatar || "/default-avatar.jpg"}
//               alt='Avatar'
//               width={200}
//               height={200}
//               className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
//             />
//             <h2 className='text-gray-700'>
//               {expert?.name}
//             </h2>

//             {/*  NEW: Status Indicator */}
//             {loading && !isSpeaking && (
//               <p className='text-sm text-yellow-600 mt-2 flex items-center'>
//                 <Loader2Icon className='w-4 h-4 mr-1 animate-spin' /> Expert is thinking...
//               </p>
//             )}
//             {isSpeaking && (
//               <p className='text-sm text-green-600 mt-2 flex items-center'>
//                 🔊 Expert is speaking...
//               </p>
//             )}

//             {/*  INSERT YOUR WEBCAM CODE BLOCK HERE */}
//             {DiscussionRoomData?.coachingOption?.toLowerCase().includes('interview') && (
//               <div className='absolute bottom-10 right-10 z-10'>
//                 <div className={`relative rounded-2xl border-4 border-white shadow-lg`}>
//                   <video
//                     id="user-webcam-feed"
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     height={80}
//                     width={130}
//                     className={`rounded-2xl`}
//                   />

//                 </div>
//               </div>
//             )}
//             <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
//               <UserButton />
//             </div>
//           </div>
//           <div className='mt-5 flex items-center justify-center'>
//             {!enableMic ?
//               <Button onClick={connectToServer} disabled={loading}>
//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Connect
//               </Button>

//               // <Button variant="destructive" onClick={disconnect} disabled={loading && !abortControllerRef.current}>
//               :
//               <Button variant="destructive" onClick={disconnect} >

//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Disconnect
//               </Button>
//             }
//           </div>
//         </div>
//         <div>
//           <ChatBox
//             conversation={conversation}
//             enableFeedbackNotes={enableFeedbackNotes}
//             coachingOption={DiscussionRoomData?.coachingOption}
//             generatedSummery={DiscussionRoomData?.summery}
//           />
//         </div>
//       </div>

//       <form onSubmit={handleTextSubmit} className='mt-5 flex items-center justify-center space-x-2'>
//         <input
//           type='text'
//           value={textInput}
//           onChange={(e) => setTextInput(e.target.value)}
//           placeholder='Type your message here...'
//           className='flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//           disabled={loading} // Disable text input while AI is processing
//         />
//         <Button type='submit' disabled={loading || textInput.trim() === ''}>Send</Button>
//       </form>
//     </div >
//   );
// }

// export default DiscussionRoom;


// "use client";
// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// //  CRITICAL FIX 1: Import useAuth for hydration check
// import { UserButton, useAuth } from '@clerk/nextjs';
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';
// import { Loader2Icon } from 'lucide-react';
// import { UserContext } from '@/app/_context/UserContext';

// async function DiscussionRoom() {
//   const { roomid } = useParams();
//   //  CRITICAL FIX 1: Get isLoaded from useAuth for hydration safety
//   const { isLoaded: clerkLoaded } = useAuth();
//   const { userData, setUserData } = useContext(UserContext);
//   const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enableMic, setEnableMic] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [textInput, setTextInput] = useState('');
//   const [forceMicRestart, setForceMicRestart] = useState(false);

//   const abortControllerRef = useRef(null);
//   const [latestAiResponse, setLatestAiResponse] = useState(null);

//   const recognition = useRef(null);

//   const [transcribe, setTranscribe] = useState('');
//   const [conversation, setConversation] = useState([]);

//   const [preferredVoice, setPreferredVoice] = useState(null);
//   const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
//   const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
//   const updateUserToken = useMutation(api.users.UpdateUserToken)

//   // Voice loading useEffect (No change)
//   useEffect(() => {
//     // ... (Voice loading logic remains the same)
//     if ('speechSynthesis' in window) {
//       const setVoice = () => {
//         const voices = window.speechSynthesis.getVoices();
//         if (voices.length === 0) return;

//         const preferredNames = [
//           'Google US English',
//           'Google UK English Female',
//           'Microsoft Zira - English (United States)'
//         ];

//         let selectedVoice = voices.find(v => preferredNames.includes(v.name));

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
//         }

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en'));
//         }

//         setPreferredVoice(selectedVoice);
//       };

//       if (window.speechSynthesis.onvoiceschanged !== undefined) {
//         window.speechSynthesis.onvoiceschanged = setVoice;
//       }
//       setVoice();
//     }
//   }, []);


//   // Data Initialization useEffect (No change)
//   useEffect(() => {
//     if (DiscussionRoomData) {
//       if (!DiscussionRoomData.conversation) {
//         setConversation([]);
//       } else {
//         setConversation(DiscussionRoomData.conversation);
//       }

//       const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   // STT Logic useEffect (No change)
//   useEffect(() => {
//     // ... (STT logic remains the same)
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Browser does not support the Web Speech API.");
//       return;
//     }

//     const startRecognition = () => {
//       if (recognition.current && recognition.current.state === 'listening') return;

//       const newRecognition = new SpeechRecognition();
//       newRecognition.continuous = false;
//       newRecognition.interimResults = true;
//       newRecognition.lang = 'en-US';
//       newRecognition.maxAlternatives = 1;

//       recognition.current = newRecognition;

//       newRecognition.onstart = () => {
//         console.log("✅ Speech recognition started. Waiting for input...");
//         if (forceMicRestart) setForceMicRestart(false);
//       };

//       newRecognition.onresult = async (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript;
//           } else {
//             interimTranscript += transcript;
//           }
//         }
//         setTranscribe(interimTranscript.trim());

//         if (finalTranscript.trim()) {
//           console.log("Final Transcript captured:", finalTranscript.trim());

//           if (enableMic) {
//             setConversation(prev => [...prev, {
//               role: 'user',
//               content: finalTranscript.trim(),
//             }]);
//           }
//           setTranscribe('');
//         }
//         await updateUserTokenMethod(finalTranscript.trim); //Update user generate Token

//       };

//       newRecognition.onerror = (event) => {
//         if (event.error === 'aborted' || event.error === 'no-speech') {
//           console.log(`Speech recognition safe error: ${event.error}`);
//           return;
//         }

//         console.error(" Speech recognition error:", event.error);
//         if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           alert('Microphone permission denied. Please enable it in your browser settings.');
//         }
//         setEnableMic(false);
//         if (recognition.current) {
//           recognition.current.abort();
//         }
//       };

//       newRecognition.onend = () => {
//         console.log(" Speech recognition ended.");
//       };

//       newRecognition.start();
//     };

//     const stopRecognition = () => {
//       if (recognition.current) {
//         const currentRec = recognition.current;
//         recognition.current = null;
//         if (currentRec.state !== 'inactive') {
//           currentRec.abort();
//         }
//         console.log("Recognition instance stopped.");
//       }
//     };

//     if (enableMic && !loading) {
//       if (!recognition.current || forceMicRestart) {
//         stopRecognition();
//         startRecognition();
//       }
//     } else {
//       stopRecognition();
//     }

//     return () => {
//       stopRecognition();
//     };
//   }, [enableMic, loading, forceMicRestart]);

//   // AI Model call useEffect
//   useEffect(() => {
//     async function fetchData() {
//       if (!DiscussionRoomData || !clerkLoaded) { // Wait for Clerk data before proceeding
//         return;
//       }

//       // Check if the last message is from the user AND content is defined (prevents running on initial load/bad data)
//       const lastMessage = conversation[conversation.length - 1];
//       if (conversation.length > 0 &&
//         lastMessage.role === 'user' &&
//         lastMessage.content) {

//         setLoading(true);

//         if (recognition.current) {
//           recognition.current.abort();
//           recognition.current = null;
//           console.log("STT forcefully stopped for API call.");
//         }

//         // 🛑 FIX 2: Send the entire conversation history for context, not just the last two.
//         // The AI model needs context for a good response. If performance is bad, optimize in AIModel.js.
//         const conversationHistory = conversation;

//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         const signal = controller.signal;

//         try {
//           const aiResp = await AIModel(
//             DiscussionRoomData.topic,
//             DiscussionRoomData.coachingOption,
//             conversationHistory, // ✅ Using full history
//             signal
//           );

//           if (aiResp === null || typeof aiResp !== 'string') {
//             console.warn("AI Model returned null or non-string response:", aiResp);
//             setLoading(false);
//             return;
//           }

//           //  FIX 3: Wrap the raw string response in a message object
//           await updateUserTokenMethod(aiResp);
//           const aiMessageObject = {
//             role: 'assistant',
//             content: aiResp
//           };

//           const newConversation = [...conversation, aiMessageObject];
//           setConversation(newConversation);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversation
//               });
//               console.log(" Conversation saved successfully to Convex.");
//             } catch (convexSaveError) {
//               console.error(" CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
//             }
//           }

//           // Set the string content for TTS. This is the source of the repeated messages if not carefully handled.
//           setLatestAiResponse(aiResp);

//         } catch (error) {
//           if (error.name === 'AbortError') {
//             console.log('Gemini API call was intentionally aborted by user.');
//           } else {
//             console.error(' ERROR during AI model call:', error);

//             const errorMessage = "I'm sorry, I'm having trouble connecting to the expert right now (API error). Please try again in a moment.";

//             const aiErrorResponse = { role: 'assistant', content: errorMessage };

//             const newConversationWithError = [...conversation, aiErrorResponse];
//             setConversation(newConversationWithError);

//             if (DiscussionRoomData._id) {
//               try {
//                 await UpdateConversation({
//                   id: DiscussionRoomData._id,
//                   conversation: newConversationWithError
//                 });
//                 console.log(" Conversation (with error message) saved successfully to Convex.");
//               } catch (convexError) {
//                 console.error(" CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
//               }
//             }

//             setLatestAiResponse(errorMessage);
//           }
//         } finally {
//           abortControllerRef.current = null;
//           // Loading is set to false in the TTS onend/onerror handlers
//         }
//       }
//     }

//     fetchData();

//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//         abortControllerRef.current = null;
//       }
//     };

//   }, [conversation, DiscussionRoomData, UpdateConversation, latestAiResponse, clerkLoaded]

//   );

//   // await updateUserTokenMethod(latestAiResponse); //update AI generated TOKEN

//   // Text-to-Speech (TTS) useEffect (No change)
//   useEffect(() => {
//     // ... (TTS logic remains the same)
//     if (latestAiResponse) {
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }

//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(latestAiResponse);

//         if (preferredVoice) {
//           utterance.voice = preferredVoice;
//         }

//         utterance.rate = 0.8;

//         utterance.onend = () => {
//           setLoading(false);
//           setLatestAiResponse(null);

//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//         };

//         utterance.onerror = (event) => {
//           console.error("Web Speech TTS Error:", event.error);
//           setLatestAiResponse(null);

//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//           setLoading(false);
//         };

//         if (recognition.current) {
//           recognition.current.abort();
//         }

//         window.speechSynthesis.speak(utterance);
//       } else {
//         console.warn("Browser does not support Web Speech Synthesis (TTS).");
//         setLoading(false);
//         setLatestAiResponse(null);
//         if (enableMic) setForceMicRestart(true);
//       }
//     }

//     return () => {
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [latestAiResponse, preferredVoice, enableMic]);


//   const connectToServer = () => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     setEnableMic(true);
//   };



//   // Disconnect function (No change)
//   const disconnect = async (e) => {
//     e.preventDefault();


//     setEnableMic(false);
//     setForceMicRestart(false);
//     setLoading(false);

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       abortControllerRef.current = null;
//     }

//     if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel();
//     }

//     try {
//       if (DiscussionRoomData?._id) {
//         await UpdateConversation({
//           id: DiscussionRoomData._id,
//           conversation: conversation
//         });
//         console.log("Conversation saved successfully on disconnect.");
//       }
//     } catch (error) {
//       console.error("Failed to save conversation on disconnect:", error);
//     }

//     setEnableFeedbackNotes(true);
//   };

//   const updateUserTokenMethod = async (text) => {
//     const tokenCount = text.trim() ? text.trim().spliy(/\s+/).length : 0
//     const result = await updateUserToken({
//       id: userData._id,
//       credits: Number(userData.credits) - Number(tokenCount)
//     })

//     setUserData(prev => ({
//       ...prev,
//       credits: Number(userData.credits) - Number(tokenCount)
//     }))
//   }

//   const handleTextSubmit = (e) => {
//     e.preventDefault();
//     if (textInput.trim() !== '') {
//       setConversation(prev => [...prev, {
//         role: 'user',
//         content: textInput.trim(),
//       }]);
//       setTextInput('');
//     }
//   };

//   //  CRITICAL FIX 1: Hydration check render guard
//   if (!clerkLoaded) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <Loader2Icon className='animate-spin mr-2' /> Loading Session...
//       </div>
//     );
//   }

//   // Render Logic
//   return (

//     < div className='-mt-28' >
//       <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2 '>
//           <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center bg-customGray relative'>
//             <Image
//               src={expert?.avatar || "/default-avatar.jpg"}
//               alt='Avatar'
//               width={200}
//               height={200}
//               className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
//             />
//             <h2 className='text-gray-700'>
//               {expert?.name}
//             </h2>
//             <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
//               <UserButton />
//             </div>
//           </div>
//           <div className='mt-5 flex items-center justify-center'>
//             {!enableMic ?
//               <Button onClick={connectToServer} disabled={loading}>
//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Connect
//               </Button>
//               :
//               <Button variant="destructive" onClick={disconnect} disabled={loading && !abortControllerRef.current}>
//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Disconnect
//               </Button>
//             }
//           </div>
//         </div>
//         <div>
//           <ChatBox
//             conversation={conversation}
//             enableFeedbackNotes={enableFeedbackNotes}
//             coachingOption={DiscussionRoomData?.coachingOption}
//             generatedSummery={DiscussionRoomData?.summery}
//           />
//         </div>
//       </div>

//       <form onSubmit={handleTextSubmit} className='mt-5 flex items-center justify-center space-x-2'>
//         <input
//           type='text'
//           value={textInput}
//           onChange={(e) => setTextInput(e.target.value)}
//           placeholder='Type your message here...'
//           className='flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//         />
//         <Button type='submit'>Send</Button>
//       </form>
//     </div >
//   );
// }

// export default DiscussionRoom;






// "use client";

// import React, { useEffect, useRef, useState, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// import { UserButton, useAuth } from '@clerk/nextjs';
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';
// import { Loader2Icon, Webcam } from 'lucide-react';

// // ASSUMPTION: You need to import your UserContext here
// import { UserContext } from '@/app/_context/UserContext';

// function DiscussionRoom() {
//   const { roomid } = useParams();

//   const { isLoaded: clerkLoaded } = useAuth();
//   const { userData, setUserData } = useContext(UserContext);

//   const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enableMic, setEnableMic] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [textInput, setTextInput] = useState('');
//   const [forceMicRestart, setForceMicRestart] = useState(false);

//   const abortControllerRef = useRef(null);
//   const [latestAiResponse, setLatestAiResponse] = useState(null);

//   const recognition = useRef(null);

//   const [transcribe, setTranscribe] = useState('');
//   const [conversation, setConversation] = useState([]);

//   const [preferredVoice, setPreferredVoice] = useState(null);
//   const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
//   const videoRef = useRef(null);
//   const [isSpeaking, setIsSpeaking] = useState(false);


//   // 🛑 NEW FUNCTION TO EXPLICITLY STOP THE WEBCAM STREAM
//   const stopWebcamStream = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null; // Clear the reference
//       console.log("Webcam stream manually stopped.");
//     }
//   };
//   // 🛑 END OF NEW FUNCTION

//   const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
//   const updateUserToken = useMutation(api.users.UpdateUserToken)


//   const updateUserTokenMethod = async (text) => {
//     // Basic check for valid string and user data
//     if (!text || typeof text !== 'string' || !userData || !userData._id || userData.credits === undefined) {
//       return;
//     }

//     // Calculate token count (approx word count)
//     const tokenCount = text.trim().split(/\s+/).length;

//     if (tokenCount === 0) return;

//     const currentCredits = Number(userData.credits);
//     const newCredits = Math.max(0, currentCredits - tokenCount);

//     try {
//       const result = await updateUserToken({
//         id: userData._id,
//         credits: newCredits
//       });

//       // Update local context state on success
//       setUserData(prev => ({
//         ...prev,
//         credits: newCredits
//       }));
//       console.log(`Deducted ${tokenCount} tokens. New balance: ${newCredits}`);

//     } catch (error) {
//       console.error("Failed to update user tokens in Convex:", error);
//     }
//   };



//   // Voice loading useEffect (No change)
//   useEffect(() => {
//     if ('speechSynthesis' in window) {
//       const setVoice = () => {
//         const voices = window.speechSynthesis.getVoices();
//         if (voices.length === 0) return;

//         const preferredNames = [
//           'Google US English',
//           'Google UK English Female',
//           'Microsoft Zira - English (United States)'
//         ];

//         let selectedVoice = voices.find(v => preferredNames.includes(v.name));

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
//         }

//         if (!selectedVoice) {
//           selectedVoice = voices.find(v => v.lang.startsWith('en'));
//         }

//         setPreferredVoice(selectedVoice);
//       };

//       if (window.speechSynthesis.onvoiceschanged !== undefined) {
//         window.speechSynthesis.onvoiceschanged = setVoice;
//       }
//       setVoice();
//     }
//   }, []);


//   // Data Initialization useEffect
//   useEffect(() => {
//     if (DiscussionRoomData) {
//       if (!DiscussionRoomData.conversation) {
//         setConversation([]);
//       } else {
//         setConversation(DiscussionRoomData.conversation);
//       }

//       const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   // 🛑 SIMPLE WEBCAM INITIALIZATION useEffect (Camera ON/OFF)
//   useEffect(() => {
//     // Exit if ref is not ready or data is missing
//     if (!videoRef.current || !DiscussionRoomData) return;

//     const currentOption = DiscussionRoomData.coachingOption?.toLowerCase();
//     const isMockInterview = currentOption?.includes('interview');

//     // Logic to START the stream
//     if (isMockInterview) {
//       // Only attempt to start if no stream is currently assigned
//       if (!videoRef.current.srcObject) {
//         navigator.mediaDevices.getUserMedia({ video: true })
//           .then(stream => {
//             if (videoRef.current) {
//               videoRef.current.srcObject = stream;
//               console.log("✅ Webcam stream started for mock interview.");
//             } else {
//               // Handle case where component unmounts quickly
//               stream.getTracks().forEach(track => track.stop());
//             }
//           })
//           .catch(error => {
//             console.error("❌ Webcam access denied or failed:", error);
//             alert("Webcam access denied. Please enable it in your browser settings for the mock interview.");
//           });
//       }
//     } else {
//       // Stop the stream if the option is not 'interview'
//       stopWebcamStream();
//     }

//     // Cleanup function: This is the ultimate guarantee that runs on component UNMOUNT
//     return () => {
//       stopWebcamStream();
//     };

//   }, [DiscussionRoomData]); // Depends only on DiscussionRoomData
//   // 🛑 END SIMPLE WEBCAM INITIALIZATION useEffect


//   // STT Logic useEffect (Corrected call to use finalTrimmedText string)
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Browser does not support the Web Speech API.");
//       return;
//     }

//     const startRecognition = () => {
//       if (recognition.current && recognition.current.state === 'listening') return;

//       const newRecognition = new SpeechRecognition();
//       newRecognition.continuous = false;
//       newRecognition.interimResults = true;
//       newRecognition.lang = 'en-US';
//       newRecognition.maxAlternatives = 1;

//       recognition.current = newRecognition;

//       newRecognition.onstart = () => {

//         // 🛑 FIX 2: Stop any ongoing AI speech immediately when the microphone starts listening
//         if ('speechSynthesis' in window) {
//           window.speechSynthesis.cancel();
//         }

//         console.log("✅ Speech recognition started. Waiting for input...");
//         if (forceMicRestart) setForceMicRestart(false);
//       };

//       newRecognition.onresult = async (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript;
//           } else {
//             interimTranscript += transcript;
//           }
//         }
//         setTranscribe(interimTranscript.trim());

//         if (finalTranscript.trim()) {
//           const finalTrimmedText = finalTranscript.trim();
//           console.log("Final Transcript captured:", finalTrimmedText);

//           if (enableMic) {
//             setConversation(prev => [...prev, {
//               role: 'user',
//               content: finalTrimmedText,
//             }]);
//           }
//           setTranscribe('');

//           await updateUserTokenMethod(finalTrimmedText);
//         }

//       };

//       newRecognition.onerror = (event) => {
//         if (event.error === 'aborted' || event.error === 'no-speech') {
//           console.log(`Speech recognition safe error: ${event.error}`);
//           return;
//         }

//         console.error(" Speech recognition error:", event.error);
//         if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           alert('Microphone permission denied. Please enable it in your browser settings.');
//         }
//         setEnableMic(false);
//         if (recognition.current) {
//           recognition.current.abort();
//         }
//       };

//       newRecognition.onend = () => {
//         console.log(" Speech recognition ended.");
//       };

//       newRecognition.start();
//     };

//     const stopRecognition = () => {
//       if (recognition.current) {
//         const currentRec = recognition.current;
//         recognition.current = null;
//         if (currentRec.state !== 'inactive') {
//           currentRec.abort();
//         }
//         console.log("Recognition instance stopped.");
//       }
//     };

//     if (enableMic && !loading) {
//       if (!recognition.current || forceMicRestart) {
//         stopRecognition();
//         startRecognition();
//       }
//     } else {
//       stopRecognition();
//     }

//     return () => {
//       stopRecognition();
//     };
//   }, [enableMic, loading, forceMicRestart, updateUserTokenMethod]);

//   // 🎯 FIX: AI Model call useEffect with AbortController fix
//   useEffect(() => {
//     let activeController = null;

//     async function fetchData() {
//       if (!DiscussionRoomData || !clerkLoaded) {
//         return;
//       }

//       const lastMessage = conversation[conversation.length - 1];
//       if (conversation.length > 0 &&
//         lastMessage.role === 'user' &&
//         lastMessage.content) {

//         // 🎯 FIX 1: Abort previous request if a new user message arrives quickly
//         if (abortControllerRef.current) {
//           abortControllerRef.current.abort();
//           abortControllerRef.current = null;
//           console.log("Previous Gemini API call aborted for new request.");
//         }

//         setLoading(true);

//         if (recognition.current) {
//           recognition.current.abort();
//           recognition.current = null;
//           console.log("STT forcefully stopped for API call.");
//         }

//         const conversationHistory = conversation;

//         // Create a new controller for this request
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         activeController = controller; // Local reference for current fetch operation
//         const signal = controller.signal;

//         try {
//           const aiResp = await AIModel(
//             DiscussionRoomData.topic,
//             DiscussionRoomData.coachingOption,
//             conversationHistory,
//             signal
//           );

//           // 🎯 FIX 2: Only proceed if the request was NOT aborted
//           if (signal.aborted) {
//             console.log('Gemini API call was aborted after response was received. Skipping further processing.');
//             return;
//           }

//           if (aiResp === null || typeof aiResp !== 'string') {
//             console.warn("AI Model returned null or non-string response:", aiResp);
//             setLoading(false);
//             return;
//           }

//           // Deduct tokens for the AI's response
//           await updateUserTokenMethod(aiResp);

//           const aiMessageObject = {
//             role: 'assistant',
//             content: aiResp
//           };

//           const newConversation = [...conversation, aiMessageObject];
//           setConversation(newConversation);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversation
//               });
//               console.log(" Conversation saved successfully to Convex.");
//             } catch (convexSaveError) {
//               console.error(" CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
//             }
//           }

//           setLatestAiResponse(aiResp);

//         } catch (error) {
//           // 🎯 FIX 3: Check for AbortError explicitly and handle silently
//           if (error.name === 'AbortError') {
//             console.log('Gemini API call was intentionally aborted.');
//             // Do NOT set loading to false or show an error message, as the abort was intentional (e.g., component unmount or new conversation started)
//             return;
//           }

//           // Handle all other API/network errors
//           console.error(' ERROR during AI model call:', error);

//           const errorMessage = "I'm sorry, I'm having trouble connecting to the expert right now (API error). Please try again in a moment.";

//           const aiErrorResponse = { role: 'assistant', content: errorMessage };

//           const newConversationWithError = [...conversation, aiErrorResponse];
//           setConversation(newConversationWithError);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversationWithError
//               });
//               console.log(" Conversation (with error message) saved successfully to Convex.");
//             } catch (convexError) {
//               console.error(" CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
//             }
//           }

//           setLatestAiResponse(errorMessage);
//         } finally {
//           // 🎯 FIX 4: Only clear the ref if it matches the current controller,
//           // preventing race conditions where a newer request's controller is accidentally cleared.
//           if (abortControllerRef.current === activeController) {
//             abortControllerRef.current = null;
//           }
//         }
//       }
//     }

//     fetchData();

//     // 🎯 FIX 5: The cleanup function now checks if a controller exists and runs abort.
//     // The AbortError is now correctly handled in the try/catch block above, preventing the console error.
//     return () => {
//       if (activeController) {
//         activeController.abort();
//       }
//     };

//   }, [conversation, DiscussionRoomData, UpdateConversation, updateUserTokenMethod, clerkLoaded]
//   );


//   // Text-to-Speech (TTS) useEffect (No change)
//   useEffect(() => {
//     if (latestAiResponse) {
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }

//       if ('speechSynthesis' in window) {
//         const cleanedResponse = latestAiResponse
//           .replace(/(\*\*|\*|#|\n)/g, '') // Remove ** , * , and \n
//           .replace(/(\s\-\s)/g, ', ') // Replace ' - ' with ', ' for smoother reading
//           .replace(/(\d+)\.\s?/g, '$1. ');
//         const utterance = new SpeechSynthesisUtterance(cleanedResponse);

//         if (preferredVoice) {
//           utterance.voice = preferredVoice;
//         }

//         utterance.rate = 0.7;

//         utterance.onend = () => {
//           setLoading(false);
//           setLatestAiResponse(null);
//           setIsSpeaking(false);
//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//         };

//         utterance.onerror = (event) => {
//           console.error("Web Speech TTS Error:", event.error);
//           setLatestAiResponse(null);
//           setIsSpeaking(false);
//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//           setLoading(false);
//         };

//         if (recognition.current) {
//           recognition.current.abort();
//         }

//         window.speechSynthesis.speak(utterance);
//         setIsSpeaking(true);
//       } else {
//         console.warn("Browser does not support Web Speech Synthesis (TTS).");
//         setLoading(false);
//         setLatestAiResponse(null);
//         if (enableMic) setForceMicRestart(true);
//       }
//     }

//     return () => {
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [latestAiResponse, preferredVoice, enableMic]);



//   const connectToServer = () => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     setEnableMic(true);
//   };


//   // Disconnect function (No change)
//   const disconnect = async (e) => {
//     e.preventDefault();

//     setEnableMic(false);
//     setForceMicRestart(false);
//     setLoading(false);

//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       abortControllerRef.current = null;
//     }

//     if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel();
//     }

//     try {
//       if (DiscussionRoomData?._id) {
//         await UpdateConversation({
//           id: DiscussionRoomData._id,
//           conversation: conversation
//         });
//         console.log("Conversation saved successfully on disconnect.");
//       }
//     } catch (error) {
//       console.error("Failed to save conversation on disconnect:", error);
//     }
//     stopWebcamStream();
//     setEnableFeedbackNotes(true);
//   };


//   // Text input submission handler
//   const handleTextSubmit = async (e) => {
//     e.preventDefault();
//     const text = textInput.trim();
//     if (text !== '') {

//       // 🛑 FIX 1: Stop any ongoing AI speech immediately upon sending a new message
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }

//       // Deduct tokens for the user's text input
//       await updateUserTokenMethod(text);

//       setConversation(prev => [...prev, {
//         role: 'user',
//         content: text,
//       }]);
//       setTextInput('');
//     }
//   };


//   // Hydration check render guard (Waiting for data/context to load)
//   if (!clerkLoaded || DiscussionRoomData === undefined || userData === undefined) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <Loader2Icon className='animate-spin mr-2' /> Loading Session...
//       </div>
//     );
//   }

//   // Render Logic
//   return (

//     < div className='-mt-28' >
//       <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2 '>
//           <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center bg-customGray relative'>
//             <Image
//               src={expert?.avatar || "/default-avatar.jpg"}
//               alt='Avatar'
//               width={200}
//               height={200}
//               className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
//             />
//             <h2 className='text-gray-700'>
//               {expert?.name}
//             </h2>

//             {/* 🛑 INSERT YOUR WEBCAM CODE BLOCK HERE */}
//             {DiscussionRoomData?.coachingOption?.toLowerCase().includes('interview') && (
//               <div className='absolute bottom-10 right-10 z-10'>
//                 <div className={`relative rounded-2xl border-4 border-white shadow-lg`}>
//                   <video
//                     id="user-webcam-feed"
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     height={80}
//                     width={130}
//                     className={`rounded-2xl`}
//                   />

//                 </div>
//               </div>
//             )}
//             <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
//               <UserButton />
//             </div>
//           </div>
//           <div className='mt-5 flex items-center justify-center'>
//             {!enableMic ?
//               <Button onClick={connectToServer} disabled={loading}>
//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Connect
//               </Button>

//               // <Button variant="destructive" onClick={disconnect} disabled={loading && !abortControllerRef.current}>
//               :
//               <Button variant="destructive" onClick={disconnect} >

//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Disconnect
//               </Button>
//             }
//           </div>
//         </div>
//         <div>
//           <ChatBox
//             conversation={conversation}
//             enableFeedbackNotes={enableFeedbackNotes}
//             coachingOption={DiscussionRoomData?.coachingOption}
//             generatedSummery={DiscussionRoomData?.summery}
//           />
//         </div>
//       </div>

//       <form onSubmit={handleTextSubmit} className='mt-5 flex items-center justify-center space-x-2'>
//         <input
//           type='text'
//           value={textInput}
//           onChange={(e) => setTextInput(e.target.value)}
//           placeholder='Type your message here...'
//           className='flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//           disabled={loading} // Disable text input while AI is processing
//         />
//         <Button type='submit' disabled={loading || textInput.trim() === ''}>Send</Button>
//       </form>
//     </div >
//   );
// }

// export default DiscussionRoom;



"use client";

import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import Image from 'next/image';
import { UserButton, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AIModel } from '@/services/GlobalServices';
import ChatBox from './_components/ChatBox';
import { Loader2Icon, Webcam } from 'lucide-react';
import * as faceapi from 'face-api.js';

// ASSUMPTION: You need to import your UserContext here
import { UserContext } from '@/app/_context/UserContext';

function DiscussionRoom() {
  const { roomid } = useParams();

  const { isLoaded: clerkLoaded } = useAuth();
  const { userData, setUserData } = useContext(UserContext);

  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  const [expert, setExpert] = useState();
  const [enableMic, setEnableMic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [forceMicRestart, setForceMicRestart] = useState(false);

  const abortControllerRef = useRef(null);
  const [latestAiResponse, setLatestAiResponse] = useState(null);

  const recognition = useRef(null);

  const [transcribe, setTranscribe] = useState('');
  const [conversation, setConversation] = useState([]);

  const [preferredVoice, setPreferredVoice] = useState(null);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const videoRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [faceMissingTime, setFaceMissingTime] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const lastFaceMissingAlertRef = useRef(0);

  //  NEW STATE & REFS FOR FACE DETECTION
  const canvasRef = useRef(null);
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true); // Assume present initially
  const detectionIntervalRef = useRef(null); // Ref for the interval timer
  //  END NEW STATE & REFS

  //  NEW FUNCTION TO EXPLICITLY STOP THE WEBCAM STREAM
  const stopWebcamStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null; // Clear the reference
      console.log("Webcam stream manually stopped.");
    }
  };
  //  END OF NEW FUNCTION

  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
  const updateUserToken = useMutation(api.users.UpdateUserToken)


  const updateUserTokenMethod = async (text) => {
    // Basic check for valid string and user data
    if (!text || typeof text !== 'string' || !userData || !userData._id || userData.credits === undefined) {
      return;
    }

    // Calculate token count (approx word count)
    const tokenCount = text.trim().split(/\s+/).length;

    if (tokenCount === 0) return;

    const currentCredits = Number(userData.credits);
    const newCredits = Math.max(0, currentCredits - tokenCount);

    try {
      const result = await updateUserToken({
        id: userData._id,
        credits: newCredits
      });

      // Update local context state on success
      setUserData(prev => ({
        ...prev,
        credits: newCredits
      }));
      console.log(`Deducted ${tokenCount} tokens. New balance: ${newCredits}`);

    } catch (error) {
      console.error("Failed to update user tokens in Convex:", error);
    }
  };



  // Voice loading useEffect (No change)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return;

        // const preferredNames = [
        //   'Google US English',
        //   'Google UK English Female',
        //   'Microsoft Zira - English (United States)'
        // ];

        // let selectedVoice = voices.find(v => preferredNames.includes(v.name));

        // if (!selectedVoice) {
        //   selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
        // }

        // if (!selectedVoice) {
        //   selectedVoice = voices.find(v => v.lang.startsWith('en'));
        // }

        // setPreferredVoice(selectedVoice);

        const preferredNames = [
          'Google India English',                // 💡 NEW: High priority for Indian Google voice
          'Microsoft Hemant - English (India)',    // 💡 NEW: High priority for Indian Microsoft voice (if available)
          'Google US English',
          'Google UK English Female',
          'Microsoft Zira - English (United States)'
        ];

        let selectedVoice = voices.find(v => preferredNames.includes(v.name));

        //  NEW FALLBACK: Search for any voice with 'India' in the language tag or name
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));
        }

        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
        }

        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }

        setPreferredVoice(selectedVoice);
      };

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
      setVoice();
    }
  }, []);


  // Data Initialization useEffect
  useEffect(() => {
    if (DiscussionRoomData) {
      if (!DiscussionRoomData.conversation) {
        setConversation([]);
      } else {
        setConversation(DiscussionRoomData.conversation);
      }

      const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  //  SIMPLE WEBCAM INITIALIZATION useEffect (Camera ON/OFF)
  useEffect(() => {
    // Exit if ref is not ready or data is missing
    if (!videoRef.current || !DiscussionRoomData) return;

    const currentOption = DiscussionRoomData.coachingOption?.toLowerCase();
    const isMockInterview = currentOption?.includes('interview');

    // Logic to START the stream
    if (isMockInterview) {
      // Only attempt to start if no stream is currently assigned
      if (!videoRef.current.srcObject) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              console.log("✅ Webcam stream started for mock interview.");
            } else {
              // Handle case where component unmounts quickly
              stream.getTracks().forEach(track => track.stop());
            }
          })
          .catch(error => {
            console.error("❌ Webcam access denied or failed:", error);
            alert("Webcam access denied. Please enable it in your browser settings for the mock interview.");
          });
      }
    } else {
      // Stop the stream if the option is not 'interview'
      stopWebcamStream();
    }

    // Cleanup function: This is the ultimate guarantee that runs on component UNMOUNT
    return () => {
      stopWebcamStream();
    };

  }, [DiscussionRoomData]); // Depends only on DiscussionRoomData
  //  END SIMPLE WEBCAM INITIALIZATION useEffect



  //  NEW: FACE DETECTION useEffect 
  useEffect(() => {

    const loadModels = async () => {
      try {
        // NOTE: The models must be in your public folder under a 'models' directory.
        // Load all three required models:
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        // await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // <-- ADDED
        // await faceapi.nets.faceExpressionNet.loadFromUri('/models'); // <-- ADDED

        console.log("✅ Face-API models loaded.");
        setFaceModelsLoaded(true);
      } catch (error) {
        console.error("FATAL ERROR: Failed to load face-api models. Check public/models folder.", error);
      }
    };


    if (!faceModelsLoaded) {
      loadModels();
    }

    // 2. Start Detection Loop
    const runDetection = () => {
      if (!faceModelsLoaded || !videoRef.current || !canvasRef.current || !DiscussionRoomData) return;

      const isMockInterview = DiscussionRoomData.coachingOption?.toLowerCase().includes('interview');
      if (!isMockInterview) {
        clearInterval(detectionIntervalRef.current); // Stop if not interview
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };

      // Ensure canvas dimensions match video

      // Clear previous interval if it exists
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      // Set detection interval
      detectionIntervalRef.current = setInterval(async () => {

        if (video.paused || video.ended) return;

        // Detect faces
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        const faceFound = detections.length > 0;

        // FIX: Reset canvas
        const resized = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);   // keep canvas empty



        // Update state
        setFaceDetected(faceFound);



        if (!faceFound) {
          const now = Date.now();

          // If 15 seconds passed AND last alert was more than 15 sec ago
          if (now - lastFaceMissingAlertRef.current >= 15000) {
            lastFaceMissingAlertRef.current = now;

            alert("⚠️ You are not visible on camera for 15 seconds. Please return");
          }
        } else {
          // Reset timer when face comes back
          lastFaceMissingAlertRef.current = Date.now();
        }


      }, 1500); // interval every 1.5 sec

    }

    // Run detection when models load and video is ready
    if (faceModelsLoaded && videoRef.current && videoRef.current.readyState >= 2) {
      runDetection();
    } else if (videoRef.current) {
      // Re-run setup once the video starts playing
      videoRef.current.onloadeddata = runDetection;
    }


    // Cleanup function: Clear the interval and any video event listeners
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (videoRef.current) {
        videoRef.current.onloadeddata = null; // Clean up listener
      }
    };
  }, [faceModelsLoaded, DiscussionRoomData]); // Depend on model status and room data




  // STT Logic useEffect (Corrected call to use finalTrimmedText string)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Browser does not support the Web Speech API.");
      return;
    }

    const startRecognition = () => {
      if (recognition.current && recognition.current.state === 'listening') return;

      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-IN'
      newRecognition.maxAlternatives = 5;


      //  NEW ACCURACY BOOST: Provide a vocabulary list (Grammar)
      if ('SpeechGrammarList' in window) {
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        const grammarList = new SpeechGrammarList();

        // Define a list of important words/phrases (e.g., technical terms, expert name)
        const expertName = expert?.name || 'expert';
        const coachingTerms = "JavaScript, React, Next.js, Convex, Clerk, API, debugging, deployment, scaling, serverless, full-stack, backend, python, C langauge, Teach me , Hello";

        const grammar = `#JSGF V1.0; grammar terms; public <term> = ${expertName} | ${coachingTerms.split(',').join(' | ')} ;`;
        grammarList.addFromString(grammar, 1); // 1 is high weight

        newRecognition.grammars = grammarList;
        console.log("Added custom speech grammar.");
      }
      //  END OF GRAMMAR BOOST


      //  NEW ACCURACY BOOST SETTINGS
      try {
        newRecognition.audioThrottle = 50;           // smoother mic data
        newRecognition.noiseSuppression = true;      // cleaner speech
        newRecognition.echoCancellation = true;      // removes echo
        newRecognition.autoGainControl = true;       // fixes volume issues
      } catch (e) { console.log('Advanced STT properties not supported by browser.'); }

      //  REDUCE "no-speech" random errors
      newRecognition.pauseThreshold = 0.3;
      newRecognition.idleTimeout = 5000;
      newRecognition.continuousTimeout = 60000

      recognition.current = newRecognition;

      newRecognition.onstart = () => {

        //  FIX 2: Stop any ongoing AI speech immediately when the microphone starts listening
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }

        console.log("✅ Speech recognition started. Waiting for input...");
        if (forceMicRestart) setForceMicRestart(false);
      };

      newRecognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscribe(interimTranscript.trim());

        if (finalTranscript.trim()) {
          const finalTrimmedText = finalTranscript.trim();
          console.log("Final Transcript captured:", finalTrimmedText);

          if (enableMic) {
            setConversation(prev => [...prev, {
              role: 'user',
              content: finalTrimmedText,
            }]);
          }
          setTranscribe('');

          await updateUserTokenMethod(finalTrimmedText);
        }

      };

      newRecognition.onerror = (event) => {
        if (event.error === 'aborted' || event.error === 'no-speech') {
          console.log(`Speech recognition safe error: ${event.error}`);
          return;
        }

        console.error(" Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert('Microphone permission denied. Please enable it in your browser settings.');
        }
        setEnableMic(false);
        if (recognition.current) {
          recognition.current.abort();
        }
      };

      newRecognition.onend = () => {
        console.log(" Speech recognition ended.");
      };

      newRecognition.start();
    };

    const stopRecognition = () => {
      if (recognition.current) {
        const currentRec = recognition.current;
        recognition.current = null;
        if (currentRec.state !== 'inactive') {
          currentRec.abort();
        }
        console.log("Recognition instance stopped.");
      }
    };

    if (enableMic && !loading) {
      if (!recognition.current || forceMicRestart) {
        stopRecognition();
        startRecognition();
      }
    } else {
      stopRecognition();
    }

    return () => {
      stopRecognition();
    };
  }, [enableMic, loading, forceMicRestart, updateUserTokenMethod]);




  //  FIX: AI Model call useEffect with AbortController fix
  useEffect(() => {
    let activeController = null;

    async function fetchData() {
      if (!DiscussionRoomData || !clerkLoaded) {
        return;
      }

      const lastMessage = conversation[conversation.length - 1];
      if (conversation.length > 0 &&
        lastMessage.role === 'user' &&
        lastMessage.content) {

        //  FIX 1: Abort previous request if a new user message arrives quickly
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          console.log("Previous Gemini API call aborted for new request.");
        }

        //  NEW CREDIT CHECK BLOCK 

        // Check if user has enough credits (assuming 0 means out of tokens)
        // You can adjust the comparison here: e.g., userData?.credits < 10
        if (userData?.credits <= 0) {
          const upgradeMessage = `
**🚨 Out of Free Tokens! 🚨**

You have used your free token limit. To continue your expert session, please **Upgrade Your Account** to purchase more credits.

Thank you for trying our platform!
`;

          const upgradeMessageObject = {
            role: 'assistant',
            content: upgradeMessage
          };

          // 1. Add the upgrade message to the conversation
          const newConversationWithUpgrade = [...conversation, upgradeMessageObject];
          setConversation(newConversationWithUpgrade);

          // 2. Trigger the Text-to-Speech (TTS) for the upgrade message
          setLatestAiResponse(upgradeMessage);

          // 3. IMPORTANT: Exit the function to prevent the AIModel call and reset loading state
          setLoading(false);

          // If the microphone was on, restart it after the TTS message is done (handled in TTS useEffect)
          if (recognition.current) {
            recognition.current.abort();
            recognition.current = null;
          }

          return;
        }

        //  END NEW CREDIT CHECK BLOCK 


        setLoading(true);

        if (recognition.current) {
          recognition.current.abort();
          recognition.current = null;
          console.log("STT forcefully stopped for API call.");
        }

        const conversationHistory = conversation;

        // Create a new controller for this request
        const controller = new AbortController();
        abortControllerRef.current = controller;
        activeController = controller; // Local reference for current fetch operation
        const signal = controller.signal;

        try {
          const aiResp = await AIModel(
            DiscussionRoomData.topic,
            DiscussionRoomData.coachingOption,
            conversationHistory,
            signal
          );

          // FIX 2: Only proceed if the request was NOT aborted
          if (signal.aborted) {
            console.log('Gemini API call was aborted after response was received. Skipping further processing.');
            return;
          }

          if (aiResp === null || typeof aiResp !== 'string') {
            console.warn("AI Model returned null or non-string response:", aiResp);
            setLoading(false);
            return;
          }

          // Deduct tokens for the AI's response
          await updateUserTokenMethod(aiResp);

          const aiMessageObject = {
            role: 'assistant',
            content: aiResp
          };

          const newConversation = [...conversation, aiMessageObject];
          setConversation(newConversation);

          if (DiscussionRoomData._id) {
            try {
              await UpdateConversation({
                id: DiscussionRoomData._id,
                conversation: newConversation
              });
              console.log(" Conversation saved successfully to Convex.");
            } catch (convexSaveError) {
              console.error(" CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
            }
          }

          setLatestAiResponse(aiResp);

        } catch (error) {
          //  FIX 3: Check for AbortError explicitly and handle silently
          if (error.name === 'AbortError') {
            console.log('Gemini API call was intentionally aborted.');
            // Do NOT set loading to false or show an error message, as the abort was intentional (e.g., component unmount or new conversation started)
            return;
          }

          // Handle all other API/network errors
          console.error(' ERROR during AI model call:', error);

          const errorMessage = "I'm sorry, I'm having trouble connecting to the expert right now (API error). Please try again in a moment.";

          const aiErrorResponse = { role: 'assistant', content: errorMessage };

          const newConversationWithError = [...conversation, aiErrorResponse];
          setConversation(newConversationWithError);

          if (DiscussionRoomData._id) {
            try {
              await UpdateConversation({
                id: DiscussionRoomData._id,
                conversation: newConversationWithError
              });
              console.log(" Conversation (with error message) saved successfully to Convex.");
            } catch (convexError) {
              console.error(" CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
            }
          }

          setLatestAiResponse(errorMessage);
        } finally {
          //  FIX 4: Only clear the ref if it matches the current controller,
          // preventing race conditions where a newer request's controller is accidentally cleared.
          if (abortControllerRef.current === activeController) {
            abortControllerRef.current = null;
          }
        }
      }
    }

    fetchData();

    //  FIX 5: The cleanup function now checks if a controller exists and runs abort.
    // The AbortError is now correctly handled in the try/catch block above, preventing the console error.
    return () => {
      if (activeController) {
        activeController.abort();
      }
    };

  }, [conversation, DiscussionRoomData, UpdateConversation, updateUserTokenMethod, clerkLoaded]
  );


  // Text-to-Speech (TTS) useEffect (FINAL FIXED VERSION)
  useEffect(() => {

    //  Always cancel previous speech FIRST — (Fix for "DO NOT BLOCK TTS")
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    //  Now safely check for latestAiResponse
    if (latestAiResponse) {

      if ('speechSynthesis' in window) {

        const cleanedResponse = latestAiResponse
          .replace(/(\*\*|\*|#|\n|---|)/g, '')
          .replace(/(\s\-\s)/g, ', ')
          .replace(/(\d+)\.\s?/g, '$1. ');

        const utterance = new SpeechSynthesisUtterance(cleanedResponse);

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 0.7;
        utterance.pitch = 0.95;

        utterance.onend = () => {
          setLoading(false);
          setLatestAiResponse(null);
          setIsSpeaking(false);

          if (enableMic) {
            setForceMicRestart(true);
          }
        };

        utterance.onerror = () => {
          setLatestAiResponse(null);
          setIsSpeaking(false);

          if (enableMic) {
            setForceMicRestart(true);
          }

          setLoading(false);
        };

        if (recognition.current) {
          recognition.current.abort();
        }

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }

    }

    // Cleanup
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

  }, [latestAiResponse, preferredVoice, enableMic]);


  const connectToServer = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setEnableMic(true);
  };


  // Disconnect function (No change)
  const disconnect = async (e) => {
    e.preventDefault();

    setEnableMic(false);
    setForceMicRestart(false);
    setLoading(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    try {
      if (DiscussionRoomData?._id) {
        await UpdateConversation({
          id: DiscussionRoomData._id,
          conversation: conversation
        });
        console.log("Conversation saved successfully on disconnect.");
      }
    } catch (error) {
      console.error("Failed to save conversation on disconnect:", error);
    }
    stopWebcamStream();
    setEnableFeedbackNotes(true);
  };


  // Text input submission handler
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const text = textInput.trim();
    if (text !== '') {

      //  FIX 1: Stop any ongoing AI speech immediately upon sending a new message
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      //  FIX: Keep mic ON so Disconnect button remains visible
      setEnableMic(true);

      // Deduct tokens for the user's text input
      await updateUserTokenMethod(text);

      setConversation(prev => [...prev, {
        role: 'user',
        content: text,
      }]);
      setTextInput('');
    }
  };


  // Hydration check render guard (Waiting for data/context to load)
  if (!clerkLoaded || DiscussionRoomData === undefined || userData === undefined) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='animate-spin mr-2' /> Loading Session...
      </div>
    );
  }

  // Render Logic
  return (

    < div className='-mt-28' >
      <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
      <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 '>
          <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center bg-customGray relative'>
            <Image
              src={expert?.avatar || "/default-avatar.jpg"}
              alt='Avatar'
              width={200}
              height={200}
              className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
            />
            <h2 className='text-gray-700'>
              {expert?.name}
            </h2>

            {/*  NEW: Status Indicator */}
            {loading && !isSpeaking && (
              <p className='text-sm text-yellow-600 mt-2 flex items-center'>
                <Loader2Icon className='w-4 h-4 mr-1 animate-spin' /> Expert is thinking...
              </p>
            )}
            {isSpeaking && (
              <p className='text-sm text-green-600 mt-2 flex items-center'>
                🔊 Expert is speaking...
              </p>
            )}

            {/*  INSERT YOUR WEBCAM CODE BLOCK HERE */}
            {DiscussionRoomData?.coachingOption?.toLowerCase().includes('interview') && (
              <div className='absolute bottom-10 right-10 z-10'>
                <div className={`relative rounded-2xl border-4 border-white shadow-lg`}>
                  <video
                    id="user-webcam-feed"
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    height={80}
                    width={130}
                    className={`rounded-2xl`}
                  />
                  {/*  NEW: CANVAS FOR FACE DETECTION OVERLAY  */}
                  <canvas
                    ref={canvasRef}
                    width={130}
                    height={80}
                    className='absolute top-0 left-0'
                  />
                  {/*  END CANVAS  */}

                </div>
              </div>
            )}
            <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
              <UserButton />
            </div>
          </div>
          <div className='mt-5 flex items-center justify-center'>
            {!enableMic ?
              <Button onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className='animate-spin' />}
                Connect
              </Button>

              // <Button variant="destructive" onClick={disconnect} disabled={loading && !abortControllerRef.current}>
              :
              <Button variant="destructive" onClick={disconnect} >

                {loading && <Loader2Icon className='animate-spin' />}
                Disconnect
              </Button>
            }
          </div>
        </div>
        <div>
          <ChatBox
            conversation={conversation}
            enableFeedbackNotes={enableFeedbackNotes}
            coachingOption={DiscussionRoomData?.coachingOption}
            generatedSummery={DiscussionRoomData?.summery}
          />
        </div>
      </div>

      <form onSubmit={handleTextSubmit} className='mt-5 flex items-center justify-center space-x-2'>
        <input
          type='text'
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder='Type your message here...'
          className='flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={loading} // Disable text input while AI is processing
        />
        <Button type='submit' disabled={loading || textInput.trim() === ''}>Send</Button>
      </form>
    </div >
  );
}

export default DiscussionRoom;