export type Profile = {
  email: string,
  name: string, 
  pfp: string,
  firstName: string,
  lastName: string,
  location: string,
  bio: string,
  linkedin: string,
  github: string,
  experiences: Array<{ title: string; company: string; duration: string }>,
  education: Array<{ degree: string; institution: string; year: string }>,
}

export type Sheet = {
  userId: string,
  visibility: boolean,
  title: string,
}

export type JobApplication = {
  _id: string
  // userId: string -- Don't need this on the frontend, we attach it before it gets sent to the backend.
  companyName: string
  position: string
  date: string
  location: string
  status: string
  statusHistory?: { status: string; date: string }[]
  interviews?: Interview[]
}

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

