import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email!,
        subject: "Verify your email address",
        text: `Please verify your email address by clicking the following link: ${url}`,
      });
    },
  },
  //Con esto detecta el campo role de la tabla users
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});

//Con esto detecta el campo role de la tabla users
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user; //user contiene el role
