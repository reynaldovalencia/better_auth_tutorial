import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
