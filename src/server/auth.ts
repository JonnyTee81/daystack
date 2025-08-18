import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.userId as string,
      },
    }),
    signIn: async ({ user, account, profile }) => {
      // This callback runs every time a user signs in
      // The Prisma adapter will automatically create/update user records
      console.log("User signed in:", user.email);
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // Custom email templates and configuration
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        
        // For local development, we'll create a simple transporter
        const nodemailer = await import("nodemailer");
        
        // Create test account for local development
        const testAccount = await nodemailer.createTestAccount();
        
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const result = await transporter.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n\n${url}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Sign in to DayStack</h1>
              <p>Click the link below to sign in to your account:</p>
              <a href="${url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Sign In</a>
              <p style="margin-top: 20px; color: #666;">If you didn't request this email, you can safely ignore it.</p>
              <p style="color: #666;">This link will expire in 24 hours.</p>
            </div>
          `,
        });

        // For local development, log the preview URL
        if (process.env.NODE_ENV === "development") {
          const previewUrl = nodemailer.getTestMessageUrl(result);
          console.log("📧 Magic Link Email Preview:", previewUrl);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};