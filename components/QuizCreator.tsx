"use client"

import { questions } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { QuizQuestionForm } from "./QuizQuestionForm"
import { Button } from "./ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"

export const quizSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  course: z.string().min(1).max(255),
  questions: z
    .array(
      z.object({
        text: z.string().min(3).max(1023),
        type: z.enum(questions.type.enumValues),
        answers: z
          .array(
            z.object({
              text: z.string().min(1).max(255),
              isCorrect: z.boolean(),
            }),
          )
          .min(2)
          .max(8),
      }),
    )
    .min(1)
    .max(255),
})

export const QuizCreator = () => {
  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [],
    },
  })

  const {
    fields: questionFields,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    name: "questions",
    control: form.control,
  })

  const onSubmit = async (data: z.infer<typeof quizSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>General quiz settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() =>
            addQuestion({
              text: "",
              type: "single_choice",
              answers: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
              ],
            })
          }
        >
          Add new question
        </Button>

        <div className="mt-4">
          <Button type="submit" size="lg">
            Create quiz
          </Button>
        </div>
      </form>
    </Form>
  )
}
