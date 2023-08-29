import { z } from "zod"

export class UnauthenticatedException extends Error {
  constructor(message = "You are not logged in.") {
    super(message)
    this.name = "UnauthenticatedException"
  }
}

export class UnauthorizedException extends Error {
  constructor(message = "You are not authorized to perform this action.") {
    super(message)
    this.name = "UnauthorizedException"
  }
}

export function getErrorMessage(error: unknown) {
  let message = "Something went wrong, please try again later."

  if (error instanceof z.ZodError) {
    message = "Failed to validate sent data."
  } else if (error instanceof Error) {
    message = error.message
  }

  return message
}
