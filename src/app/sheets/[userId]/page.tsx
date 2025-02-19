import PublicSheet from "@/components/PublicSheet"

export default async function SheetPage({ params }: { params: { userId: string } }) {
  const { userId } = await params;
  return <PublicSheet userId={userId} />
}

