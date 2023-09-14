import { db } from "@/db"
import { timeslots } from "@/db/schema"
import { eq, or } from "drizzle-orm"

export const getDeanGroupTimetable = (deanGroup: number) =>
  db.query.timeslots.findMany({
    with: {
      course: true,
    },
    where: or(eq(timeslots.deanGroup, deanGroup), eq(timeslots.deanGroup, 0)),
  })
