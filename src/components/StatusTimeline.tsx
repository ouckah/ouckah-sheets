import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  { name: "Applied", color: "bg-gray-200" },
  { name: "Online Assessment", color: "bg-blue-200" },
  { name: "Phone Screen", color: "bg-purple-200" },
  { name: "Interview", color: "bg-yellow-200" },
  { name: "Offer", color: "bg-green-200" },
]

type StatusTimelineProps = {
  statusHistory?: { status: string; date: string }[]
  onEditStatus?: () => void
}

export default function StatusTimeline({ statusHistory = [], onEditStatus }: StatusTimelineProps) {
  const lastStatus = statusHistory[statusHistory.length - 1]

  return (
    <div className="flex items-start justify-between">
      <div className="flex-grow relative px-4">
        <div className="absolute left-6 top-0 h-full w-px bg-gray-200" />
        <ul className="space-y-2">
          {stages.map((stage, index) => {
            const historyEntry = statusHistory.find((h) => h.status === stage.name)
            const isActive = !!historyEntry
            const isCurrent = lastStatus && lastStatus.status === stage.name

            return (
              <li key={stage.name} className="relative pl-8">
                <div
                  className={cn(
                    "absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white",
                    isActive ? stage.color : "bg-gray-100",
                  )}
                />
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isCurrent ? "font-semibold" : "text-gray-500")}>{stage.name}</span>
                  {historyEntry && (
                    <span className="text-xs text-gray-400">{new Date(historyEntry.date).toLocaleDateString()}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      {onEditStatus && (
        <div className="ml-4">
          <Button variant="outline" size="sm" onClick={onEditStatus} className="text-sm whitespace-nowrap">
            Update
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

