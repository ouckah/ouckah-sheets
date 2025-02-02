import type { Interview, JobApplication } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DateRangeOption = "today" | "thisWeek" | "thisMonth" | "custom" | "all"

type InterviewListProps = {
  interviews: Interview[]
  jobApplications: JobApplication[]
  dateRange: DateRangeOption
  selectedDate: Date | undefined
}

export function InterviewList({ interviews, jobApplications, dateRange, selectedDate }: InterviewListProps) {
  const getTitle = () => {
    switch (dateRange) {
      case "today":
        return "Today's Interviews"
      case "thisWeek":
        return "This Week's Interviews"
      case "thisMonth":
        return "This Month's Interviews"
      case "custom":
        return selectedDate ? `Interviews on ${selectedDate.toLocaleDateString()}` : "Upcoming Interviews"
      case "all":
      default:
        return "All Interviews"
    }
  }

  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedInterviews.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled for this date range.</p>
        ) : (
          <ul className="space-y-4">
            {sortedInterviews.map((interview) => {
              const jobApplication = jobApplications.find((app) => app.id === interview.jobApplicationId)
              return (
                <li key={interview.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold">{jobApplication?.companyName || "Unknown Company"}</h3>
                  <p>
                    {new Date(interview.date).toLocaleDateString()} at {interview.time}
                  </p>
                  <p>
                    {interview.interviewType} interview with {interview.interviewerName}
                  </p>
                  {interview.notes && <p className="text-sm text-gray-500 mt-2">{interview.notes}</p>}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

