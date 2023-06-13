interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="container grid min-h-screen items-center">{children}</div>
  )
}
