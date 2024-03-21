"use client"

import { useRouter } from "next/navigation"

import { deleteExam } from "@/lib/api/actions/exam"
import { useActionToast } from "@/hooks/useActionToast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { buttonVariants } from "@/components/ui/Button"
import { Icons } from "@/components/Icons"

type DeleteExamButtonProps = {
  examId: string
}

export const DeleteExamButton = ({ examId }: DeleteExamButtonProps) => {
  const actionToast = useActionToast()
  const router = useRouter()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive" })}
      >
        <Icons.trash className="mr-2 h-4 w-4" /> Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your exam
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const result = await deleteExam({ id: examId })
              actionToast(result)

              if (result.success) router.push("/exams")
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
