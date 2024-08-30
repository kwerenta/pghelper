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
      value={currentDeanGroup?.toString() || "0"}
      onValueChange={(value) => router.push(`/timetable/group/${value}`)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select group" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Your timetable</SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Dean groups</SelectLabel>
          {deanGroups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.number} {group.stream && `| ${group.stream}`}{" "}
              {group.profile && `| ${group.profile}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
