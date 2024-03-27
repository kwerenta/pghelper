// Copy and paste this script into the browser console on the sis.eti.pg.edu.pl timetable page

// Set these values according to the current semester and dean group id
const SEMESTER_ID = 1
const DEAN_GROUP_ID = 1

const DAYS_MAP = ["monday", "tuesday", "wednesday", "thursday", "friday"]

const COURSE_TYPE_MAP = {
  W: "lecture",
  C: "tutorial",
  L: "laboratory",
  P: "project",
}

const timeslots = []
const courses = []

const hourRows = document.querySelectorAll("tbody > tr:not(:first-child)")
hourRows?.forEach((row) => {
  const hour = Number(row.firstElementChild?.textContent?.trim().split(":")[0])

  row.querySelectorAll("td:not(:first-child)").forEach((cell, index) => {
    // Cells without indiv class are empty
    if (!cell.classList.contains("indiv")) return

    const weekday = DAYS_MAP[index]

    // One cell can have multiple timeslots
    const subjectsCount = cell.querySelectorAll("a.subject_name").length

    for (let i = 1; i <= subjectsCount; i++) {
      const subjectSelector = `a.subject_name:nth-of-type(${i})`
      const courseName = cell
        .querySelector(subjectSelector)
        ?.textContent?.trim()
      if (!courseName) throw new Error("Course name not found")

      const courseIndex = cell
        .querySelector(`b:has(+ ${subjectSelector})`)
        ?.textContent?.trim()[1]

      if (!courseIndex) throw new Error("Course type not found")
      if (!(courseIndex in COURSE_TYPE_MAP))
        throw new Error("Invalid course index")

      const courseType = COURSE_TYPE_MAP[courseIndex]

      const room = cell
        .querySelector(`b:has(+ br + b + ${subjectSelector})`)
        ?.textContent?.trim()
      if (!room) throw new Error("Room not found")

      const teacher = cell.querySelector(`${subjectSelector} + br`)?.nextSibling
        ?.textContent
      if (!teacher) throw new Error("Teacher not found")

      // Additional info such as frequency, end date, etc.
      const additionalInfo = cell.querySelector(
        `${subjectSelector} + br + br + b:not(:has(+ br + b + a.subject_name))`,
      )?.textContent

      let frequency = "every_week"
      let deanGroup = courseType === "lecture" ? null : DEAN_GROUP_ID

      if (additionalInfo) {
        additionalInfo.split(";").forEach((info) => {
          let formattedInfo = info.trim().toLocaleLowerCase()

          if (formattedInfo.startsWith("co 2 tygodnie"))
            frequency = "every_two_weeks"
          else if (formattedInfo.startsWith("termin wspólny"))
            // deanGroup = Number(info.split("gr.")[1].trim())
            deanGroup = null
          else if (formattedInfo.startsWith("dodatkowa grupa")) deanGroup = null
          // This typo is also present in the original data
          else if (formattedInfo.startsWith("termin dpdatkowy"))
            deanGroup = null
        })
      }

      let courseId = courses.findIndex(
        (course) => course.name === courseName && course.type === courseType,
      )

      if (courseId === -1) {
        courseId =
          courses.push({
            name: courseName,
            type: courseType,
            frequency,
            semesterId: SEMESTER_ID,
          }) - 1
      }

      const timeslotToMerge = timeslots.find(
        (timeslot) =>
          timeslot.courseId === courseId &&
          timeslot.weekday === weekday &&
          timeslot.deanGroupId === deanGroup &&
          timeslot.endTime === hour,
      )

      if (timeslotToMerge) {
        timeslotToMerge.endTime += 1
        continue
      }

      timeslots.push({
        courseId,
        weekday,
        startTime: hour,
        endTime: hour + 1,
        deanGroupId: deanGroup,
      })
    }
  })
})

courses.reduce((query, course, courseId) => {
  courseQuery = `INSERT IGNORE INTO course (name, type, frequency, semester_id) VALUES ('${course.name}', '${course.type}', '${course.frequency}', ${course.semesterId});\n`
  courseQuery += `SET @courseId = (SELECT id FROM course WHERE name = '${course.name}' AND type = '${course.type}' AND frequency = '${course.frequency}' AND semester_id = ${course.semesterId});\n`
  return (
    query +
    courseQuery +
    timeslots
      .filter((timeslot) => timeslot.courseId === courseId)
      .reduce(
        (timeslotQuery, timeslot) =>
          timeslotQuery +
          `INSERT INTO timeslot (course_id, weekday, start_time, end_time, dean_group_id) VALUES (@courseId, '${timeslot.weekday}', ${timeslot.startTime}, ${timeslot.endTime}, ${timeslot.deanGroupId});\n`,
        "",
      )
  )
}, "")
