import { inferAdditionalFields } from "better-auth/client/plugins"; // Importa el plugin inferAdditionalFields para detectar el campo role
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
});

// import { nextCookies } from "better-auth/next-js";
// import { createAuthClient } from "better-auth/react";

// export const { signIn, signUp, signOut, useSession } = createAuthClient({
//   plugins: [nextCookies()],
// });
