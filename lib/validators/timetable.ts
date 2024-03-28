import { z } from "zod"

export const timetableEditorSchema = z.object({
  timeslots: z
    .array(
      z.object({
        courseId: z.number().positive(),
        group: z.object({
          deanGroupId: z.number().positive().nullable(),
          subgroup: z.number().positive().nullable(),
        }),
      }),
    )
    .min(1),
})

export type UpdateTimetableParams = z.infer<typeof timetableEditorSchema>
