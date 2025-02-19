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

export type PublicSheet = { 
  title: string
  applications: PublicJobApplication[]
  visibility: boolean
}

type PublicSheetProps = {
  userId: string
}

const fetchSheetData = async (userId: string): Promise<PublicSheet> => {
  const request = await fetch(`/api/sheet/getById/${userId}`);
  const data = await request.json();
  console.log(data)
  const sheet = data.sheet;

  return sheet;
}

export default function PublicSheet({ userId }: PublicSheetProps) {
  const [title, setTitle] = useState<string>("")
  const [applications, setApplications] = useState<PublicJobApplication[]>([])
  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const data = await fetchSheetData(userId)
      console.log(data);
      setTitle(data.title)
      setApplications(data.applications)
      setIsPublic(data.visibility)
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

  if (!isPublic) {
    return <div>Private Sheet.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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

