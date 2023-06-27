"use client"

import { signOut } from "next-auth/react"

import { Icons } from "./Icons"
import { Button } from "./ui/Button"

export function UserButton() {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => signOut()}
    >
      <Icons.logOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </Button>
  )
}
