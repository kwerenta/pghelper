export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container grid min-h-screen items-center">{children}</div>
  )
}
