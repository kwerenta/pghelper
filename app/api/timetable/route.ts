import { NextResponse } from "next/server"
import { db } from "@/db"
import { customTimeslots } from "@/db/schema"
import { DrizzleError, and, eq, inArray } from "drizzle-orm"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"

export const timetableEditorSchema = z.object({
  timeslots: z.array(
    z.object({
      deanGroup: z.number(),
      courseId: z.number(),
    }),
  ),
})

type Result = {
  message: string
}

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json<Result>(
        { message: "Unauthorized" },
        { status: 401 },
      )
    }

    const reqData = await req.json()
    const parsedData = timetableEditorSchema.parse(reqData)

    const data = parsedData.timeslots.map((entry) => ({
      ...entry,
      studentId: session.user.id,
    }))

    db.transaction(async (tx) => {
      await tx.delete(customTimeslots).where(
        and(
          inArray(
            customTimeslots.courseId,
            data.map((d) => d.courseId),
          ),
          eq(customTimeslots.studentId, session.user.id),
        ),
      )
      await tx
        .insert(customTimeslots)
        .values(data.filter((d) => d.deanGroup !== session.user.deanGroup))
    })

    return NextResponse.json<Result>(
      { message: "Timetable successfully updated" },
      { status: 200 },
    )
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json<Result>(
        { message: "Unprocessable entity" },
        { status: 422 },
      )
    } else if (e instanceof DrizzleError) {
      return NextResponse.json<Result>({ message: "Error" }, { status: 500 })
    }
  }
}
