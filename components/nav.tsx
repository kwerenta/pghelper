"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/types"
import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

interface DashboardNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="flex h-full flex-col justify-start gap-2 py-6 lg:py-10">
      <Link href="/">
        <span className="mb-4 flex items-center text-2xl font-bold tracking-tight lg:mb-10">
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
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
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
      <div className="mt-auto">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <Icons.logOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </nav>
  )
}
