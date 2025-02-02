export type Interview = {
  id: string
  jobApplicationId: string
  date: string
  time: string
  interviewerName: string
  interviewType: "Phone" | "Video" | "In-person"
  notes: string
}

export type JobApplication = {
  id: string
  companyName: string
  date: string
  location: string
  status: string
  statusHistory?: { status: string; date: string }[]
  interviews?: Interview[]
}

