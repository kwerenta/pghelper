"use client"

import { signOut } from "next-auth/react"

import { Button } from "./ui/button"

export const UserButton = () => (
  <Button variant="ghost" onClick={() => signOut()}>
    Log out
  </Button>
)
