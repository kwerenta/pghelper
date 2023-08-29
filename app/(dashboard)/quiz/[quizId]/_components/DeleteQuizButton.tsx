"use client"

import { useRouter } from "next/navigation"

import { useActionToast } from "@/hooks/useActionToast"
import { Button } from "@/components/ui/Button"
import { Icons } from "@/components/Icons"

import { deleteQuiz } from "../actions"

type DeleteQuizButtonProps = {
  quizId: string
}

export const DeleteQuizButton = ({ quizId }: DeleteQuizButtonProps) => {
  const actionToast = useActionToast()
  const router = useRouter()

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        const result = await deleteQuiz(quizId)
        actionToast(result)

        if (result.success) router.push("/quiz")
      }}
    >
      <Icons.trash className="mr-2 h-4 w-4" /> Delete
    </Button>
  )
}
