import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { JobApplication } from "@/types"

const statusOptions = ["Saved", "Applied", "Screen", "Interview", "Offer"]

type EditStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, newStatus: string, statusDate: string) => void
  application: JobApplication
}

export default function EditStatusModal({ isOpen, onClose, onSave, application }: EditStatusModalProps) {
  const [status, setStatus] = useState(application.status)
  const [statusDate, setStatusDate] = useState("")

  const handleSave = () => {
    onSave(application.id, status, statusDate)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
          <Input
            type="date"
            value={statusDate}
            onChange={(e) => setStatusDate(e.target.value)}
            placeholder="Status change date"
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

