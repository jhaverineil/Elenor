import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("⚠️ [NextAuth] Sign-in attempt failed: Missing email or password in request.");
          return null;
        }

        console.log(`🔐 [NextAuth] Customer login attempt for email: "${credentials.email}"`);

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error(`❌ [NextAuth] Supabase auth error for email "${credentials.email}": [Code: ${error.status || 'unknown'}] - ${error.message}`);
            // Throw the message so NextAuth can capture it or pass it to callbacks
            throw new Error(error.message);
          }

          if (!data.user) {
            console.error(`❌ [NextAuth] Supabase authentication succeeded but returned no user object for: "${credentials.email}"`);
            throw new Error("No user details returned from Supabase Auth.");
          }

          console.log(`✅ [NextAuth] Customer authentication successful for: "${credentials.email}" (ID: ${data.user.id})`);

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name,
          };
        } catch (err: any) {
          console.error(`💥 [NextAuth] Unexpected error during authorize process:`, err);
          throw err;
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
