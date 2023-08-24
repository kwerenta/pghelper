"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Timeslot } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { transformStringToNumber } from "@/lib/utils"
import { timetableEditorSchema } from "@/lib/validators/timetable"
import { useToast } from "@/hooks/useToast"
import { TimetableEntry } from "@/app/(dashboard)/timetable/loaders"

import { Icons } from "./Icons"
import { Button } from "./ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/Sheet"

export const TimetableEditor = ({
  timetableEntries,
  timeslots,
}: {
  timetableEntries: TimetableEntry[]
  timeslots: Timeslot[]
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof timetableEditorSchema>>({
    resolver: zodResolver(timetableEditorSchema),
    defaultValues: {
      timeslots: timetableEntries.map((entry) => ({
        courseId: entry.courseId,
        deanGroup: entry.deanGroup,
      })),
    },
  })
  const { fields } = useFieldArray({ name: "timeslots", control: form.control })

  const onSubmit = async (data: z.infer<typeof timetableEditorSchema>) => {
    const filteredData = data.timeslots.filter(
      (_, index) => form.getFieldState(`timeslots.${index}`).isDirty,
    )
    if (filteredData.length === 0) return

    const res = await fetch("/api/timetable", {
      body: JSON.stringify({ timeslots: filteredData }),
      method: "POST",
    })
    const body = await res.json()

    if (res.ok) {
      router.refresh()
      form.reset(form.getValues())
    }

    setIsOpen(false)
    toast({
      variant: res.ok ? "default" : "destructive",
      description: body.message,
    })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (form.formState.isSubmitting) return
        setIsOpen(open)
        if (!open) form.reset()
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default">
          <Icons.penSquare className="mr-2 h-4 w-4" />
          Edit timetable
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit timetable</SheetTitle>
          <SheetDescription>
            Change what classes you attend in which dean&apos;s group
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {fields.map((entry, index) => (
              <div key={entry.id}>
                <FormField
                  control={form.control}
                  name={`timeslots.${index}.deanGroup`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {timetableEntries.find(
                          (e) => entry.courseId === e.courseId,
                        )?.course.name ?? "Unknown course"}
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(transformStringToNumber(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Select a timeslot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Timeslots</SelectLabel>
                            {timeslots
                              .filter(
                                (timeslot) =>
                                  timeslot.courseId === entry.courseId,
                              )
                              .map((timeslot) => (
                                <SelectItem
                                  key={timeslot.id}
                                  className="capitalize"
                                  value={timeslot.deanGroup.toString()}
                                >
                                  Group {timeslot.deanGroup} |{" "}
                                  {timeslot.startTime}
                                  :00 - {timeslot.endTime}:00 {timeslot.weekday}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`timeslots.${index}.courseId`}
                  control={form.control}
                  defaultValue={entry.courseId}
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </div>
            ))}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
