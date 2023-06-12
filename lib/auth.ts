import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { NextAuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"

import { DrizzleAdapter } from "./drizzleAuthAdapter"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (!token) return session

      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        },
      }
    },
    async jwt({ token, user }) {
      const dbUser =
        (await db.query.users.findFirst({
          where: eq(users.email, token.email ?? ""),
        })) ?? null

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}
