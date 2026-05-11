import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - invitation/*  (public — no auth needed)
     * - public assets (svg, png, jpg, mp4, mp3, webp, ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|invitation/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3)$).*)",
  ],
};
