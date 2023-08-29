"use client"

import type { Answer, Question } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ExamAttemptValues, examAttempSchema } from "@/lib/validators/exam"
import { toast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form"
import { ToastAction } from "@/components/ui/Toast"

import { MultipleChoiceAnswers } from "./MultipleChoiceAnswers"
import { SingleChoiceAnswers } from "./SingleChoiceAnswers"

type ExamFormProps = {
  questions: (Question & {
    answers: Answer[]
  })[]
}

export const ExamForm = ({ questions }: ExamFormProps) => {
  const form = useForm<ExamAttemptValues>({
    resolver: zodResolver(examAttempSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        id: question.id,
        answers: [],
      })),
    },
  })

  const onSubmit = (data: ExamAttemptValues) => {
    const correctQuestions = questions.filter((question) =>
      question.answers.every((answer) => {
        const hasAnswer = data.questions
          .find((userQuestion) => userQuestion.id === question.id)
          ?.answers.includes(answer.id)
        return hasAnswer === answer.isCorrect
      }),
    )

    toast({
      title: `Score: ${correctQuestions.length} / ${questions.length}`,
      description: `${Math.floor(
        (correctQuestions.length / questions.length) * 100,
      )}%`,
      action:
        correctQuestions.length !== questions.length ? (
          <ToastAction
            altText="Show which answers are incorrect"
            onClick={() =>
              questions.forEach((question, index) => {
                if (!correctQuestions.includes(question))
                  form.setError(`questions.${index}.answers`, {
                    type: "manual",
                    message: "Invalid answer.",
                  })
              })
            }
          >
            Show errors
          </ToastAction>
        ) : undefined,
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name={`questions.${index}.id`}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <FormField
                control={form.control}
                name={`questions.${index}.answers`}
                render={() => (
                  <FormItem>
                    {question.type === "single_choice" ? (
                      <SingleChoiceAnswers
                        control={form.control}
                        index={index}
                        question={question}
                      />
                    ) : (
                      <MultipleChoiceAnswers
                        control={form.control}
                        index={index}
                        question={question}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
