import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/Separator"

type DashboardHeaderProps = {
  children?: ReactNode
  title: string
  description: string
  capitalizeDescription?: boolean
}

export function DashboardHeader({
  children,
  title,
  description,
  capitalizeDescription,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p
            className={cn(
              "text-muted-foreground",
              capitalizeDescription && "capitalize",
            )}
          >
            {description}
          </p>
        </div>
        {children}
      </div>
      <Separator className="my-6" />
    </>
  )
}
