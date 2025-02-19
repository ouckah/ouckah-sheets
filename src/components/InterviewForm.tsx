"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Interview, JobApplication } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type InterviewFormProps = {
  jobApplications: JobApplication[];
  onSubmit: (interview: Omit<Interview, "id">) => void;
};

export function InterviewForm({
  jobApplications,
  onSubmit,
}: InterviewFormProps) {
  const [interview, setInterview] = useState<Omit<Interview, "id">>({
    userId: "",
    jobApplicationId: "",
    date: "",
    time: "",
    interviewerName: "",
    interviewType: "Phone",
    notes: "",
  });
  const [openTime, setOpenTime] = useState(false);
  const [timeSearch, setTimeSearch] = useState("");

  const session = useSession();
  const loggedIn = session?.status === "authenticated";
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInterview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setInterview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if user is not signed in, redirect to signin
    if (!loggedIn) {
      router.push("signin");
      return;
    }
    onSubmit(interview);
    setInterview({
      userId: "",
      userEmail: "",
      jobApplicationId: "",
      date: "",
      time: "",
      interviewerName: "",
      interviewType: "Phone",
      notes: "",
    });
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        const time = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobApplicationId">Job Application</Label>
            <Select
              value={interview.jobApplicationId}
              onValueChange={handleSelectChange("jobApplicationId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job application" />
              </SelectTrigger>
              <SelectContent>
                {jobApplications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={interview.date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Popover
                open={openTime}
                onOpenChange={(open) => {
                  setOpenTime(open);
                  if (!open) setTimeSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTime}
                    className="w-full justify-between"
                  >
                    {interview.time || "Select time..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search time..."
                      value={timeSearch}
                      onValueChange={setTimeSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No time found.</CommandEmpty>
                      <CommandGroup>
                        {timeOptions
                          .filter((time) => {
                            const [hourMin] = time.split(" ");
                            const [hour] = hourMin.split(":");
                            const searchHour = timeSearch.split(":")[0];
                            return (
                              hour.startsWith(searchHour) ||
                              time
                                .toLowerCase()
                                .startsWith(timeSearch.toLowerCase())
                            );
                          })
                          .map((time) => (
                            <CommandItem
                              key={time}
                              onSelect={() => {
                                handleSelectChange("time")(time);
                                setOpenTime(false);
                                setTimeSearch("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  interview.time === time
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {time}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interviewerName">Interviewer Name</Label>
            <Input
              id="interviewerName"
              name="interviewerName"
              required
              value={interview.interviewerName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interviewType">Interview Type</Label>
            <Select
              value={interview.interviewType}
              onValueChange={handleSelectChange("interviewType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="In-person">In-person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={interview.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Schedule Interview
        </Button>
      </CardFooter>
    </Card>
  );
}
