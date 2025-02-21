"use client"

import type React from "react"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import AddRowForm from "./AddRowForm"
import StatusTimeline from "./StatusTimeline"
import EditStatusModal from "./EditStatusModal"
import StatusBadge from "./StatusBadge"
import FilterBar from "./FilterBar"
import { ConfirmationModal } from "./ConfirmationModal"
import type { JobApplication, Sheet } from "@/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import EditJobApplicationModal from "./EditJobApplicationDetailsModal"

const initialData: JobApplication[] = []

export default function Sheet() {
  const [title, setTitle] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [applications, setApplications] = useState<JobApplication[]>(initialData)
  const [isAddingRow, setIsAddingRow] = useState(false)
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null)
  const [editingDetails, setEditingDetails] = useState<JobApplication | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | null>(null)

  const { data: session, status } = useSession()
  const router = useRouter()
  const loggedIn = status === "authenticated"

  // filter states
  const [companyFilter, setCompanyFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchSheet = useCallback(async (): Promise<Sheet | null> => {
    if (!session?.user?.email) return null
    try {
      const response = await fetch(`/api/sheet/get/${session.user.email}`)
      if (!response.ok) {
        throw new Error("Failed to fetch sheet")
      }
      const data = await response.json()
      return data.sheet
    } catch (error) {
      console.error("Error fetching sheet:", error)
      return null
    }
  }, [session])

  const fetchApplications = useCallback(async (): Promise<JobApplication[]> => {
    if (!session?.user?.email) return []
    try {
      const response = await fetch(`/api/application/get/${session.user.email}`)
      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }
      const data = await response.json()
      return data.applications
    } catch (error) {
      console.error("Error fetching applications:", error)
      return []
    }
  }, [session])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const saveTitle = async () => {
    setIsEditingTitle(false)
    
    if (!session?.user?.email) {
      setTitle("")
      toast({
        title: "Error",
        description: "You must be signed in to modify your sheet.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/sheet/update/${session.user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!response.ok) {
        throw new Error("Failed to update sheet details")
      }
      toast({
        title: "Sheet details updated",
        description: "The sheet details have been updated.",
      })
    } catch (error) {
      setTitle("")
      console.error("Error updating sheet details:", error)
      toast({
        title: "Error",
        description: "Failed to update sheet details.",
        variant: "destructive",
      })
    }
  }

  const addEntry = () => {
    if (!loggedIn) {
      router.push("/signin")
      return
    }
    setIsAddingRow(true)
  }

  const addApplication = async (newApplication: JobApplication | Partial<JobApplication>) => {
    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to add an application.",
        variant: "destructive",
      })
      return
    }

    try {
      const applicationWithUserId = {
        ...newApplication,
        userId: session.user.email,
      }

      const response = await fetch("/api/application/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationWithUserId),
      })
      if (!response.ok) {
        throw new Error("Failed to add application")
      }
      const data = await response.json()
      const addedApplication = data.application
      setApplications([...applications, addedApplication])
      setIsAddingRow(false)
      toast({
        title: "Application added",
        description: "Your new application has been added.",
      })
    } catch (error) {
      console.error("Error adding application:", error)
      toast({
        title: "Error",
        description: "Failed to add application.",
        variant: "destructive",
      })
    }
  }

  const updateApplicationStatus = async (id: string, newStatus: string, statusDate: string) => {
    try {
      const response = await fetch(`/api/application/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          date: statusDate,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to update application status")
      }
      const data = await response.json()
      const updatedApplication = data.application
      setApplications(applications.map((app) => (app._id === id ? updatedApplication : app)))
      toast({
        title: "Status updated",
        description: "The application status has been updated.",
      })
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  const updateApplicationDetails = async (
    id: string,
    updates: { companyName: string; position: string; location: string },
  ) => {
    try {
      const response = await fetch(`/api/application/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error("Failed to update application details")
      }
      const data = await response.json()
      const updatedApplication = data.application
      setApplications(applications.map((app) => (app._id === id ? updatedApplication : app)))
      toast({
        title: "Application updated",
        description: "The application details have been updated.",
      })
    } catch (error) {
      console.error("Error updating application details:", error)
      toast({
        title: "Error",
        description: "Failed to update application details.",
        variant: "destructive",
      })
    }
  }

  const deleteApplication = async (application: JobApplication) => {
    try {
      const response = await fetch(`/api/application/delete/${application._id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete application")
      }
      setApplications(applications.filter((app) => app._id !== application._id))
      toast({
        title: "Application deleted",
        description: `The application for ${application.companyName} has been deleted.`,
      })
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "Error",
        description: "Failed to delete application.",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setCompanyFilter("")
    setDateFilter("")
    setStatusFilter("All")
  }

  const handleVisibilityToggle = () => {
    if (!loggedIn) {
      router.push("signin")
      return
    }
    setPendingVisibilityChange(!isPublic)
    setShowConfirmationModal(true)
  }

  const confirmVisibilityChange = async () => {
    setShowConfirmationModal(false)

    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "You must be signed in to modify your sheet.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/sheet/update/${session.user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: pendingVisibilityChange }),
      })
      if (!response.ok) {
        throw new Error("Failed to update sheet details")
      }
      setIsPublic(pendingVisibilityChange)
      toast({
        title: "Sheet visibility updated",
        description: "The sheet visibility details have been updated.",
      })
    } catch (error) {
      console.error("Error updating sheet details:", error)
      toast({
        title: "Error",
        description: "Failed to update sheet visibility details.",
        variant: "destructive",
      })
    }
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

  useEffect(() => {
    const loadSheet = async () => {
      setIsLoading(true)
      if (status === "loading") return
      if (status === "authenticated") {
        const fetchedSheet = await fetchSheet()
        if (!fetchedSheet) {
          return
        }
        setTitle(fetchedSheet.title)
        setIsPublic(fetchedSheet.visibility)
      }
      setIsLoading(false)
    }

    loadSheet()
  }, [status, fetchSheet])

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true)
      if (status === "loading") return
      if (status === "authenticated") {
        const fetchedApplications = await fetchApplications()
        setApplications(fetchedApplications)
      }
      setIsLoading(false)
    }

    loadApplications()
  }, [status, fetchApplications])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="border px-2 py-1 rounded-md text-lg font-semibold"
              autoFocus
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {title || "Untitled Sheet"}
            </h1>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{isPublic ? "Public" : "Private"}</span>
            <Switch checked={isPublic} onCheckedChange={handleVisibilityToggle} aria-label="Toggle sheet visibility" />
          </div>
          <Button onClick={addEntry}>Add Entry</Button>
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
              <TableRow key={app._id}>
                <TableCell className="align-top">
                  <div className="space-y-1">
                    <div className="font-medium">{app.companyName}</div>
                    <div className="text-sm text-gray-500">{app.location}</div>
                    <div className="text-sm text-gray-400">{app.position}</div>
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
                <TableCell className="flex flex-col items-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingApplication(app)}
                    aria-label={`Delete application for ${app.companyName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingDetails(app)}
                    aria-label={`Edit details for ${app.companyName}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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

      {editingDetails && (
        <EditJobApplicationModal
          isOpen={!!editingDetails}
          onClose={() => setEditingDetails(null)}
          onSave={updateApplicationDetails}
          application={editingDetails}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={cancelVisibilityChange}
        onConfirm={confirmVisibilityChange}
        title="Change Sheet Visibility"
        description={`Are you sure you want to make your sheet ${
          pendingVisibilityChange ? "public" : "private"
        }? This will ${
          pendingVisibilityChange ? "allow others to view" : "prevent others from viewing"
        } your job applications.`}
      />

      <ConfirmationModal
        isOpen={!!deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onConfirm={() => {
          if (deletingApplication) {
            deleteApplication(deletingApplication)
            setDeletingApplication(null)
          }
        }}
        title="Delete Application"
        description={`Are you sure you want to delete the application for ${deletingApplication?.companyName}? This action cannot be undone.`}
      />
    </div>
  )
}

