import { query, mutation } from "./_generated/server";

export const hello = query(async () => {
    return "Hello from Convex!";
});

export const ping = mutation(async () => {
    return "pong";
});