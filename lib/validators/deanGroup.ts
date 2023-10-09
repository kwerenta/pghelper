import { z } from "zod"

export const deanGroupSchema = z.object({
  deanGroup: z.coerce.number().positive(),
})

export const updateDeanGroupSchema = deanGroupSchema.merge(
  z.object({
    mode: z.enum(["replace", "keep"]),
  }),
)

export type UpdateDeanGroup = z.infer<typeof updateDeanGroupSchema>
