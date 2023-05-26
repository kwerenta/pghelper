import Link from "next/link"
import { db } from "@/db"
import { courses as coursesTable } from "@/db/schema"

import { buttonVariants } from "@/components/ui/button"

export default async function IndexPage() {
  const courses = await db.select().from(coursesTable)
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href=""
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Log in
        </Link>
      </div>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.name}</li>
        ))}
      </ul>
    </section>
  )
}
