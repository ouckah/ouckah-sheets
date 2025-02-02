import PublicUserTracker from "@/components/PublicUserTracker"

export default function UserTrackerPage({ params }: { params: { userId: string } }) {
  return (
    <div>
      <PublicUserTracker userId={params.userId} />
    </div>
  )
}

