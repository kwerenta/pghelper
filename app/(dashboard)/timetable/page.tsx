import { redirect } from "next/navigation"
import { startOfISOWeek } from "date-fns"
import { z } from "zod"

import { getCoursesBySemester } from "@/lib/api/queries/courses"
import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import { getSemesterById } from "@/lib/api/queries/semesters"
import {
  getTimeslotExceptionsByTimeslots,
  getTimeslotsBySemester,
  getUserTimetable,
} from "@/lib/api/queries/timeslots"
import { getCurrentUser } from "@/lib/session"
import { parseTimetable } from "@/lib/timetableParser"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Timetable } from "@/app/(dashboard)/timetable/_components/Timetable"
import { TimetableEditor } from "@/app/(dashboard)/timetable/_components/TimetableEditor"

import { AddToCalendarButton } from "./_components/AddToCalendarButton"
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

  const semester = await getSemesterById(user.deanGroup.semesterId)
  if (!semester) return redirect("/")

  const parsedSearchParams = timetableDateSchema.safeParse(searchParams)
  const selectedDate = parsedSearchParams.success
    ? new Date(parsedSearchParams.data.date)
    : new Date()
  // TEMP timezone offset fix
  const week = new Date(
    startOfISOWeek(selectedDate).valueOf() -
      selectedDate.getTimezoneOffset() * 60 * 1000,
  )

  const timeslotExceptions = await getTimeslotExceptionsByTimeslots(
    entries.map((entry) => entry.id),
  )

  const deanGroups = await getDeanGroupsBySemester(user.deanGroup.semesterId)
  const courses = (
    await getCoursesBySemester(user.deanGroup.semesterId)
  ).filter((course) => course.type !== "lecture")

  const timeslots = await getTimeslotsBySemester(user.deanGroup.semesterId)

  const timetable = parseTimetable(entries, timeslotExceptions, week, semester)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectTimetableDate week={week} />
          <SelectDeanGroupTimetable deanGroups={deanGroups} />
          <TimetableEditor
            currentTimetable={entries}
            courses={courses}
            timeslots={timeslots}
            deanGroups={deanGroups}
          />
          <AddToCalendarButton entries={timetable} semester={semester} />
        </div>
      </DashboardHeader>
      <Timetable entries={timetable} />
    </DashboardShell>
  )
}
