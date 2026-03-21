import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // The adapter type mismatch is a known NextAuth/Prisma issue
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_CLIENT_SECRET",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "PLACEHOLDER_FB_ID",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "PLACEHOLDER_FB_SECRET",
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        (session.user as { id: string }).id = user.id;
      }
      return session;
    },
  },
};
