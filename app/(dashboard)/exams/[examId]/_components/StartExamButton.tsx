import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

type StartExamButtonProps = {
  examId: string
}

export const StartExamButton = ({ examId }: StartExamButtonProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>Start exam</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Start exam</DialogTitle>
        <DialogDescription>
          Select whether you want to use a random or default question order.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Link
          href={`/exams/${examId}/attempt?randomOrder=true`}
          className={buttonVariants({ variant: "outline" })}
        >
          Random
        </Link>
        <Link
          href={`/exams/${examId}/attempt`}
          className={buttonVariants({ variant: "outline" })}
        >
          Default
        </Link>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
