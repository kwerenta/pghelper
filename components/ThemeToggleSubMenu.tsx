"use client"

import { useTheme } from "next-themes"

import { Icons } from "./Icons"
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/DropdownMenu"

const themes = [
  { name: "light", icon: "sun" },
  { name: "dark", icon: "moon" },
  { name: "system", icon: "laptop" },
] as const

export function ThemeToggleSubMenu() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Icons.sun className="mr-2 inline size-4 dark:hidden" />
        <Icons.moon className="mr-2 hidden size-4 dark:inline" />
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {themes.map((theme) => {
            const Icon = Icons[theme.icon]
            return (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setTheme(theme.name)}
              >
                <Icon className="mr-2 size-4" />
                <span className="capitalize">{theme.name}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
