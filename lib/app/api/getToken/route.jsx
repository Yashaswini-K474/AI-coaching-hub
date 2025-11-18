// app/api/getToken/route.js
// import axios from 'axios';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const apiKey = process.env.ASSEMBLY_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
//     }

//     // ✅ New Universal Streaming Token endpoint
//     const response = await axios.post(
//       'https://api.assemblyai.com/v2/streaming/token',
//       { expires_in_seconds: 600 },
//       {
//         headers: {
//           Authorization: apiKey,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     return NextResponse.json({ token: response.data.token });
//   } catch (err) {
//     console.error("❌ Error generating token:", err.response?.data || err.message);
//     return NextResponse.json({ error: err.response?.data?.error || 'Failed to generate token' }, { status: 500 });
//   }
// }


// import { NextResponse } from 'next/server';
// import { createClient } from '@deepgram/sdk';

// export async function POST(req) {
//     try {
//         const { text } = await req.json();

//         // 🔑 The new and correct way to initialize the client
//         const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

//         // Call the text-to-speech method using the 'speak' namespace
//         const { stream } = await deepgram.speak.rest.v("1").makeSpeech({ text });

//         // The stream is returned directly, with the correct content type header
//         return new NextResponse(stream, {
//             headers: {
//                 'Content-Type': 'audio/mpeg',
//             },
//         });

//     } catch (error) {
//         console.error('Error synthesizing speech:', error);
//         return NextResponse.json({ message: 'Error in text-to-speech conversion' }, { status: 500 });
//     }
// }