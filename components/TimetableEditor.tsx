"use client"

import { useState } from "react"

import { TimetableEntry } from "@/lib/timetable"
import { cn } from "@/lib/utils"

import { Icons } from "./Icons"
import { Button } from "./ui/Button"
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup"
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
}: {
  timetableEntries: TimetableEntry[]
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const defaultDeanGroup = timetableEntries
    .find((entry) => entry.course.name == selectedCourse)
    ?.deanGroup.toString()

  return (
    <Sheet onOpenChange={() => setSelectedCourse(null)}>
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
          <div className="space-y-1">
            <Label>Course</Label>
            <Select onValueChange={(value) => setSelectedCourse(value)}>
              <SelectTrigger className={cn(selectedCourse && "capitalize")}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Courses</SelectLabel>
                  {timetableEntries.map((entry) => (
                    <SelectItem
                      key={entry.courseId}
                      value={entry.course.name}
                      className="capitalize"
                    >
                      {entry.course.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedCourse && (
            <div className="space-y-1">
              <Label htmlFor="timeslot">Choose timeslot</Label>
              <RadioGroup id="timeslot" defaultValue={defaultDeanGroup}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="r1" />
                  <Label htmlFor="r1">Group 3 | Monday 15-17</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="r2" />
                  <Label htmlFor="r2">Group 5 | Friday 7-9</Label>
                </div>
              </RadioGroup>
            </div>
          )}
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
