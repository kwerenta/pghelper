"use client"

import { signIn } from "next-auth/react"

import { Button } from "./ui/button"

export function LoginButton() {
  return (
    <Button className="bg-violet-400" onClick={() => signIn("discord")}>
      Sign in with Discord
    </Button>
  )
}
