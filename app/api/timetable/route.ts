import { NextResponse } from "next/server"
import { db } from "@/db"
import { timeslotsOverrides } from "@/db/schema"
import { DrizzleError, and, eq, inArray } from "drizzle-orm"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { timetableEditorSchema } from "@/lib/validators/timetable"

type Result = {
  message: string
}

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json<Result>(
        { message: "You are not logged in." },
        { status: 401 },
      )
    }

    const reqData = await req.json()
    const parsedData = timetableEditorSchema.parse(reqData)

    const data = parsedData.timeslots.map((entry) => ({
      ...entry,
      studentId: session.user.id,
    }))

    await db.transaction(async (tx) => {
      await tx.delete(timeslotsOverrides).where(
        and(
          inArray(
            timeslotsOverrides.courseId,
            data.map((d) => d.courseId),
          ),
          eq(timeslotsOverrides.studentId, session.user.id),
        ),
      )

      const timeslotsToInsert = data.filter(
        (d) => d.deanGroup !== session.user.deanGroup,
      )

      if (timeslotsToInsert.length !== 0)
        await tx.insert(timeslotsOverrides).values(timeslotsToInsert)
    })

    return NextResponse.json<Result>(
      { message: "Timetable successfully updated." },
      { status: 200 },
    )
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json<Result>(
        { message: "Failed to validate sent data." },
        { status: 422 },
      )
    }
    if (e instanceof DrizzleError) {
      return NextResponse.json<Result>(
        { message: "Failed to save timetable changes." },
        { status: 500 },
      )
    }
    return NextResponse.json<Result>(
      { message: "Something went wrong. Try again later." },
      { status: 500 },
    )
  }
}
