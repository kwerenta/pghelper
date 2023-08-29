import type { Answer, Question } from "@/db/schema"
import { Control } from "react-hook-form"

import { ExamAttemptValues } from "@/lib/validators/exam"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"

type MultipleChoiceAnswersProps = {
  control: Control<ExamAttemptValues>
  index: number
  question: Question & {
    answers: Answer[]
  }
}

export const MultipleChoiceAnswers = ({
  control,
  index,
  question,
}: MultipleChoiceAnswersProps) => {
  return question.answers.map((answer) => (
    <FormField
      key={answer.id}
      control={control}
      name={`questions.${index}.answers`}
      render={({ field }) => {
        return (
          <FormItem
            key={answer.id}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <FormControl>
              <Checkbox
                checked={field.value?.includes(answer.id)}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...field.value, answer.id])
                    : field.onChange(
                        field.value?.filter((value) => value !== answer.id),
                      )
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">{answer.text}</FormLabel>
          </FormItem>
        )
      }}
    />
  ))
}
