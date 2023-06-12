interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <div className="grid min-h-screen place-items-center">{children}</div>
}
