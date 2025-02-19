"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { applicationStages } from "@/lib/jobApplication"
import type { JobApplication } from "@/types"

const statusOptions = applicationStages.map((stage) => stage.name)

type AddRowFormProps = {
  onSubmit: (newApplication: JobApplication) => void
  onCancel: () => void
}

export default function AddRowForm({ onSubmit, onCancel }: AddRowFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const [companyName, setCompanyName] = useState("")
  const [position, setPosition] = useState("")
  const [date, setDate] = useState(today)
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("Saved")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      companyName,
      position,
      date,
      location,
      status,
      statusHistory: [{ status, date }],
    }
    onSubmit(newApplication)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <Input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Position</label>
          <Input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter position title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            type="text"
            placeholder="e.g., San Francisco, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Initial Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Application</Button>
      </div>
    </form>
  )
}

