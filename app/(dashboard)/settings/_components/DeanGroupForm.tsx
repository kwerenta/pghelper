"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { transformStringToNumber } from "@/lib/utils"
import {
  UpdateDeanGroupParams,
  updateDeanGroupSchema,
} from "@/lib/validators/deanGroup"
import { useActionToast } from "@/hooks/useActionToast"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

import { updateDeanGroup } from "../../../../lib/api/actions/deanGroup"

type DeanGroupFormProps = {
  userDeanGroup: number
  deanGroups: number[]
}

export const DeanGroupForm = ({
  userDeanGroup,
  deanGroups,
}: DeanGroupFormProps) => {
  const actionToast = useActionToast()

  const form = useForm<UpdateDeanGroupParams>({
    resolver: zodResolver(updateDeanGroupSchema),
    defaultValues: { deanGroup: userDeanGroup, mode: "replace" },
  })

  const hasGroupChanged = form.getValues("deanGroup") !== userDeanGroup

  const handleSubmit = async (values: UpdateDeanGroupParams) => {
    const result = await updateDeanGroup(values)
    actionToast(result)
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Your dean group</CardTitle>
            <CardDescription>Please select your dean group.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="deanGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select your dean group</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(transformStringToNumber(value))
                    }
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your dean group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasGroupChanged ? (
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(e: typeof field.value) => {
                          field.onChange(e)
                        }}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="replace" />
                          </FormControl>
                          <FormLabel className="font-normal">Replace</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="keep" />
                          </FormControl>
                          <FormLabel className="font-normal">Keep</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Choose whether you want to keep current timetable or
                      replace it with new dean group&apos;s one
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!hasGroupChanged}>
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
