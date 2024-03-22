"use client"

import { useRouter } from "next/navigation"
import { DeanGroup } from "@/db/schema"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

type SelectDeanGroupTimetableProps = {
  currentDeanGroup?: number
  deanGroups: Omit<DeanGroup, "semesterId">[]
}

export const SelectDeanGroupTimetable = ({
  currentDeanGroup,
  deanGroups,
}: SelectDeanGroupTimetableProps) => {
  const router = useRouter()
  return (
    <Select
      value={currentDeanGroup?.toString() || ""}
      onValueChange={(value) => router.push(`/timetable/${value}`)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select group" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Your timetable</SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Dean groups</SelectLabel>
          {deanGroups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.number}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
