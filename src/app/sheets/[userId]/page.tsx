import PublicUserTracker from "@/components/PublicUserTracker"

export default function UserTrackerPage({ params }: { params: { userId: string } }) {
  return <PublicUserTracker userId={params.userId} />
}

