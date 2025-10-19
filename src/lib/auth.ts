import db from "@/db/index.ts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    trustedOrigins: ["http://localhost:4000"],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      cookieName: "better-auth-session",
      expiresIn: 60 * 60 * 24 * 1,
    },
    plugins: [openAPI(), bearer()],
});