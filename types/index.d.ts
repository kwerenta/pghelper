import { Icons } from "@/components/Icons"

export type SiteConfig = {
  name: string
  description: string
  sidebarNav: NavItem[]
}

export type NavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  href: string
}
