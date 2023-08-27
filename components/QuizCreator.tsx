"use client"

import { Course } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { catchActionErrors } from "@/lib/exceptions"
import { cn } from "@/lib/utils"
import { quizSchema } from "@/lib/validators/quiz"
import { toast } from "@/hooks/useToast"
import { createQuiz } from "@/app/(dashboard)/quiz/new/actions"

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/Command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form"
import { Input } from "./ui/Input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover"
import { Textarea } from "./ui/Textarea"

const DEFAULT_QUESTION: z.infer<typeof quizSchema>["questions"][number] = {
  text: "",
  type: "single_choice",
  answers: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
}

type QuizCreatorProps = {
  courses: Pick<Course, "id" | "name">[]
}

export const QuizCreator = ({ courses }: QuizCreatorProps) => {
  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: 0,
      questions: [DEFAULT_QUESTION],
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
    try {
      await createQuiz(data)

      toast({
        description: "Successfully created quiz.",
      })
    } catch (error) {
      catchActionErrors(error)
    }
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
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value
                              ? "text-muted-foreground"
                              : "capitalize",
                          )}
                        >
                          {field.value
                            ? courses.find(
                                (course) => course.id === field.value,
                              )?.name
                            : "Select course"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup>
                          {courses.map((course) => (
                            <CommandItem
                              className="capitalize"
                              value={course.name}
                              key={course.id}
                              onSelect={() => {
                                form.setValue("courseId", course.id)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  course.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {course.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {questionFields.map((question, index) => (
          <QuizQuestionForm
            key={question.id}
            control={form.control}
            index={index}
            errors={form.formState.errors?.questions?.[index]?.answers?.message}
            validateAnswers={() => form.trigger(`questions.${index}.answers`)}
            removeQuestion={() => removeQuestion(index)}
          />
        ))}

        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => addQuestion(DEFAULT_QUESTION)}
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
