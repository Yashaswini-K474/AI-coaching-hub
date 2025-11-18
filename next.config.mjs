// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// // next.config.mjs

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // This is the updated configuration for Next.js 15.5.2
//     serverExternalPackages: ["convex"],
// };

// // Use this export if your file is named next.config.mjs
// export default nextConfig;

// next.config.mjs

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // FIX: Changed deprecated 'serverExternalPackages' to the correct key.
//     serverComponentsExternalPackages: ["convex"],
// };

// // Use this export if your file is named next.config.mjs
// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // ✅ CORRECT KEY for Next.js 13/14:
//     // This ensures 'convex' and '@clerk/nextjs' are processed correctly.
//     transpilePackages: ["convex", "@clerk/nextjs"],
//     images: {
//         domains: ['lh3.googleusercontent.com', 'images.clerk.dev', 'your-other-image-domain.com']
//     }
// };

// // Use this export if your file is named next.config.mjs
// export default nextConfig;

// next.config.js

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // Keep this for Convex/Clerk compatibility
//     transpilePackages: ["convex", "@clerk/nextjs"],

//     images: {
//         // CRITICAL: Add the Clerk image host domain, which is often used
//         // even if the original image came from Google.
//         domains: [
//             'lh3.googleusercontent.com', // For direct Google sign-ins
//             'images.clerk.dev',
//             's.gravatar.com',
//             'img.clerk.com'
//         ]
//     }
// };

// // Use this export if your file is named next.config.mjs
// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Keep this for Convex/Clerk compatibility
    transpilePackages: ["convex", "@clerk/nextjs"],

    images: {
        // CRITICAL: Add the Clerk image host domain, which is often used
        // even if the original image came from Google.
        domains: [
            'lh3.googleusercontent.com', // For direct Google sign-ins
            'images.clerk.dev',
            's.gravatar.com',
            'img.clerk.com'
        ]
    },

    // 🛑 NEW: ADD THE WEBPACK CONFIGURATION BLOCK
    // This resolves the 'fs' and 'encoding' module errors by telling Next.js 
    // to ignore them when building for the browser (client).
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                encoding: false,
            };
        }
        return config;
    },
    // 🛑 END NEW BLOCK
};


// Use this export if your file is named next.config.mjs
export default nextConfig;