"use client"

import { useState } from "react"
import { answers, questions } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { InferModel } from "drizzle-orm"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { toast } from "@/hooks/useToast"

import { Button } from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Checkbox } from "./ui/Checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form"
import { ToastAction } from "./ui/Toast"

const answersSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number().positive(),
      answers: z.array(z.number()),
    }),
  ),
})

interface QuizFormProps {
  questions: (InferModel<typeof questions> & {
    answers: InferModel<typeof answers>[]
  })[]
}

export const QuizForm = ({ questions }: QuizFormProps) => {
  const form = useForm<z.infer<typeof answersSchema>>({
    resolver: zodResolver(answersSchema),
    defaultValues: {
      questions: questions.map((question) => ({
        id: question.id,
        answers: [],
      })),
    },
  })

  const onSubmit = (data: z.infer<typeof answersSchema>) => {
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
                  <FormItem className="space-y-2">
                    {question.answers.map((answer) => (
                      <FormField
                        key={answer.id}
                        control={form.control}
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
                                      ? field.onChange([
                                          ...field.value,
                                          answer.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== answer.id,
                                          ),
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {answer.text}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
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
