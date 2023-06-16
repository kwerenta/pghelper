"use client"

import { signIn } from "next-auth/react"

import { Icons } from "./Icons"
import { Button } from "./ui/Button"

export function LoginButton() {
  return (
    <Button onClick={() => signIn("discord")}>
      <Icons.discord className="mr-2 h-4 w-4" /> Discord
    </Button>
  )
}
