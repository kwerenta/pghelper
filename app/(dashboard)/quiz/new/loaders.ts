import { db } from "@/db"
import { courses } from "@/db/schema"
import { and, eq, gt, isNull } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

export const getCoursesList = () => {
  const coursesAlias = alias(courses, "coursesAlias")
  return db
    .select({ id: courses.id, name: courses.name })
    .from(courses)
    .leftJoin(
      coursesAlias,
      and(eq(courses.name, coursesAlias.name), gt(courses.id, coursesAlias.id)),
    )
    .where(isNull(coursesAlias.id))
}
