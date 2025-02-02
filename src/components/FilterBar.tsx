import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const statusOptions = ["All", "Saved", "Applied", "Screen", "Interview", "Offer"]

type FilterBarProps = {
  companyFilter: string
  onCompanyFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onClearFilters: () => void
}

export default function FilterBar({
  companyFilter,
  onCompanyFilterChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const isFiltersApplied = companyFilter || dateFilter || statusFilter !== "All"

  return (
    <div className="flex gap-4 mb-4 items-end">
      <div className="space-y-2 flex-1">
        <label className="text-sm font-medium">Company Name</label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search companies..."
            value={companyFilter}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
            className="pl-8 pr-8"
          />
          {companyFilter && (
            <button
              onClick={() => onCompanyFilterChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Added</label>
        <div className="relative">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-[180px] pr-8"
          />
          {dateFilter && (
            <button
              onClick={() => onDateFilterChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFiltersApplied && (
        <Button variant="outline" onClick={onClearFilters} className="ml-auto">
          Clear Filters
        </Button>
      )}
    </div>
  )
}

