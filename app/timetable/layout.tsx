import { siteConfig } from "@/config/site"
import { SidebarNav } from "@/components/Nav"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 lg:grid-cols-[200px_1fr] lg:gap-12">
        <aside className="flex flex-col lg:sticky lg:top-0 lg:h-screen lg:w-[200px]">
          <SidebarNav items={siteConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
