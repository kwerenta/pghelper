"use client"

import type { Answer, Question } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ExamAttemptParams, examAttempSchema } from "@/lib/validators/exam"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form"

import { MultipleChoiceAnswers } from "./MultipleChoiceAnswers"
import { SingleChoiceAnswers } from "./SingleChoiceAnswers"

type ExamFormProps = {
  questions: (Question & {
    answers: Answer[]
  })[]
}

export const ExamForm = ({ questions }: ExamFormProps) => {
  const form = useForm<ExamAttemptParams>({
    resolver: zodResolver(examAttempSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        id: question.id,
        answers: [],
      })),
    },
  })

  const onSubmit = (data: ExamAttemptParams) => {
    const correctQuestions = questions.filter((question) =>
      question.answers.every((answer) => {
        const hasAnswer = data.questions
          .find((userQuestion) => userQuestion.id === question.id)
          ?.answers.includes(answer.id)
        return hasAnswer === answer.isCorrect
      }),
    )

    toast(`Score: ${correctQuestions.length} / ${questions.length}`, {
      description: `${Math.floor(
        (correctQuestions.length / questions.length) * 100,
      )}%`,
      action:
        correctQuestions.length !== questions.length
          ? {
              label: "Show incorrect answers",
              onClick: () =>
                questions.forEach((question, index) => {
                  if (!correctQuestions.includes(question))
                    form.setError(`questions.${index}.answers`, {
                      type: "manual",
                      message: "Invalid answer.",
                    })
                }),
            }
          : undefined,
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
