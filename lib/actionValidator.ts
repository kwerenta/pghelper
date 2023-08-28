import { ZodTypeAny, z } from "zod"

import { getErrorMessage } from "./exceptions"

type SuccessResult<OutputData> = {
  success: true
  message: string
  data?: OutputData
}

type ErrorResult = {
  success: false
  message: string
}

export type ActionResult<OutputData> = SuccessResult<OutputData> | ErrorResult

export function validatedAction<OutputData, Schema extends ZodTypeAny>(
  schema: Schema,
  action: (
    input: z.infer<Schema>,
  ) => Promise<Omit<SuccessResult<OutputData>, "success">>,
) {
  return async function (
    input: z.infer<Schema>,
  ): Promise<ActionResult<OutputData>> {
    try {
      const validatedInput = schema.parse(input)
      const result = await action(validatedInput)
      return { success: true, ...result }
    } catch (error) {
      return { success: false, message: getErrorMessage(error) }
    }
  }
}
