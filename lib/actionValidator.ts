import { ZodTypeAny, z } from "zod"

export function validatedAction<ReturnType, Schema extends ZodTypeAny>(
  schema: Schema,
  action: (input: z.infer<Schema>) => Promise<ReturnType>,
) {
  return async function (input: z.infer<Schema>): Promise<ReturnType> {
    const validatedInput = schema.parse(input)
    return await action(validatedInput)
  }
}
