import type { Answer, Question } from "@/db/schema"
import { Control } from "react-hook-form"

import { transformStringToNumber } from "@/lib/utils"
import { ExamAttemptParams } from "@/lib/validators/exam"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"

type SingleChoiceAnswersProps = {
  control: Control<ExamAttemptParams>
  index: number
  question: Question & {
    answers: Answer[]
  }
}

export const SingleChoiceAnswers = ({
  control,
  index,
  question,
}: SingleChoiceAnswersProps) => {
  return (
    <FormField
      control={control}
      name={`questions.${index}.answers`}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={(e) => {
                  field.onChange([transformStringToNumber(e)])
                }}
                defaultValue={field.value.toString()}
              >
                {question.answers.map((answer) => (
                  <FormItem
                    key={answer.id}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={answer.id.toString()} />
                    </FormControl>
                    <FormLabel className="font-normal">{answer.text}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )
      }}
    />
  )
}
