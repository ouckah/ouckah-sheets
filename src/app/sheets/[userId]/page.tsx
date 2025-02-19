import PublicSheet from "@/components/PublicSheet"

export default async function SheetPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <PublicSheet userId={userId} />
}

