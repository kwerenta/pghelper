import { Control, useFieldArray } from "react-hook-form"

import type { NewExamValues } from "@/lib/validators/exam"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Switch } from "@/components/ui/Switch"
import { Textarea } from "@/components/ui/Textarea"
import { Icons } from "@/components/Icons"

type ExamQuestionFormProps = {
  control: Control<NewExamValues>
  index: number
  errors: string | undefined
  validateAnswers: () => void
  removeQuestion: () => void
}

export const ExamQuestionForm = ({
  control,
  errors,
  index,
  validateAnswers,
  removeQuestion,
}: ExamQuestionFormProps) => {
  const {
    fields: answers,
    remove: removeAnswer,
    append: addAnswer,
  } = useFieldArray({
    control,
    name: `questions.${index}.answers`,
  })

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <CardTitle>Question {index + 1}</CardTitle>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={removeQuestion}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={control}
          name={`questions.${index}.text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(e: typeof field.value) => {
                    field.onChange(e)
                    validateAnswers()
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="single_choice" />
                    </FormControl>
                    <FormLabel className="font-normal">Single choice</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="multiple_choice" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Multiple choice
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ul className="space-y-4 px-4 pt-4">
          {answers.map((answer, answerIndex) => (
            <li key={answer.id} className="flex items-start space-x-2">
              <FormField
                control={control}
                name={`questions.${index}.answers.${answerIndex}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input type="text" placeholder="Text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <FormField
                  control={control}
                  name={`questions.${index}.answers.${answerIndex}.isCorrect`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e)
                            validateAnswers()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => removeAnswer(answerIndex)}
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
          <li>
            <Button
              variant="secondary"
              type="button"
              disabled={answers.length === 8}
              onClick={() =>
                addAnswer({
                  isCorrect: false,
                  text: "",
                })
              }
            >
              Add answer
            </Button>
          </li>
        </ul>
        {errors ? (
          <p className="px-4 text-sm font-medium text-destructive">{errors}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
