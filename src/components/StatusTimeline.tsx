import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const stages = [
  { name: "Saved", color: "bg-blue-100" },
  { name: "Applied", color: "bg-blue-100" },
  { name: "Screen", color: "bg-blue-100" },
  { name: "Interview", color: "bg-blue-100" },
  { name: "Offer", color: "bg-blue-100" },
]

type StatusTimelineProps = {
  statusHistory?: { status: string; date: string }[]
  onEditStatus?: () => void
}

export default function StatusTimeline({ statusHistory = [], onEditStatus }: StatusTimelineProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Timeline */}
      <div className="flex-1 relative">
        {/* Horizontal line connecting all points */}
        <div className="absolute h-[2px] bg-gray-200 left-0 right-0 top-1/2 -translate-y-1/2" />

        {/* Stage points */}
        <div className="relative flex justify-between items-center h-10">
          {stages.map((stage, index) => {
            const historyEntry = statusHistory.find((h) => h.status === stage.name)
            const isActive = !!historyEntry

            return (
              <div key={stage.name} className="flex flex-col">
                {/* Stage name */}
                <span className="text-xs text-gray-600 mb-2">{stage.name}</span>

                {/* Circle */}
                <div
                  className={`w-4 h-4 rounded-full border-2 relative z-10 ${
                    isActive ? "bg-blue-400 border-blue-400" : "bg-white border-gray-300"
                  }`}
                />

                {/* Date */}
                {historyEntry && (
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(historyEntry.date).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "2-digit",
                    })}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status button - only show if onEditStatus is provided */}
      {onEditStatus && (
        <Button variant="outline" size="sm" onClick={onEditStatus} className="text-sm shrink-0">
          Status
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

