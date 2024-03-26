"use client"

import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/Button"
import { Icons } from "@/components/Icons"

export function LoginButton() {
  return (
    <Button onClick={() => signIn("discord")}>
      <Icons.discord className="mr-2 size-4" /> Discord
    </Button>
  )
}
