"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatusTimeline from "./StatusTimeline"
import StatusBadge from "./StatusBadge"
import FilterBar from "./FilterBar"

export type PublicJobApplication = {
  id: string
  userId: string
  userName: string
  companyName: string
  date: string
  location: string
  status: string
  statusHistory?: { status: string; date: string }[]
}

// Dummy data for public job applications
const dummyPublicData: PublicJobApplication[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alice Johnson",
    companyName: "Tech Giants Inc.",
    date: "2025-01-15",
    location: "San Francisco, CA",
    status: "Interview",
    statusHistory: [
      { status: "Applied", date: "2025-01-15" },
      { status: "Screen", date: "2025-01-20" },
      { status: "Interview", date: "2025-01-25" },
    ],
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bob Smith",
    companyName: "Startup Innovators",
    date: "2025-01-10",
    location: "New York, NY",
    status: "Offer",
    statusHistory: [
      { status: "Applied", date: "2025-01-10" },
      { status: "Screen", date: "2025-01-18" },
      { status: "Interview", date: "2025-01-22" },
      { status: "Offer", date: "2025-01-30" },
    ],
  },
  {
    id: "3",
    userId: "user3",
    userName: "Charlie Brown",
    companyName: "Global Solutions Ltd.",
    date: "2025-01-20",
    location: "London, UK",
    status: "Applied",
    statusHistory: [{ status: "Applied", date: "2025-01-20" }],
  },
]

export default function ExploreTracker() {
  const [applications, setApplications] = useState<PublicJobApplication[]>(dummyPublicData)

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const clearFilters = () => {
    setCompanyFilter("")
    setDateFilter("")
    setStatusFilter("All")
  }

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesCompany = app.companyName.toLowerCase().includes(companyFilter.toLowerCase())
      const matchesDate = !dateFilter || app.date === dateFilter
      const matchesStatus = statusFilter === "All" || app.status === statusFilter
      return matchesCompany && matchesDate && matchesStatus
    })
  }, [applications, companyFilter, dateFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Explore Public Sheets</h1>
      </div>

      <FilterBar
        companyFilter={companyFilter}
        onCompanyFilterChange={setCompanyFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[500px]">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.userName}</TableCell>
                <TableCell className="align-top">
                  <div className="space-y-1">
                    <div className="font-medium">{app.companyName}</div>
                    <div className="text-sm text-gray-500">{app.location}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(app.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  <StatusTimeline statusHistory={app.statusHistory} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

