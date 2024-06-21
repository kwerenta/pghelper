import { redirect } from "next/navigation"
import { addDays, addHours, parseISO, startOfISOWeek } from "date-fns"
import { z } from "zod"

import { getCoursesBySemester } from "@/lib/api/queries/courses"
import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import {
  getTimeslotExceptionsByTimeslots,
  getTimeslotsBySemester,
  getUserTimetable,
} from "@/lib/api/queries/timeslots"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Timetable } from "@/app/(dashboard)/timetable/_components/Timetable"
import { TimetableEditor } from "@/app/(dashboard)/timetable/_components/TimetableEditor"

import { SelectDeanGroupTimetable } from "./_components/SelectDeanGroupTimetable"
import { SelectTimetableDate } from "./_components/SelectTimetableDate"

type UserTimetablePage = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const timetableDateSchema = z.object({
  date: z.string().date(),
})

export default async function UserTimetablePage({
  searchParams,
}: UserTimetablePage) {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const entries = await getUserTimetable()

  const parsedSearchParams = timetableDateSchema.safeParse(searchParams)
  const selectedDate = parsedSearchParams.success
    ? new Date(parsedSearchParams.data.date)
    : undefined
  const week = selectedDate
    ? // TEMP timezone offset fix
      new Date(
        startOfISOWeek(selectedDate).valueOf() -
          selectedDate.getTimezoneOffset() * 60 * 1000,
      )
    : undefined

  const timeslotExceptions = selectedDate
    ? await getTimeslotExceptionsByTimeslots(entries.map((entry) => entry.id))
    : []

  const deanGroups = await getDeanGroupsBySemester(user.deanGroup.semesterId)
  const courses = (
    await getCoursesBySemester(user.deanGroup.semesterId)
  ).filter((course) => course.type !== "lecture")

  const timeslots = await getTimeslotsBySemester(user.deanGroup.semesterId)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectTimetableDate date={selectedDate} />
          <SelectDeanGroupTimetable deanGroups={deanGroups} />
          <TimetableEditor
            currentTimetable={entries}
            courses={courses}
            timeslots={timeslots}
            deanGroups={deanGroups}
          />
        </div>
      </DashboardHeader>
      <Timetable
        week={week}
        timeslotExceptions={timeslotExceptions}
        entries={entries}
      />
    </DashboardShell>
  )
}
