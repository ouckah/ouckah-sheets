import PublicUserTracker from "@/components/PublicSheet"

export default async function UserTrackerPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return (
    <div>
      <PublicUserTracker userId={userId} />
    </div>
  )
}

