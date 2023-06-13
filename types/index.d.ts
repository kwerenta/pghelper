import { Icons } from "@/components/icons"

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
