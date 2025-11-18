// /services/GlobalServices.jsx

// import axios from "axios";

// export const getToken = async () => {
//   try {
//     const res = await axios.get("/api/getToken");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching token from backend:", error);
//     throw error;
//   }
// };


// import OpenAI from "openai"
// import { ExpertsList } from "./Options"

// const openai = new OpenAI({
//     baseURL: 'https://openrouter.ai/api/v1',
//     apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
//     dangerouslyAllowBrowser: true
// })


// export const AIModel = async (topic, coachingOption, lastTwoConversation) => {

//     const option = ExpertsList.find((item) => item.name == coachingOption)
//     const PROMPT = (option.prompt).replace('{user_topic}', topic)

//     const completion = await openai.chat.completions.create({
//         model: 'deepseek/deepseek-r1-0528:free',
//         messages: [
//             {
//                 role: 'assistant', content: PROMPT
//             },
//             ...lastTwoConversation
//             // { role: "user", content: msg }
//         ],
//     });
//     console.log(completion.choices[0].message);
//     return completion.choices[0].message;
// }


// import { GoogleGenerativeAI } from "@google/generative-ai";
// // Assuming ExpertsList is exported from ./Options
// import { ExpertsList } from "./Options";
// import { request } from "http";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// // Helper function to transform local message format to Gemini format
// const transformToGeminiFormat = (message) => {
//     const role = message.role === 'assistant' ? 'model' : message.role;
//     return {
//         role: role,
//         parts: [{ text: message.content }]
//     };
// };

// // AIModel: Used for ongoing conversation (uses lastTwoConversation)

// export const AIModel = async (topic, coachingOption, lastTwoConversation, signal) => {
//     try {
//         const option = ExpertsList.find((item) => item.name === coachingOption);
//         const PROMPT = (option.prompt).replace('{user_topic}', topic);


//         // Access the Generative Model.
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//         // Transform the last two messages to the Gemini format
//         const geminiMessages = lastTwoConversation.map(transformToGeminiFormat);

//         // Construct the final message array: System Instruction + Context
//         const messages = [
//             // The initial prompt sets the context/role for the conversation
//             { role: 'user', parts: [{ text: PROMPT }] },
//             // The two latest messages provide context for the reply
//             ...geminiMessages
//         ];

//         // Define the request options object separately
//         const requestOptions = {
//             signal: signal
//         };

//         // FINAL FIX: Pass contents object and requestOptions object as two separate arguments
//         const result = await model.generateContent(
//             { contents: messages },
//             requestOptions
//         );

//         const response = result.response;

//         const geminiMessage = {
//             role: 'assistant',
//             content: response.text(),
//         };

//         return geminiMessage;

//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log("AI Model call aborted successfully.");
//             return null;
//         }

//         console.error("AI Model Error:", error);
//         return {
//             role: 'assistant',
//             content: "I'm sorry, an error occurred. Please try again later."
//         };
//     }
// };

// // ----------------------------------------------------------------------
// // AIModelToGenerateFeedbackAndNotes: Used for one-off notes generation (uses full conversation)
// // ----------------------------------------------------------------------
// export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation, signal) => {
//     try {
//         const option = ExpertsList.find((item) => item.name === coachingOption);
//         const PROMPT = (option.summeryPrompt);


//         // Access the Generative Model.
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//         // Transform the entire conversation history to the correct Gemini format
//         const geminiMessages = conversation.map(transformToGeminiFormat);

//         // 🛑 CRITICAL FIX: The 'messages' array should only contain the correctly 
//         // formatted history (geminiMessages) plus the final user prompt.
//         const messages = [
//             // History (all messages are now in the correct {role, parts} format)
//             ...geminiMessages,
//             // The final user request for notes/feedback
//             { role: 'user', parts: [{ text: PROMPT }] },
//         ];

//         // Define the request options object separately
//         const requestOptions = {
//             signal: signal
//         };

//         //  FINAL FIX: Pass contents object and requestOptions object as two separate arguments
//         const result = await model.generateContent(
//             { contents: messages }, // First argument: the contents payload
//             requestOptions           // Second argument: the request options (including signal)
//         );

//         const response = result.response;

//         const geminiMessage = {
//             role: 'assistant',
//             content: response.text(),
//         };

//         return geminiMessage;

//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log("AI Model call aborted successfully.");
//             return null;
//         }

//         console.error("AI Model Error:", error);
//         return {
//             role: 'assistant',
//             content: "I'm sorry, an error occurred. Please try again later."
//         };
//     }
// };

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ExpertsList } from "./Options";

// // Ensure the API Key is read correctly
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// // Helper function to transform local message format to Gemini format
// const transformToGeminiFormat = (message) => {
//     // The API requires a role to alternate between 'user' and 'model'
//     const role = message.role === 'assistant' ? 'model' : message.role;
//     return {
//         role: role,
//         parts: [{ text: message.content }]
//     };
// };

// // ----------------------------------------------------------------------
// // AIModel: Used for ongoing conversation (uses lastTwoConversation)
// // ----------------------------------------------------------------------
// export const AIModel = async (topic, coachingOption, lastTwoConversation, signal) => {
//     try {
//         const option = ExpertsList.find((item) => item.name === coachingOption);
//         const PROMPT = (option.prompt).replace('{user_topic}', topic);

//         // FIX: Use systemInstruction to set the persona/expert role.
//         // This is the correct way to prime the model for a specific role.
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//             config: {
//                 systemInstruction: PROMPT
//             }
//         });

//         // The PROMPT is now handled by systemInstruction. 
//         // We only send the actual conversation history.
//         const messages = lastTwoConversation.map(transformToGeminiFormat);

//         const requestOptions = { signal };

//         const result = await model.generateContent({ contents: messages }, requestOptions);
//         const responseText = result.response.text();

//         return responseText;

//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log("AI Model call aborted successfully.");
//             return '';
//         }

//         console.error("AI Model Error:", error);
//         return "I'm sorry, an error occurred. Please try again later.";
//     }
// };

// // ----------------------------------------------------------------------
// // AIModelToGenerateFeedbackAndNotes: Used for one-off notes generation (uses full conversation)
// // ----------------------------------------------------------------------
// export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation, signal) => {
//     try {
//         const option = ExpertsList.find((item) => item.name === coachingOption);
//         const PROMPT = option.summeryPrompt;

//         // FIX: Use systemInstruction to guide the model's output formatting/goal
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//             config: {
//                 systemInstruction: "Analyze the provided conversation history thoroughly. Your final response must strictly adhere to the instructions given in the concluding user prompt (the summeryPrompt). Respond only with the requested summary content."
//             }
//         });

//         // Transform the full conversation history
//         const geminiMessages = conversation.map(transformToGeminiFormat);

//         // Append the specific summary prompt as the final user message to trigger the action
//         const messages = [
//             ...geminiMessages,
//             { role: 'user', parts: [{ text: PROMPT }] },
//         ];

//         const requestOptions = { signal };
//         const result = await model.generateContent({ contents: messages }, requestOptions);
//         const responseText = result.response.text();

//         return responseText;

//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log("AI Model call aborted successfully.");
//             return '';
//         }

//         console.error("AI Model Error:", error);
//         return "I'm sorry, an error occurred. Please try again later.";
//     }
// };

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExpertsList } from "./Options";

// Ensure the API Key is read correctly
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Helper function to transform local message format to Gemini format
const transformToGeminiFormat = (message) => {
    const role = message.role === 'assistant' ? 'model' : message.role;
    return {
        role: role,
        parts: [{ text: message.content }]
    };
};

// ----------------------------------------------------------------------
// AIModel: Used for ongoing conversation (uses lastTwoConversation)
// ----------------------------------------------------------------------
export const AIModel = async (topic, coachingOption, lastTwoConversation, signal) => {
    try {
        const option = ExpertsList.find((item) => item.name === coachingOption);

        let basePrompt = (option.prompt).replace('{user_topic}', topic);

        // Strip any remaining character/length constraints from the prompt
        basePrompt = basePrompt
            .replace(/while keeping answers concise and under 120 characters/g, '')
            .replace(/Ensure responses stay under 120 characters\./g, '');

        // CRITICAL FEW-SHOT INJECTION: Insert a perfect example of a short response.
        // This example shows the model exactly the format and length desired.
        const FEW_SHOT_EXAMPLE = `
        ---
        The following is an example of the ONLY accepted output format and length:
        
        User: What are C language basics?
        Assistant: C basics start with #include <stdio.h>. This line brings in standard I/O for print statements. All code goes inside the main() function. Use printf("Hello World"); to print text.
        
        Now, respond to the user's last question using this format. Limit your entire response to a MAXIMUM of 3 sentences, NOT paragraphs.
        ---
        `;

        // Final Constraint: Combine the persona with the few-shot example.
        const ENFORCED_PROMPT = `You are a concise, direct expert. Adopt the persona: ${basePrompt}. ${FEW_SHOT_EXAMPLE}`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: ENFORCED_PROMPT,
                // KEEPING EXTREME SETTINGS: 
                temperature: 0.0, // Absolute minimum to enforce instructions strictly.
                maxOutputTokens: 200 // Low token limit to truncate long responses.
            }
        });

        const messages = lastTwoConversation.map(transformToGeminiFormat);
        const requestOptions = { signal };
        const result = await model.generateContent({ contents: messages }, requestOptions);
        const responseText = result.response.text();

        return responseText;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("AI Model call aborted successfully.");
            return '';
        }

        console.error("AI Model Error:", error);
        return "I'm sorry, an error occurred. Please try again later.";
    }
};

// ----------------------------------------------------------------------
// AIModelToGenerateFeedbackAndNotes: This remains the same to allow for long feedback.
// ----------------------------------------------------------------------
export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation, signal) => {
    try {
        const option = ExpertsList.find((item) => item.name === coachingOption);
        const PROMPT = option.summeryPrompt;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            config: {
                // This instruction allows for detailed, structured responses for notes.
                systemInstruction: "Analyze the provided conversation history thoroughly. Your final response must strictly adhere to the instructions given in the concluding user prompt (the summeryPrompt). Respond only with the requested summary content in a well-structured format.",
                temperature: 0.2,
                maxOutputTokens: 500
            }
        });

        const geminiMessages = conversation.map(transformToGeminiFormat);
        const messages = [
            ...geminiMessages,
            { role: 'user', parts: [{ text: PROMPT }] },
        ];

        const requestOptions = { signal };
        const result = await model.generateContent({ contents: messages }, requestOptions);
        const responseText = result.response.text();

        return responseText;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("AI Model call aborted successfully.");
            return '';
        }

        console.error("AI Model Error:", error);
        return "I'm sorry, an error occurred. Please try again later.";
    }
};