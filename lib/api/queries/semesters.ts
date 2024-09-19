import { db } from "@/db"
import { semesters, type Semester } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getSemesterById(semesterId: Semester["id"]) {
  return await db.query.semesters.findFirst({
    where: eq(semesters.id, semesterId),
  })
}
