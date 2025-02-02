"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import AddRowForm from "./AddRowForm"
import StatusTimeline from "./StatusTimeline"
import EditStatusModal from "./EditStatusModal"
import StatusBadge from "./StatusBadge"
import FilterBar from "./FilterBar"
import { ConfirmationModal } from "./ConfirmationModal"
import type { JobApplication, Interview } from "@/types"

const initialData: JobApplication[] = []

export default function JobApplicationTracker() {
  const [applications, setApplications] = useState<JobApplication[]>(initialData)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isAddingRow, setIsAddingRow] = useState(false)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(false)

  // Filter states
  const [companyFilter, setCompanyFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const addApplication = (newApplication: JobApplication) => {
    setApplications([
      ...applications,
      {
        ...newApplication,
        statusHistory: [{ status: "Saved", date: newApplication.date }],
      },
    ])
    setIsAddingRow(false)
  }

  const updateApplicationStatus = (id: string, newStatus: string, statusDate: string) => {
    setApplications(
      applications.map((app) => {
        if (app.id === id) {
          const updatedHistory = [...(app.statusHistory || []), { status: newStatus, date: statusDate }]
          return { ...app, status: newStatus, statusHistory: updatedHistory }
        }
        return app
      }),
    )
  }

  const addInterview = (newInterview: Omit<Interview, "id">) => {
    const interview: Interview = { ...newInterview, id: Date.now().toString() }
    setInterviews([...interviews, interview])
    setApplications(
      applications.map((app) =>
        app.id === newInterview.jobApplicationId ? { ...app, interviews: [...(app.interviews || []), interview] } : app,
      ),
    )
  }

  const clearFilters = () => {
    setCompanyFilter("")
    setDateFilter("")
    setStatusFilter("All")
  }

  const handleVisibilityToggle = () => {
    setPendingVisibilityChange(!isPublic)
    setShowConfirmationModal(true)
  }

  const confirmVisibilityChange = () => {
    setIsPublic(pendingVisibilityChange)
    setShowConfirmationModal(false)
  }

  const cancelVisibilityChange = () => {
    setPendingVisibilityChange(isPublic)
    setShowConfirmationModal(false)
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
        <h1 className="text-2xl font-semibold text-gray-900">My Sheet</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{isPublic ? "Public" : "Private"}</span>
            <Switch checked={isPublic} onCheckedChange={handleVisibilityToggle} aria-label="Toggle sheet visibility" />
          </div>
          <Button onClick={() => setIsAddingRow(true)}>Add Entry</Button>
        </div>
      </div>

      {isAddingRow && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <AddRowForm onSubmit={addApplication} onCancel={() => setIsAddingRow(false)} />
        </div>
      )}

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
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[500px]">Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
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
                  <StatusTimeline statusHistory={app.statusHistory} onEditStatus={() => setEditingApplication(app)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingApplication && (
        <EditStatusModal
          isOpen={!!editingApplication}
          onClose={() => setEditingApplication(null)}
          onSave={updateApplicationStatus}
          application={editingApplication}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={cancelVisibilityChange}
        onConfirm={confirmVisibilityChange}
        title="Change Sheet Visibility"
        description={`Are you sure you want to make your sheet ${pendingVisibilityChange ? "public" : "private"}? This will ${pendingVisibilityChange ? "allow others to view" : "prevent others from viewing"} your job applications.`}
      />
    </div>
  )
}

