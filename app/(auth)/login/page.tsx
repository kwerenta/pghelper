import { Metadata } from "next"

import { LoginButton } from "@/app/(auth)/login/_components/LoginButton"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          If you don&apos;t have an account yet, it will be automatically
          created
        </p>
      </div>
      <LoginButton />
    </main>
  )
}
