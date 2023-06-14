import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid h-screen place-items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-center gap-4">
        <h2 className="text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
          PGHelper
        </h2>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Tools for students.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Customizable timetable and more.
          </p>
        </div>
        <Link
          className={buttonVariants({ variant: "default", size: "lg" })}
          href="/timetable"
        >
          Get started
        </Link>
      </div>
    </section>
  )
}
