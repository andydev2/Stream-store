import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],
  pages: {
    // Aquí podríamos definir páginas de login personalizadas, 
    // pero por defecto NextAuth proveerá una en /api/auth/signin
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = session.user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "mock-secret-para-desarrollo",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
