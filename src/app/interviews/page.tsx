"use client";

import { useState, useMemo } from "react";
import { InterviewCalendar } from "@/components/InterviewCalendar";
import { InterviewForm } from "@/components/InterviewForm";
import { InterviewList } from "@/components/InterviewList";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import type { Interview, JobApplication } from "@/types";
import { toast } from "@/hooks/use-toast";

// Mock data for job applications
const mockJobApplications: JobApplication[] = [
  {
    id: "1",
    companyName: "Tech Corp",
    date: "2025-02-01",
    location: "New York, NY",
    status: "Applied",
  },
  {
    id: "2",
    companyName: "Innovate Inc",
    date: "2025-02-05",
    location: "San Francisco, CA",
    status: "Interview",
  },
];

// Mock data for interviews
const mockInterviews: Interview[] = [
  {
    id: "1",
    jobApplicationId: "1",
    date: "2025-02-15",
    time: "10:00 AM",
    interviewerName: "John Doe",
    interviewType: "Video",
    notes: "Prepare for technical questions",
  },
  {
    id: "2",
    jobApplicationId: "2",
    date: "2025-02-20",
    time: "2:00 PM",
    interviewerName: "Jane Smith",
    interviewType: "In-person",
    notes: "Bring portfolio",
  },
  {
    id: "3",
    jobApplicationId: "1",
    date: "2025-02-18",
    time: "11:00 AM",
    interviewerName: "Alice Johnson",
    interviewType: "Phone",
    notes: "Discuss salary expectations",
  },
  {
    id: "4",
    jobApplicationId: "2",
    date: "2025-03-05",
    time: "3:30 PM",
    interviewerName: "Bob Williams",
    interviewType: "Video",
    notes: "Second round interview",
  },
];

type DateRangeOption = "all" | "today" | "thisWeek" | "thisMonth" | "custom";

// Mock API call
const mockAddInterview = async (
  interview: Omit<Interview, "id">
): Promise<Interview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInterview: Interview = {
        ...interview,
        id: Date.now().toString(),
      };
      resolve(newInterview);
    }, 500); // Simulate a 500ms delay
  });
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRangeOption>("all");

  const handleAddInterview = async (newInterview: Omit<Interview, "id">) => {
    try {
      // Mock API call
      const addedInterview = await mockAddInterview(newInterview);

      // Update state with the new interview and sort
      setInterviews((prevInterviews) => {
        const updatedInterviews = [...prevInterviews, addedInterview];
        return updatedInterviews.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
      });

      // Show success toast
      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled for ${new Date(
          addedInterview.date
        ).toLocaleDateString()} at ${addedInterview.time}`,
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDateRange("custom");
    }
  };

  const handleDateRangeChange = (newRange: DateRangeOption) => {
    setDateRange(newRange);
    if (newRange !== "custom") {
      setSelectedDate(undefined);
    }
  };

  const filteredInterviews = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.date);

      switch (dateRange) {
        case "today":
          return interviewDate.toDateString() === now.toDateString();
        case "thisWeek":
          return (
            interviewDate >= startOfWeek &&
            interviewDate <
              new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
          );
        case "thisMonth":
          return (
            interviewDate.getMonth() === now.getMonth() &&
            interviewDate.getFullYear() === now.getFullYear()
          );
        case "custom":
          return selectedDate
            ? interviewDate.toDateString() === selectedDate.toDateString()
            : true;
        case "all":
        default:
          return true;
      }
    });
  }, [interviews, dateRange, selectedDate]);

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Interviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <DateRangeSelector
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>
          <InterviewCalendar
            interviews={interviews}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          <div className="mt-6">
            <InterviewList
              interviews={filteredInterviews}
              jobApplications={mockJobApplications}
              dateRange={dateRange}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        <div>
          <InterviewForm
            jobApplications={mockJobApplications}
            onSubmit={handleAddInterview}
          />
        </div>
      </div>
    </div>
  );
}
