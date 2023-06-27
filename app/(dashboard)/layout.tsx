import { siteConfig } from "@/config/site"
import { getCurrentUser } from "@/lib/session"
import { Separator } from "@/components/ui/Separator"
import { SidebarNav } from "@/components/Nav"
import { UserDropdownMenu } from "@/components/UserDropdownMenu"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 lg:grid-cols-[200px_1fr] lg:gap-12">
        <aside className="flex flex-col py-6 lg:sticky lg:top-0 lg:h-screen lg:w-[200px] lg:py-10">
          <SidebarNav items={siteConfig.sidebarNav} />
          <Separator className="my-4" />
          <UserDropdownMenu user={user} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
