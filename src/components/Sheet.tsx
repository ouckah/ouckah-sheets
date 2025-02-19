"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import AddRowForm from "./AddRowForm";
import StatusTimeline from "./StatusTimeline";
import EditStatusModal from "./EditStatusModal";
import StatusBadge from "./StatusBadge";
import FilterBar from "./FilterBar";
import { ConfirmationModal } from "./ConfirmationModal";
import type { JobApplication } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SheetData = {
  title: string
  applications: JobApplication[],
  visibility: boolean,
};

const initialData: JobApplication[] = [];

export default function Sheet() {
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [applications, setApplications] =
    useState<JobApplication[]>(initialData);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const user = session?.data?.user
  const router = useRouter();
  const loggedIn = session?.status === "authenticated";

  // filter states
  const [companyFilter, setCompanyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUserSheet = async (userEmail: string): Promise<SheetData | null> => {
    try {
      const request = await fetch(`/api/sheet/get/${userEmail}`);
      const data = await request.json();
      const sheet = data.sheet;

      return sheet;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  const updateSheet = async (updates: Partial<SheetData>) => {
    if (!user?.email) return;
  
    try {
      const request = await fetch(`/api/sheet/update/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates), // Only send updated fields
      });
  
      if (!request.ok) {
        throw new Error("Failed to update sheet");
      }
  
      toast({
        title: "Sheet updated",
        description: "Your changes have been saved.",
      });
  
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update sheet.",
        variant: "destructive",
      });
    }
  }; 
  
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const saveTitle = async () => {
    setIsEditingTitle(false);
    await updateSheet({ title });
  };

  const addEntry = () => {
    // if user is not logged in, redirect to sign in
    if (!loggedIn) {
      router.push("/signin");
      return;
    }
    setIsAddingRow(true);
  };

  const addApplication = async (newApplication: JobApplication) => {
    const newApplications = [
      ...applications,
      {
        ...newApplication,
        statusHistory: [{ status: "Saved", date: newApplication.date }],
      },
    ]
    setApplications(newApplications);
    setIsAddingRow(false);
    await updateSheet({ applications: newApplications });
  };

  const updateApplicationStatus = async (id: string, newStatus: string, statusDate: string) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          status: newStatus,
          statusHistory: [...(app.statusHistory || []), { status: newStatus, date: statusDate }],
        };
      }
      return app;
    });
  
    setApplications(updatedApplications);
    await updateSheet({ applications: updatedApplications });
  };

  const clearFilters = () => {
    setCompanyFilter("");
    setDateFilter("");
    setStatusFilter("All");
  };

  const handleVisibilityToggle = () => {
    // if user is not signed in, redirect to signin
    if (!loggedIn) {
      router.push("signin");
      return;
    }
    setPendingVisibilityChange(!isPublic);
    setShowConfirmationModal(true);
  };

  const confirmVisibilityChange = async () => {
    setIsPublic(pendingVisibilityChange);
    setShowConfirmationModal(false);
    await updateSheet({ visibility: pendingVisibilityChange });
  };

  const cancelVisibilityChange = () => {
    setPendingVisibilityChange(isPublic);
    setShowConfirmationModal(false);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesCompany = app.companyName
        .toLowerCase()
        .includes(companyFilter.toLowerCase());
      const matchesDate = !dateFilter || app.date === dateFilter;
      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;
      return matchesCompany && matchesDate && matchesStatus;
    });
  }, [applications, companyFilter, dateFilter, statusFilter]);

  // useEffect to fetch the user's profile information
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      if (session.status === "loading") return; // wait for session to load
      if (session.status === "authenticated" && user?.email) {
        const data = await fetchUserSheet(user?.email);
        if (data) {
          setTitle(data.title)
          setApplications(data.applications)
          setIsPublic(data.visibility)
        } else {
          console.error("Failed to load profile");
        }
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [session.status, user?.email]);

  if (isLoading) 
    return <div>Loading...</div>

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
            <h1
              className="text-2xl font-semibold text-gray-900 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {title || "Untitled Sheet"}
            </h1>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {isPublic ? "Public" : "Private"}
            </span>
            <Switch
              checked={isPublic}
              onCheckedChange={handleVisibilityToggle}
              aria-label="Toggle sheet visibility"
            />
          </div>
          <Button onClick={addEntry}>Add Entry</Button>
        </div>
      </div>

      {isAddingRow && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <AddRowForm
            onSubmit={addApplication}
            onCancel={() => setIsAddingRow(false)}
          />
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
                  <StatusTimeline
                    statusHistory={app.statusHistory}
                    onEditStatus={() => setEditingApplication(app)}
                  />
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
        description={`Are you sure you want to make your sheet ${
          pendingVisibilityChange ? "public" : "private"
        }? This will ${
          pendingVisibilityChange
            ? "allow others to view"
            : "prevent others from viewing"
        } your job applications.`}
      />
    </div>
  );
}
