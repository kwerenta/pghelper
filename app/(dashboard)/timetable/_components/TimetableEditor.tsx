"use client"

import { useState } from "react"
import type { Course, DeanGroup, DeanGroupId, Timeslot } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

import { updateTimetable } from "@/lib/api/actions/timetable"
import { type TimetableEntry } from "@/lib/api/queries/timeslots"
import {
  UpdateTimetableParams,
  timetableEditorSchema,
} from "@/lib/validators/timetable"
import { useActionToast } from "@/hooks/useActionToast"
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
  timeslots: (Timeslot & { deanGroup?: DeanGroup })[]
}

type UpdateTimetableGroupParam =
  UpdateTimetableParams["timeslots"][number]["group"]

function formatGroupValue(
  deanGroupId: UpdateTimetableGroupParam["deanGroupId"],
  subgroup: UpdateTimetableGroupParam["subgroup"],
) {
  if (deanGroupId === null && subgroup === null) return ""
  return `${deanGroupId ?? "0"}_${subgroup ?? "0"}`
}

export const TimetableEditor = ({
  currentTimetable,
  courses,
  timeslots,
}: TimetableEditorProps) => {
  const actionToast = useActionToast()
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
          group: {
            deanGroupId: entry?.deanGroupId ?? null,
            subgroup: entry?.subgroup ?? null,
          },
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
                    name={`timeslots.${index}.group`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {`${course?.name} [${course?.type[0].toUpperCase()}]`}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const [deanGroupId, subgroup] = value.split("_")
                            field.onChange({
                              deanGroupId:
                                deanGroupId !== "0"
                                  ? Number(deanGroupId)
                                  : null,
                              subgroup:
                                subgroup !== "0" ? Number(subgroup) : null,
                            })
                          }}
                          defaultValue={formatGroupValue(
                            field.value.deanGroupId,
                            field.value.subgroup,
                          )}
                        >
                          <FormControl>
                            <SelectTrigger className="capitalize">
                              <SelectValue placeholder="Select a timeslot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeslots
                              .filter(
                                (timeslot) =>
                                  timeslot.courseId === entry.courseId,
                              )
                              .map((timeslot) => (
                                <SelectItem
                                  key={timeslot.id}
                                  className="capitalize"
                                  value={`${timeslot.deanGroupId ?? "0"}_${timeslot.subgroup ?? "0"}`}
                                >
                                  Group {timeslot.deanGroup?.number ?? "0"} |{" "}
                                  {timeslot.startTime}
                                  :00 - {timeslot.endTime}:00 {timeslot.weekday}
                                </SelectItem>
                              ))}
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
