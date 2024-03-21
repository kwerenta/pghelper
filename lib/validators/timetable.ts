import { z } from "zod"

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

export type UpdateTimetableParams = z.infer<typeof timetableEditorSchema>
