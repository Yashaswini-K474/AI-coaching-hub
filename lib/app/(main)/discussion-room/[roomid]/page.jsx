// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { getToken } from '@/services/GlobalServices';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// import { UserButton } from '@stackframe/stack';
// import { Button } from '@/components/ui/button';
// import RecordRTC from 'recordrtc';
// import { StreamingTranscriber } from "assemblyai"; // correct SDK import

// function DiscussionRoom() {
//   const { roomid } = useParams();
//   const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enableMic, setEnableMic] = useState(false);
//   const recorder = useRef(null);
//   const transcriber = useRef(null);
//   const [transcribe, setTranscribe] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const silenceTimeout = useRef(null);
//   const audioStream = useRef(null);
//   const texts = useRef({});

//   useEffect(() => {
//     if (DiscussionRoomData) {
//       const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   useEffect(() => {
//     const start = async () => {
//       if (!enableMic || typeof window === "undefined" || typeof navigator === "undefined") return;

//       try {
//         audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

//         const result = await getToken();
//         const token = result?.token;
//         if (!token) throw new Error("No token received.");

//         transcriber.current = new StreamingTranscriber({
//           token,
//           sampleRate: 16000,
//         });

//         transcriber.current.on("transcript", (msg) => {
//           // `msg.isFinal` or similar property to detect final transcripts
//           if (msg.isFinal) {
//             setConversation(prev => [...prev, { role: 'user', content: msg.text }]);
//             setTranscribe('');
//           } else {
//             texts.current[msg.audio_start] = msg.text;
//             const sorted = Object.keys(texts.current).sort((a, b) => a - b);
//             const combined = sorted.map(k => texts.current[k]).join(' ');
//             setTranscribe(combined.trim());
//           }
//         });

//         transcriber.current.on("error", (e) => {
//           console.error("Transcriber error:", e);
//         });

//         await transcriber.current.connect();
//         console.log("✅ Connected streaming");

//         recorder.current = new RecordRTC(audioStream.current, {
//           type: 'audio',
//           mimeType: 'audio/webm;codecs=pcm',
//           recorderType: RecordRTC.StereoAudioRecorder,
//           timeSlice: 250,
//           desiredSampRate: 16000,
//           numberOfAudioChannels: 1,
//           bufferSize: 4096,
//           ondataavailable: async (blob) => {
//             if (!transcriber.current) return;
//             clearTimeout(silenceTimeout.current);
//             const buffer = await blob.arrayBuffer();
//             transcriber.current.sendAudio(buffer);
//             silenceTimeout.current = setTimeout(() => {
//               console.log('User stopped talking');
//             }, 2000);
//           }
//         });

//         recorder.current.startRecording();
//         console.log("🎙️ Recording started");

//       } catch (err) {
//         console.error("Error in streaming setup:", err);
//         setEnableMic(false);
//       }
//     };

//     const stop = async () => {
//       if (recorder.current) {
//         recorder.current.stopRecording(() => {
//           audioStream.current?.getTracks().forEach(track => track.stop());
//         });
//         recorder.current = null;
//       }
//       if (transcriber.current) {
//         await transcriber.current.close();
//         transcriber.current = null;
//       }
//       clearTimeout(silenceTimeout.current);
//       console.log("🛑 Stopped");
//     };

//     if (enableMic) start();
//     else stop();

//     return () => {
//       stop();
//     };
//   }, [enableMic]);

//   const connectToServer = () => setEnableMic(true);
//   const disconnect = (e) => {
//     e.preventDefault();
//     setEnableMic(false);
//   };

//   return (
//     <div className='-mt-28'>
//       <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2'>
//           <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center bg-customGray relative'>
//             <Image
//               src={expert?.avatar || "/default-avatar.jpg"}
//               alt='Avatar'
//               width={200}
//               height={200}
//               className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'
//             />
//             <h2 className='text-gray-700'>{expert?.name}</h2>
//             <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
//               <UserButton />
//             </div>
//           </div>
//           <div className='mt-5 flex items-center justify-center'>
//             {!enableMic ? (
//               <Button onClick={connectToServer}>Connect</Button>
//             ) : (
//               <Button variant="destructive" onClick={disconnect}>Disconnect</Button>
//             )}
//           </div>
//         </div>

//         <div>
//           <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col justify-start p-4 bg-customGray relative overflow-y-auto'>
//             <h2 className='text-gray-700 font-semibold mb-2'>Live Transcript:</h2>
//             <p className='text-gray-900 leading-relaxed whitespace-pre-wrap'>{transcribe}</p>
//           </div>
//           <h2 className='mt-4 text-gray-400 text-sm'>
//             At the end of your conversation we will automatically generate feedback/notes from your conversation
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DiscussionRoom;




// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// import { UserButton } from '@stackframe/stack';
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';

// // Remove these imports
// // import { getToken } from '@/services/GlobalServices';
// // import RecordRTC from 'recordrtc';
// // import { RealtimeTranscriber } from 'assemblyai';

// function DiscussionRoom() {
//   const { roomid } = useParams();
//   const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enableMic, setEnableMic] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Replace transcriber and recorder refs with a single recognition ref
//   const recognition = useRef(null);

//   const [transcribe, setTranscribe] = useState('');
//   const [conversation, setConversation] = useState([{
//     role: 'assistant',
//     content: "Hi"
//   },
//   {
//     role: 'user',
//     content: 'Hello'
//   }
//   ]);

//   useEffect(() => {
//     if (DiscussionRoomData) {
//       const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   useEffect(() => {

//     // Check if Web Speech API is supported
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     const startRecognition = () => {
//       if (!SpeechRecognition || !enableMic) {
//         return;
//       }

//       const newRecognition = new SpeechRecognition();
//       newRecognition.continuous = true;
//       newRecognition.interimResults = true;
//       newRecognition.lang = 'en-US';

//       newRecognition.onstart = () => {
//         console.log("✅ Speech recognition started.");
//       };

//       newRecognition.onresult = (event) => {
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
//           setConversation(prev => [...prev, {
//             role: 'user',
//             content: finalTranscript.trim(),
//           }]);
//           setTranscribe('');
//         }
//       };

//       newRecognition.onerror = (event) => {
//         console.error("❌ Speech recognition error:", event.error);
//         if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//           alert('Microphone permission denied. Please enable it in your browser settings.');
//         }
//         setEnableMic(false);
//       };

//       newRecognition.onend = () => {
//         console.log("🛑 Speech recognition ended.");
//         if (enableMic) {
//           startRecognition();
//         }
//       };

//       newRecognition.start();
//       recognition.current = newRecognition;
//     };

//     const stopRecognition = () => {
//       if (recognition.current) {
//         recognition.current.stop();
//         recognition.current = null;
//       }
//     };

//     if (enableMic) {
//       startRecognition();
//     } else {
//       stopRecognition();
//     }

//     return () => {
//       stopRecognition();
//     };

//   }, [enableMic])

//   const connectToServer = () => {
//     setEnableMic(true);
//   };

//   useEffect(() => {
//     async function fetchData() {
//       if (conversation[conversation.length - 1].role == 'user') {
//         // calling AI text Model to Get Response

//         const lastTwomsg = conversation.slice(-2);
//         const aiResp = await AIModel(DiscussionRoomData.topic,
//           DiscussionRoomData.coachingOption, lastTwomsg); // in place of  lastTwomsg - finalTranscript.trim()

//         console.log(aiResp);
//         setConversation(prev => [...prev, aiResp])
//       }
//     }
//     fetchData()
//   }, [conversation])

//   const disconnect = (e) => {
//     e.preventDefault();
//     // setLoading(true);
//     setEnableMic(false);
//     // setLoading(false);
//   };

//   return (
//     <div className='-mt-28'>
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
//             {!enableMic ? <Button onClick={connectToServer} disabled={loading}> {loading && <Loader2Icon className='animate-spin' />}Connect</Button>
//               :
//               <Button variant="destructive" onClick={disconnect} disabled={loading}>
//                 {loading && <Loader2Icon className='animate-spin' />}
//                 Disconnect</Button>}
//           </div>
//         </div>
//         <div>
//           <ChatBox conversation={conversation} />
//         </div>
//       </div>
//     </div>
//   );

// }

// export default DiscussionRoom;

// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// import { UserButton } from '@stackframe/stack';
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';
// import { Loader2Icon } from 'lucide-react';


// function DiscussionRoom() {
//   const { roomid } = useParams();
//   // DiscussionRoomData holds all fetched data, including 'summery' after the mutation
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

//       newRecognition.onresult = (event) => {
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
//       };

//       newRecognition.onerror = (event) => {
//         if (event.error === 'aborted' || event.error === 'no-speech') {
//           console.log(`Speech recognition safe error: ${event.error}`);
//           return;
//         }

//         console.error("❌ Speech recognition error:", event.error);
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

//   // AI Model call useEffect (No change)
//   useEffect(() => {
//     async function fetchData() {
//       if (!DiscussionRoomData) {
//         return;
//       }

//       if (conversation.length > 0 && conversation[conversation.length - 1].role === 'user') {
//         setLoading(true);

//         if (recognition.current) {
//           recognition.current.abort();
//           recognition.current = null;
//           console.log("STT forcefully stopped for API call.");
//         }

//         const lastTwomsg = conversation.slice(-2);
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         const signal = controller.signal;

//         try {
//           const aiResp = await AIModel(
//             DiscussionRoomData.topic,
//             DiscussionRoomData.coachingOption,
//             lastTwomsg,
//             signal
//           );

//           if (aiResp === null) {
//             setLoading(false);
//             return;
//           }

//           const newConversation = [...conversation, aiResp];
//           setConversation(newConversation);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversation
//               });
//               console.log("✅ Conversation saved successfully to Convex.");
//             } catch (convexSaveError) {
//               console.error("❌ CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
//             }
//           }

//           setLatestAiResponse(aiResp.content);

//         } catch (error) {
//           if (error.name === 'AbortError') {
//             console.log('Gemini API call was intentionally aborted by user.');
//           } else {
//             console.error('❌ ERROR during AI model call:', error);

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
//                 console.log("✅ Conversation (with error message) saved successfully to Convex.");
//               } catch (convexError) {
//                 console.error("❌ CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
//               }
//             }

//             setLatestAiResponse(errorMessage);
//           }
//         } finally {
//           abortControllerRef.current = null;
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

//   }, [conversation, DiscussionRoomData, UpdateConversation]);


//   // Text-to-Speech (TTS) useEffect (No change)
//   useEffect(() => {
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
//           setLoading(false);
//           setLatestAiResponse(null);

//           if (enableMic) {
//             setForceMicRestart(true);
//           }
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

//   //  CRITICAL FIX IS HERE: Pass the summery data from Convex to ChatBox
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
//             // 💡 Pass the fetched summery data to ChatBox
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
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { CoachingExpert } from '@/services/Options';
// import Image from 'next/image';
// // 🛑 FIX 1: Change the import from StackAuth to Clerk
// import { UserButton } from '@clerk/nextjs';
// // REMOVED: import { UserButton } from '@stackframe/stack'; 
// import { Button } from '@/components/ui/button';
// import { AIModel } from '@/services/GlobalServices';
// import ChatBox from './_components/ChatBox';
// import { Loader2Icon } from 'lucide-react';


// function DiscussionRoom() {
//   const { roomid } = useParams();
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

//       newRecognition.onresult = (event) => {
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
//       };

//       newRecognition.onerror = (event) => {
//         if (event.error === 'aborted' || event.error === 'no-speech') {
//           console.log(`Speech recognition safe error: ${event.error}`);
//           return;
//         }

//         console.error("❌ Speech recognition error:", event.error);
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
//       if (!DiscussionRoomData) {
//         return;
//       }

//       // 🛑 CRITICAL FIX 1: Check if the last message is from the user AND that it has content
//       if (conversation.length > 0 &&
//         conversation[conversation.length - 1].role === 'user' &&
//         conversation[conversation.length - 1].content) {

//         setLoading(true);

//         if (recognition.current) {
//           recognition.current.abort();
//           recognition.current = null;
//           console.log("STT forcefully stopped for API call.");
//         }

//         const lastTwomsg = conversation.slice(-2);
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         const signal = controller.signal;

//         try {
//           const aiResp = await AIModel(
//             DiscussionRoomData.topic,
//             DiscussionRoomData.coachingOption,
//             lastTwomsg,
//             signal
//           );

//           if (aiResp === null) {
//             setLoading(false);
//             return;
//           }

//           // 🛑 FIX 2: Wrap the raw string response in a message object 
//           const aiMessageObject = {
//             role: 'assistant',
//             content: aiResp
//           };

//           const newConversation = [...conversation, aiMessageObject]; // ✅ FIX: Use the object
//           setConversation(newConversation);

//           if (DiscussionRoomData._id) {
//             try {
//               await UpdateConversation({
//                 id: DiscussionRoomData._id,
//                 conversation: newConversation
//               });
//               console.log("✅ Conversation saved successfully to Convex.");
//             } catch (convexSaveError) {
//               console.error("❌ CONVEX ERROR (SUCCESS PATH): Failed to save conversation.", convexSaveError);
//             }
//           }

//           // 🛑 FIX 3: Set the string content for TTS
//           setLatestAiResponse(aiResp);

//         } catch (error) {
//           if (error.name === 'AbortError') {
//             console.log('Gemini API call was intentionally aborted by user.');
//           } else {
//             console.error('❌ ERROR during AI model call:', error);

//             const errorMessage = "I'm sorry, I'm having trouble connecting to the expert right now (API error). Please try again in a moment.";

//             // Still need to send an object, even if it's an error message
//             const aiErrorResponse = { role: 'assistant', content: errorMessage };

//             const newConversationWithError = [...conversation, aiErrorResponse];
//             setConversation(newConversationWithError);

//             if (DiscussionRoomData._id) {
//               try {
//                 await UpdateConversation({
//                   id: DiscussionRoomData._id,
//                   conversation: newConversationWithError
//                 });
//                 console.log("✅ Conversation (with error message) saved successfully to Convex.");
//               } catch (convexError) {
//                 console.error("❌ CONVEX ERROR (ERROR PATH): Failed to save conversation.", convexError);
//               }
//             }

//             setLatestAiResponse(errorMessage);
//           }
//         } finally {
//           abortControllerRef.current = null;
//           // Set loading false here if TTS logic is not triggered
//           if (!latestAiResponse) setLoading(false);
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

//   }, [conversation, DiscussionRoomData, UpdateConversation, latestAiResponse]); // Added latestAiResponse to dependencies

//   // Text-to-Speech (TTS) useEffect (Minor Change: Removed redundant setLoading(false) from TTS error)
//   useEffect(() => {
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
//           setLatestAiResponse(null); // Let onend/onerror handle final state

//           if (enableMic) {
//             setForceMicRestart(true);
//           }
//           setLoading(false); // Ensure loading stops if TTS fails
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

//   // Render Logic (No Change)
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
import { Loader2Icon } from 'lucide-react';
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
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
  const updateUserToken = useMutation(api.users.UpdateUserToken)

  const updateUserTokenMethod = async (text) => {
    // Basic check for valid string and user data
    if (!text || typeof text !== 'string' || !userData || !userData._id || userData.credits === undefined) {
      return;
    }

    // Calculate token count (approx word count)
    // 🛑 Typo Fix: 'spliy' -> 'split'
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

        const preferredNames = [
          'Google US English',
          'Google UK English Female',
          'Microsoft Zira - English (United States)'
        ];

        let selectedVoice = voices.find(v => preferredNames.includes(v.name));

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


  // Data Initialization useEffect (No change)
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
      newRecognition.continuous = false;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US';
      newRecognition.maxAlternatives = 1;

      recognition.current = newRecognition;

      newRecognition.onstart = () => {
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

  // 🎯 FIX: AI Model call useEffect with AbortController fix
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

        // 🎯 FIX 1: Abort previous request if a new user message arrives quickly
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          console.log("Previous Gemini API call aborted for new request.");
        }

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

          // 🎯 FIX 2: Only proceed if the request was NOT aborted
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
          // 🎯 FIX 3: Check for AbortError explicitly and handle silently
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
          // 🎯 FIX 4: Only clear the ref if it matches the current controller, 
          // preventing race conditions where a newer request's controller is accidentally cleared.
          if (abortControllerRef.current === activeController) {
            abortControllerRef.current = null;
          }
        }
      }
    }

    fetchData();

    // 🎯 FIX 5: The cleanup function now checks if a controller exists and runs abort. 
    // The AbortError is now correctly handled in the try/catch block above, preventing the console error.
    return () => {
      if (activeController) {
        activeController.abort();
      }
    };

  }, [conversation, DiscussionRoomData, UpdateConversation, updateUserTokenMethod, clerkLoaded]
  );


  // Text-to-Speech (TTS) useEffect (No change)
  useEffect(() => {
    if (latestAiResponse) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(latestAiResponse);

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 0.8;

        utterance.onend = () => {
          setLoading(false);
          setLatestAiResponse(null);

          if (enableMic) {
            setForceMicRestart(true);
          }
        };

        utterance.onerror = (event) => {
          console.error("Web Speech TTS Error:", event.error);
          setLatestAiResponse(null);

          if (enableMic) {
            setForceMicRestart(true);
          }
          setLoading(false);
        };

        if (recognition.current) {
          recognition.current.abort();
        }

        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Browser does not support Web Speech Synthesis (TTS).");
        setLoading(false);
        setLatestAiResponse(null);
        if (enableMic) setForceMicRestart(true);
      }
    }

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

    setEnableFeedbackNotes(true);
  };


  // Text input submission handler
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const text = textInput.trim();
    if (text !== '') {
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
              :
              <Button variant="destructive" onClick={disconnect} disabled={loading && !abortControllerRef.current}>
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