export type Interview = {
  id: string
  userId: string,
  userEmail?: string,
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
  position: string
  date: string
  location: string
  status: string
  statusHistory?: { status: string; date: string }[]
  interviews?: Interview[]
}

