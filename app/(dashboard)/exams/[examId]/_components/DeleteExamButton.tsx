"use client"

import { useRouter } from "next/navigation"

import { useActionToast } from "@/hooks/useActionToast"
import { Button } from "@/components/ui/Button"
import { Icons } from "@/components/Icons"

import { deleteExam } from "../actions"

type DeleteExamButtonProps = {
  examId: string
}

export const DeleteExamButton = ({ examId }: DeleteExamButtonProps) => {
  const actionToast = useActionToast()
  const router = useRouter()

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        const result = await deleteExam(examId)
        actionToast(result)

        if (result.success) router.push("/exams")
      }}
    >
      <Icons.trash className="mr-2 h-4 w-4" /> Delete
    </Button>
  )
}
