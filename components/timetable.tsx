import {
  DAYS_OF_WEEK,
  FIRST_SUBJECT_HOUR,
  LAST_SUBJECT_HOUR,
} from "@/config/timetable"

export function Timetable() {
  return (
    <div className="flex overflow-x-auto">
      <table className="mb-4 flex-1 text-foreground">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background py-2">Hour</th>
            {DAYS_OF_WEEK.map((day, i) => (
              <th key={i}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length: LAST_SUBJECT_HOUR - FIRST_SUBJECT_HOUR + 1,
          }).map((_, i) => (
            <tr key={i} className="text-center">
              <th className="sticky left-0 bg-background pr-4 md:pl-4">{`${
                i + FIRST_SUBJECT_HOUR
              }:00`}</th>
              {DAYS_OF_WEEK.map((_, i) => {
                return (
                  <td
                    key={i}
                    className="min-w-[16rem] border-l-2 border-l-muted-foreground px-1 py-2 md:min-w-[12rem] md:px-2 lg:min-w-0 lg:px-4"
                  >
                    <p>[Wykład]</p>
                    Algorytmy i struktury danych
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
