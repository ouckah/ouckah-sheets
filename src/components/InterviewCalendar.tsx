"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Interview } from "@/types";

type InterviewCalendarProps = {
  interviews: Interview[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
};

export function InterviewCalendar({
  interviews,
  onDateSelect,
  selectedDate,
}: InterviewCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate, interviews]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  const interviewDates = interviews.map(
    (interview) => new Date(interview.date)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
          modifiers={{
            interview: interviewDates,
          }}
          modifiersStyles={{
            interview: {
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              fontWeight: "bold",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
