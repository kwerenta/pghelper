import { db } from "@/db"
import { users } from "@/db/schema"
import { studentDeanGroups } from "@/db/schema/deanGroup"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import Discord from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.deanGroup = token.deanGroup
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.query.users.findFirst({
        with: {
          studentDeanGroups: {
            with: {
              deanGroup: true,
            },
            where: eq(studentDeanGroups.isActive, true),
          },
        },
        where: eq(users.email, token.email ?? ""),
      })

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
        deanGroup: dbUser.studentDeanGroups[0].deanGroup,
      }
    },
  },
}
