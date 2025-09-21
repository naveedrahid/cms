import { NextResponse } from "next/server";
import { corsMiddleware } from "./middleware/cors";

export function middleware(request){
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return corsMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};