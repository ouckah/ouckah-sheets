import PublicProfile from "@/components/PublicProfile";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <PublicProfile userId={userId} />
}

