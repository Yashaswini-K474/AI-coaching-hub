// import { stackServerApp } from "./stack";
// import { NextResponse } from "next/server";

// export async function middleware(request) {
//   const user = await stackServerApp.getUser();
//   if (!user) {
//     return NextResponse.redirect(new URL('/handler/sign-in', request.url));
//   }
//   return NextResponse.next();
// }

// export const config = {
//   // You can add your own route protection logic here
//   // Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
//   matcher: '/dashboard/:path*',
// };

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)", // Protect everything under /dashboard
// ]);

// export default clerkMiddleware((auth, request) => {
//   if (isProtectedRoute(request)) {
//     auth.protect(); // ✅ Correct usage
//   }
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*|api).*)",
//   ],
// };

// middleware.js
// middleware.js
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // ✅ Define which routes are protected
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   // Protect dashboard routes only
//   if (isProtectedRoute(req)) {
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!_next|api|static|.*\\..*).*)"],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are protected
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard routes only
  if (isProtectedRoute(req)) {
    await auth.protect(); // Use the asynchronous protect method
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
