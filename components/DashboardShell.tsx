import type { ReactNode } from "react"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <section className="container grid items-center pb-8 pt-6 md:py-10">
      {children}
    </section>
  )
}
