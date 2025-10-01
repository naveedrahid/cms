import { NextResponse } from "next/server";
import { corsMiddleware } from "./middleware/cors";
import { rateLimitMiddleware } from "./middleware/rate-limit";

export function middleware(request) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const rateLimitResponse = rateLimitMiddleware(request);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        return corsMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
