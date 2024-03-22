import type { DeanGroup } from "@/db/schema"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

type UserId = string

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    deanGroup: DeanGroup
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId
      deanGroup: DeanGroup
    }
  }
}
