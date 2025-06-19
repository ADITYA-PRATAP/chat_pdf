// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/create-chat", // 👈 Add this if it should be public
  "/api/chat",
  "/chat/(.*)",
  "/api/get-messages",
  "/api/stripe",
  "/api/webhook",
  "/api/middleware",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect(); // will throw 500 if user is not signed in
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
