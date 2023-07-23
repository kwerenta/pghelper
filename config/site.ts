import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "PGHelper",
  description: "Tools for PG students.",
  sidebarNav: [
    {
      title: "Timetable",
      href: "/timetable",
      icon: "sheet",
    },
    {
      title: "Calendar",
      href: "https://www.kiedy-kolos.pl/?fbclid=IwAR3Nzv7L_IGTBqBppZ9rVuwH_HF7ddx9nGD-g_6i2v7k6CjACKRDwYibLtA#/calendar/c791fb6c-a004-4065-8402-af334fc6907e",
      external: true,
      icon: "calendarDays",
    },
    {
      title: "Quiz",
      href: "/quiz",
      icon: "lightbulb",
    },
  ],
}
