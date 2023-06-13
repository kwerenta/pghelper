"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface DashboardNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2 pb-8 pt-6 md:py-10">
      <Link href="/">
        <span className="mb-10 flex items-center text-2xl font-bold tracking-tight">
          <Icons.graduationCap className="mr-2 h-6 w-6" />
          <span>PGHelper</span>
        </span>
      </Link>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "logo"]
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              target={item.external ? "_blank" : "_self"}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
