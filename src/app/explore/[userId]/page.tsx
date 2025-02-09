import PublicUserTracker from "@/components/PublicUserTracker"

export default async function UserTrackerPage({ params }: { params: { userId: string } }) {
  const { userId } = await params;
  return (
    <div>
      <PublicUserTracker userId={userId} />
    </div>
  )
}

