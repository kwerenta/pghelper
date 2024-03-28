import { z } from "zod"

export const timetableEditorSchema = z.object({
  timeslots: z
    .array(
      z.object({
        courseId: z.number().positive(),
        timeslotId: z.number().positive("Timeslot must be selected"),
      }),
    )
    .min(1),
})

export type UpdateTimetableParams = z.infer<typeof timetableEditorSchema>
