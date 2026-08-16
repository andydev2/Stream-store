import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // NextAuth will use its default sign-in page, which allows the user to log in with Google.
    signIn: "/api/auth/signin",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes must be accessible)
     * - _next/static (Static files)
     * - _next/image (Image optimization)
     * - favicon.ico (Favicon)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
