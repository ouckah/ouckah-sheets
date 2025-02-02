type StatusBadgeProps = {
  status: string
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Saved: { bg: "bg-gray-100", text: "text-gray-700" },
  Applied: { bg: "bg-blue-100", text: "text-blue-700" },
  Screen: { bg: "bg-purple-100", text: "text-purple-700" },
  Interview: { bg: "bg-amber-100", text: "text-amber-700" },
  Offer: { bg: "bg-green-100", text: "text-green-700" },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status] || { bg: "bg-gray-100", text: "text-gray-700" }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {status}
    </span>
  )
}

