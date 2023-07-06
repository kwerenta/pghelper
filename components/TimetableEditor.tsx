"use client"

import { Timeslot } from "@/db/schema"

import { TimetableEntry } from "@/lib/timetable"

import { Icons } from "./Icons"
import { Button } from "./ui/Button"
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
import { Label } from "./ui/label"

export const TimetableEditor = ({
  timetableEntries,
  timeslots,
}: {
  timetableEntries: TimetableEntry[]
  timeslots: Timeslot[]
}) => {
  return (
    <Sheet>
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

        <div className="space-y-4 py-4">
          {timetableEntries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <Label className="capitalize">{entry.course.name}</Label>
              <Select defaultValue={entry.deanGroup.toString()}>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Timeslot</SelectLabel>
                    {timeslots
                      .filter((timeslot) => timeslot.courseId == entry.courseId)
                      .map((timeslot) => (
                        <SelectItem
                          key={timeslot.id}
                          className="capitalize"
                          value={timeslot.deanGroup.toString()}
                        >
                          Group {timeslot.deanGroup} | {timeslot.startTime}:00 -{" "}
                          {timeslot.endTime}:00 {timeslot.weekday}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
