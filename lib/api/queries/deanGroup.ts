import { db } from "@/db"
import { SemesterId, deanGroups } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getDeanGroupsBySemester = async (semesterId: SemesterId) =>
  await db
    .select({ id: deanGroups.id, number: deanGroups.number })
    .from(deanGroups)
    .where(eq(deanGroups.semesterId, semesterId))
    .orderBy(deanGroups.number)
