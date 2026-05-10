import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { updateSession } from "@/utils/supabase/middleware";

// Define protected routes - all dashboard-related pages
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/Analysis(.*)",
  "/settings(.*)",
  "/news-feed(.*)",
  "/watchlist(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { getToken } = await auth();
  const supabaseResponse = await updateSession(req, () => getToken());

  // If the route is protected and user is not authenticated, redirect to sign-in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return supabaseResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
