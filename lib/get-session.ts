import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  //console.log("Getting server session..."); //Now we make two request to the database, we have to fix it
  return await auth.api.getSession({
    headers: await headers(),
    // cookies: await cookies(),
  });
});
