"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatusTimeline from "./StatusTimeline"
import StatusBadge from "./StatusBadge"
import FilterBar from "./FilterBar"

export type PublicJobApplication = {
  id: string
  companyName: string
  date: string
  location: string
  status: string
  statusHistory?: { status: string; date: string }[]
}

type PublicUserTrackerProps = {
  userId: string
}

// This would be replaced with an actual API call in a real application
const fetchUserData = async (userId: string): Promise<{ userName: string; applications: PublicJobApplication[] }> => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const dummyUserData: Record<string, { userName: string; applications: PublicJobApplication[] }> = {
    user1: {
      userName: "Alice",
      applications: [
        {
          id: "1",
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
      ],
    },
    user2: {
      userName: "Bob",
      applications: [
        {
          id: "3",
          companyName: "Global Solutions Ltd.",
          date: "2025-01-20",
          location: "London, UK",
          status: "Applied",
          statusHistory: [{ status: "Applied", date: "2025-01-20" }],
        },
      ],
    },
  }

  return dummyUserData[userId] || { userName: "Unknown User", applications: [] }
}

export default function PublicUserTracker({ userId }: PublicUserTrackerProps) {
  const [userName, setUserName] = useState<string>("")
  const [applications, setApplications] = useState<PublicJobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const data = await fetchUserData(userId)
      setUserName(data.userName)
      setApplications(data.applications)
      setIsLoading(false)
    }

    loadData()
  }, [userId])

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{userName}'s Sheet</h1>
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
            <TableRow>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[500px]">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id} className="py-4">
                <TableCell className="py-4 align-top">
                  <div className="space-y-1">
                    <div className="font-medium">{app.companyName}</div>
                    <div className="text-sm text-gray-500">{app.location}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {new Date(app.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </TableCell>
                <TableCell className="py-4">
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell className="py-4">
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

