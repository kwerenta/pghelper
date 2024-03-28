import "server-only"
import { db } from "@/db"
import { courses } from "@/db/schema"
import { and, eq, gt, isNull } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

export const getCourses = async () => {
  const coursesAlias = alias(courses, "coursesAlias")
  return await db
    .select({ id: courses.id, name: courses.name })
    .from(courses)
    .leftJoin(
      coursesAlias,
      and(eq(courses.name, coursesAlias.name), gt(courses.id, coursesAlias.id)),
    )
    .where(isNull(coursesAlias.id))
}

export const getCoursesBySemester = async (semesterId: number) =>
  await db
    .select({ id: courses.id, name: courses.name, type: courses.type })
    .from(courses)
    .where(eq(courses.semesterId, semesterId))
    .orderBy(courses.name)

export const getCourseById = async (id: number) =>
  await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1)
