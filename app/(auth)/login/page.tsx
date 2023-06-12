import { Metadata } from "next"

import { LoginButton } from "@/components/loginButton"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 text-center">
      <h1>Login to your account</h1>
      <LoginButton />
    </div>
  )
}
