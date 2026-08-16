import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // NextAuth will use its default sign-in page, which allows the user to log in with Google.
    signIn: "/api/auth/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
