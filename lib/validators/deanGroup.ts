import { z } from "zod"

export const deanGroupSchema = z.object({
  deanGroup: z.coerce.number().positive(),
})

export const updateDeanGroupSchema = deanGroupSchema.extend({
  mode: z.enum(["replace", "keep"]),
})

export type UpdateDeanGroupParams = z.infer<typeof updateDeanGroupSchema>
