import { applicationStages } from "@/lib/jobApplication"

type StatusBadgeProps = {
  status: string
}

const statusColors: Record<string, { bg: string; text: string }> = applicationStages.reduce(
  (acc, stage) => {
    const baseColor = stage.color.split("-")[1];

    acc[stage.name] = { bg: `bg-${baseColor}-100`, text: `text-${baseColor}-700` };
    return acc;
  },
  {} as Record<string, { bg: string; text: string }>
);

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

