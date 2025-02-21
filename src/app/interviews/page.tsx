"use client"

import { useState, useMemo, useEffect } from "react"
import { InterviewCalendar } from "@/components/InterviewCalendar"
import { InterviewForm } from "@/components/InterviewForm"
import { InterviewList } from "@/components/InterviewList"
import { DateRangeSelector } from "@/components/DateRangeSelector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import type { Interview, JobApplication } from "@/types"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

type DateRangeOption = "all" | "today" | "thisWeek" | "thisMonth" | "custom"

const fetchJobApplications = async (email: string) => {
  try {
    const response = await fetch(`/api/application/get/${email}`);
    if (!response.ok) throw new Error("Failed to fetch job applications");
    const data = await response.json();
    
    const jobApplications = data.applications;
    return jobApplications;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchInterviews = async (email: string) => {
  try {
    const response = await fetch(`/api/interview/get/${email}`);
    if (!response.ok) throw new Error("Failed to fetch interviews");
    const data = await response.json();

    const interviews = data.interviews;
    return interviews;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default function InterviewsPage() {
  const { data: session, status } = useSession();
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<DateRangeOption>("all")
  const [isPublic, setIsPublic] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const loadData = async () => {
        const [fetchedJobApplications, fetchedInterviews] = await Promise.all([
          fetchJobApplications(session.user?.email as string),
          fetchInterviews(session.user?.email as string),
        ]);
        setJobApplications(fetchedJobApplications);
        setInterviews(fetchedInterviews);
      };

      loadData();
    }
  }, [session, status]);

  const handleAddInterview = async (newInterview: Omit<Interview, "id">) => {
    try {
      if (session?.user?.email) {
        newInterview.userEmail = session?.user?.email;
      }

      const response = await fetch(`/api/interview/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInterview),
      });

      if (!response.ok) throw new Error("Failed to schedule interview");

      const addedInterview = await response.json();

      setInterviews((prevInterviews) =>
        [...prevInterviews, addedInterview].sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        })
      );

      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled for ${new Date(addedInterview.date).toLocaleDateString()} at ${addedInterview.time}`,
      });
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setDateRange("custom")
    }
  }

  const handleDateRangeChange = (newRange: DateRangeOption) => {
    setDateRange(newRange)
    if (newRange !== "custom") {
      setSelectedDate(undefined)
    }
  }

  const filteredInterviews = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())

    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.date)

      switch (dateRange) {
        case "today":
          return interviewDate.toDateString() === now.toDateString()
        case "thisWeek":
          return (
            interviewDate >= startOfWeek && interviewDate < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
        case "thisMonth":
          return interviewDate.getMonth() === now.getMonth() && interviewDate.getFullYear() === now.getFullYear()
        case "custom":
          return selectedDate ? interviewDate.toDateString() === selectedDate.toDateString() : true
        case "all":
        default:
          return true
      }
    })
  }, [interviews, dateRange, selectedDate])

  const handleVisibilityToggle = () => {
    setPendingVisibilityChange(!isPublic)
    setShowConfirmationModal(true)
  }

  const confirmVisibilityChange = () => {
    setIsPublic(pendingVisibilityChange)
    setShowConfirmationModal(false)
    // TODO: update this setting in backend
    toast({
      title: pendingVisibilityChange ? "Interviews set to public" : "Interviews set to private",
      description: pendingVisibilityChange
        ? "Your interviews are now visible to others."
        : "Your interviews are now private.",
    })
  }

  const cancelVisibilityChange = () => {
    setPendingVisibilityChange(isPublic)
    setShowConfirmationModal(false)
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Interviews</h1>
      <div className="flex justify-between items-center mb-4">
        <DateRangeSelector value={dateRange} onChange={handleDateRangeChange} />
        <div className="flex items-center space-x-2">
          <Switch id="public-mode" checked={isPublic} onCheckedChange={handleVisibilityToggle} />
          <Label htmlFor="public-mode">{isPublic ? "Public" : "Private"}</Label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InterviewCalendar interviews={interviews} onDateSelect={handleDateSelect} selectedDate={selectedDate} />
          <div className="mt-6">
            <InterviewList
              interviews={filteredInterviews}
              jobApplications={jobApplications}
              dateRange={dateRange}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        <div>
          <InterviewForm jobApplications={jobApplications} onSubmit={handleAddInterview} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={cancelVisibilityChange}
        onConfirm={confirmVisibilityChange}
        title="Change Interview Visibility"
        description={`Are you sure you want to make your interviews ${
          pendingVisibilityChange ? "public" : "private"
        }? This will ${
          pendingVisibilityChange ? "allow others to view" : "prevent others from viewing"
        } your interview schedule.`}
      />
    </div>
  )
}

