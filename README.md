This repository contains the source code for the AI Coaching Hub, a full-stack web application designed to provide personalized lecture and interview coaching, etc using a Generative AI backend.

Key Features & Technical Highlights
Full-Stack Architecture: Built on the T3 Stack principles using Next.js (Frontend/API routes) and Convex (Serverless Backend/Database).
Secure Authentication (Clerk): Implements robust user authentication, protecting the dashboard route with Clerk middleware.
and Web Speech API for text to speech.

For Payments used Dodo Payents - Token-Based Monetization Logic: Features a custom usage management system where users are provisioned with "tokens" (credits) stored in the Convex database.
AI queries consume tokens.
Users are placed of a 'Free' or 'Pro' plan. 

Convex Backend: Uses Convex for data storage (e.g., user credits, plan details) and to securely execute serverless functions (e.g., calling the AI Model API and handling Clerk Webhooks).


First, run the development server:

```bash
npx convex dev
npx convex deploy
npm run dev

Open http://localhost:3000/dashboard



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

