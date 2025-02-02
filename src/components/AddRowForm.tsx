import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobApplication } from "./JobApplicationTracker"

const companyOptions = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Apple", logo: "/logos/apple.png" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Facebook", logo: "/logos/facebook.png" },
]

const statusOptions = ["Saved", "Applied", "Screen", "Interview", "Offer"]

type AddRowFormProps = {
  onSubmit: (newApplication: JobApplication) => void
  onCancel: () => void
}

export default function AddRowForm({ onSubmit, onCancel }: AddRowFormProps) {
  const [companyName, setCompanyName] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("Saved")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      companyName,
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
          <Select onValueChange={setCompanyName}>
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companyOptions.map((company) => (
                <SelectItem key={company.name} value={company.name}>
                  <div className="flex items-center">
                    <img src={company.logo || "/placeholder.svg"} alt={company.name} className="w-6 h-6 mr-2" />
                    {company.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

