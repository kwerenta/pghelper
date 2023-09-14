"use client"

import { useRouter } from "next/navigation"

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
  deanGroup?: number
  deanGroups: number[]
}

export const SelectDeanGroupTimetable = ({
  deanGroup,
  deanGroups,
}: SelectDeanGroupTimetableProps) => {
  const router = useRouter()
  return (
    <Select
      defaultValue={deanGroup?.toString() || ""}
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
            <SelectItem key={group} value={group.toString()}>
              {group}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
