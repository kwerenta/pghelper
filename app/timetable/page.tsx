import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { Timetable } from "@/components/timetable"

export default async function TimetablePage() {
  return (
    <section className="container grid items-center pb-8 pt-6 md:py-10">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Timetable</h2>
          <p className="text-muted-foreground">
            View and customise your timetable.
          </p>
        </div>
        <Button variant="default">
          <Icons.edit className="mr-2 h-4 w-4" />
          Edit timetable
        </Button>
      </div>
      <Separator className="my-6" />
      {/* @ts-expect-error server component */}
      <Timetable />
    </section>
  )
}
