import * as z from "zod"

export const timetableEditorSchema = z.object({
  timeslots: z
    .array(
      z.object({
        deanGroup: z.number().positive(),
        courseId: z.number().positive(),
      }),
    )
    .min(1),
})
