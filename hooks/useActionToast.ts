import { ActionResult } from "@/lib/actionValidator"

import { useToast } from "./useToast"

export function useActionToast() {
  const { toast } = useToast()
  return (result: ActionResult<any>) =>
    toast({
      variant: result.success ? "default" : "destructive",
      title: result.success ? "Success" : "Error",
      description: result.message,
    })
}
