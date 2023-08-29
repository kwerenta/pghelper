"use client"

import { useRouter } from "next/navigation"
import { Course } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { NewExamValues, examSchema } from "@/lib/validators/exam"
import { useActionToast } from "@/hooks/useActionToast"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Textarea } from "@/components/ui/Textarea"
import { ExamQuestionForm } from "@/app/(dashboard)/exam/new/_components/ExamQuestionForm"
import { createExam } from "@/app/(dashboard)/exam/new/actions"

const DEFAULT_QUESTION: NewExamValues["questions"][number] = {
  text: "",
  type: "single_choice",
  answers: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
}

type ExamCreatorProps = {
  courses: Pick<Course, "id" | "name">[]
}

export const ExamCreator = ({ courses }: ExamCreatorProps) => {
  const router = useRouter()
  const actionToast = useActionToast()

  const form = useForm<NewExamValues>({
    resolver: zodResolver(examSchema),
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

  const onSubmit = async (data: NewExamValues) => {
    const result = await createExam(data)
    if (result.success) router.push("/exams")

    actionToast(result)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>General exam settings</CardDescription>
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
          <ExamQuestionForm
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
            Create exam
          </Button>
        </div>
      </form>
    </Form>
  )
}
