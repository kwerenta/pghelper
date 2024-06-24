"use client"

import { useState } from "react"
import type { Course, DeanGroup, Timeslot } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

import { updateTimetable } from "@/lib/api/actions/timetable"
import { type TimetableEntry } from "@/lib/api/queries/timeslots"
import { actionToast } from "@/lib/utils"
import {
  UpdateTimetableParams,
  timetableEditorSchema,
} from "@/lib/validators/timetable"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet"
import { Icons } from "@/components/Icons"

type TimetableEditorProps = {
  currentTimetable: TimetableEntry[]
  courses: Omit<Course, "semesterId" | "frequency">[]
  timeslots: Timeslot[]
  deanGroups: Omit<DeanGroup, "semesterId">[]
}

export const TimetableEditor = ({
  currentTimetable,
  courses,
  deanGroups,
  timeslots,
}: TimetableEditorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<UpdateTimetableParams>({
    resolver: zodResolver(timetableEditorSchema),
    defaultValues: {
      timeslots: courses.map((course) => {
        const entry = currentTimetable.find(
          (entry) => entry.courseId === course.id,
        )

        return {
          courseId: course.id,
          timeslotId: entry?.id ?? 0,
        }
      }),
    },
  })
  const { fields } = useFieldArray({ name: "timeslots", control: form.control })

  const onSubmit = async (data: UpdateTimetableParams) => {
    const filteredData = data.timeslots.filter(
      (_, index) => form.getFieldState(`timeslots.${index}`).isDirty,
    )
    if (filteredData.length === 0) return

    const result = await updateTimetable({ timeslots: filteredData })
    actionToast(result)

    if (result.success) {
      form.reset(form.getValues())
      setIsOpen(false)
    }
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
        <Button variant="default" className="shrink-0">
          <Icons.penSquare className="mr-2 size-4" />
          Edit timetable
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
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
            {fields.map((entry, index) => {
              const course = courses.find((c) => entry.courseId === c.id)
              return (
                <div key={entry.id}>
                  <FormField
                    control={form.control}
                    name={`timeslots.${index}.timeslotId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {`${course?.name} [${course?.type[0].toUpperCase()}]`}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value))
                          }}
                          defaultValue={
                            field.value === 0 ? "" : field.value.toString()
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a timeslot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[{ id: null, number: 0 }, ...deanGroups].map(
                              (deanGroup) => {
                                const groupTimeslots = timeslots.filter(
                                  (timeslot) =>
                                    timeslot.courseId === entry.courseId &&
                                    timeslot.deanGroupId === deanGroup.id,
                                )

                                if (groupTimeslots.length === 0) return null

                                return (
                                  <SelectGroupTimeslotContent
                                    deanGroupNumber={deanGroup.number}
                                    timeslots={groupTimeslots}
                                  />
                                )
                              },
                            )}
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
              )
            })}
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

const SelectGroupTimeslotContent = ({
  deanGroupNumber,
  timeslots,
}: {
  deanGroupNumber: number
  timeslots: Timeslot[]
}) => (
  <SelectGroup>
    <SelectLabel>Group {deanGroupNumber}</SelectLabel>
    {timeslots.map((timeslot) => (
      <SelectItem key={timeslot.id} value={timeslot.id.toString()}>
        <span className="capitalize">{timeslot.weekday}, </span>
        {timeslot.startTime}:00 - {timeslot.endTime}:00{" "}
        {timeslot.subgroup && String.fromCharCode(timeslot.subgroup + 64)}
      </SelectItem>
    ))}
  </SelectGroup>
)
