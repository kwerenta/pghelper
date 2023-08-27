import { z } from "zod"

import { toast } from "@/hooks/useToast"

export class UnauthenticatedException extends Error {
  constructor(message = "You are not logged in.") {
    super(message)
    this.name = "UnauthenticatedException"
  }
}

export function catchActionErrors(error: unknown) {
  if (error instanceof z.ZodError) {
    return toast({
      title: "Error",
      variant: "destructive",
      description: "Failed to validate sent data.",
    })
  } else if (error instanceof Error) {
    return toast({
      title: "Error",
      variant: "destructive",
      description: error.message,
    })
  } else {
    return toast({
      title: "Error",
      variant: "destructive",
      description: "Something went wrong, please try again later.",
    })
  }
}
