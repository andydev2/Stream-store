import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Falta correo o contraseña');
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        if (user.provider !== 'credentials') {
          throw new Error('Este correo usa otro método de inicio de sesión');
        }

        if (!user.isVerified) {
          throw new Error('Por favor, verifica tu correo electrónico antes de iniciar sesión');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password || '');
        if (!isMatch) {
          throw new Error('Contraseña incorrecta');
        }

        return { id: user._id.toString(), email: user.email, name: user.email.split('@')[0] };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Si inician sesión con Google, registramos al usuario en la BD si no existe
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            isVerified: true,
            provider: 'google',
            role: user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        (session.user as any).role = token.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "mock-secret-para-desarrollo",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
