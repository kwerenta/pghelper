import { Timetable } from "@/components/timetable"

export default async function IndexPage() {
  // Workaround for Typescript server component cannot be used as a JSX component error
  const timetable: JSX.Element = await Timetable()
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      {timetable}
    </section>
  )
}
