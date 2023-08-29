import type { ReactNode } from "react"

export function DashboardShell({ children }: { children: ReactNode }) {
  return <section className="container pb-8 pt-6 md:py-10">{children}</section>
}
