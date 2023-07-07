"use client"

import { Timeslot } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { TimetableEntry } from "@/lib/timetable"

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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/Sheet"

const formSchema = z.record(z.string())

export const TimetableEditor = ({
  timetableEntries,
  timeslots,
}: {
  timetableEntries: TimetableEntry[]
  timeslots: Timeslot[]
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      timetableEntries.map((entry) => [
        entry.courseId.toString(),
        entry.deanGroup.toString(),
      ]),
    ),
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    console.log(data)
  }

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) form.reset()
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default">
          <Icons.edit className="mr-2 h-4 w-4" />
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
            {timetableEntries.map((entry) => (
              <FormField
                key={entry.id}
                control={form.control}
                name={entry.courseId.toString()}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {entry.course.name}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                              (timeslot) => timeslot.courseId == entry.courseId,
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
            ))}
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
