import type { ReactNode } from "react"

import { Separator } from "@/components/ui/Separator"

type DashboardHeaderProps = {
  children?: ReactNode
  title: string
  description: string
}

export function DashboardHeader({
  children,
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      <Separator className="my-6" />
    </>
  )
}
