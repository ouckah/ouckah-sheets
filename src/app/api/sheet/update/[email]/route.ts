export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;
    const newSheet = await req.json();
    console.log(newSheet)

    const client = await clientPromise
    const db = client.db("user-information")
    const users = db.collection("users");
    const sheets = db.collection("sheets");

    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedSheet = await sheets.findOneAndUpdate(
      { userId: user.email },
      { $set: newSheet },
      { returnDocument: "after" },
    )

    return NextResponse.json({ message: "Sheet updated", sheet: updatedSheet }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}