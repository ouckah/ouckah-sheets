import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DateRangeOption = "all" | "today" | "thisWeek" | "thisMonth" | "custom"

type DateRangeSelectorProps = {
  value: DateRangeOption
  onChange: (value: DateRangeOption) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select date range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Interviews</SelectItem>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="thisWeek">This Week</SelectItem>
        <SelectItem value="thisMonth">This Month</SelectItem>
        <SelectItem value="custom">Custom Range</SelectItem>
      </SelectContent>
    </Select>
  )
}

