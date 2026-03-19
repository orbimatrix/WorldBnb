import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/booking(.*)',
    '/wishlist(.*)',
    '/notifications(.*)',
    '/profile(.*)',
    '/create-listing(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    // Webhooks are public and verify their own signatures
    if (req.nextUrl.pathname.startsWith('/api/payments/webhook')) {
        return;
    }
    if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
