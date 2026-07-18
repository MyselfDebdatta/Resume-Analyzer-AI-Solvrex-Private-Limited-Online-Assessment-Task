import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:5173";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "https://resume-analyzer-ai-debdatta.vercel.app", 
    getBaseURL()
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n\n=== OTP FOR ${email} ===`);
        console.log(`OTP: ${otp}`);
        console.log(`=======================\n\n`);
        
        try {
          await transporter.sendMail({
            from: `"Resume Analyzer AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Your Resume Analyzer AI Verification Code: ${otp}`,
            html: `<div style="font-family: sans-serif; text-align: center;"><h1>Resume Analyzer AI</h1><p>Your verification code is: <strong>${otp}</strong></p></div>`,
          });
        } catch (err) {
          console.error("Exception while sending OTP via Nodemailer:", err);
        }
      },
    }),
  ],
});
