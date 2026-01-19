import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "./email";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  //Para autenticar con Google o GitHub
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, //Only if you want to block login completely until email is verified
    //Esto es si olvido su password
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email!,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
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
    //Para cambiar el email en Profile
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Approve your email change",
          text: `Your email has been changed to: ${newEmail}. Click the link to confirm: ${url}`,
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  //Hacer mas seguro el password, this is reinforced server-side the same validations as the client-side with zod
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
});

//Con esto detecta el campo role de la tabla users
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user; //user contiene el role
