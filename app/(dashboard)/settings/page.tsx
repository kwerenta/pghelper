import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Settings"
        description="Edit your account settings."
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input id="name" className="w-[400px]" size={32} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled>
            <span>Save</span>
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
