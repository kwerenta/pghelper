interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container grid min-h-screen items-center">{children}</div>
  )
}
