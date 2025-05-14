// /pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password:   { label: "Password",          type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) throw new Error("Credentials are missing");

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier }
          ]
        }) as any; // Type assertion to any
        if (!user) throw new Error("User not found");
        if (!user.isVerified) throw new Error("Please verify your account");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Incorrect Password");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isVerified: Boolean(user.isVerified), 
          isAcceptingMessages: Boolean(user.isAcceptingMessages),
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // on first sign in, `user` is the object you returned in authorize()
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      // expose only what you need in the client session object
      session.user._id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.isVerified = token.isVerified as boolean;
      session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      return session;
    }
  },

  pages: {
    signIn: "/sign-in"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
};

export default NextAuth(authOptions);
