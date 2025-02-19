export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;
    const newProfile = await req.json();

    const client = await clientPromise
    const db = client.db("user-information")
    const users = db.collection("users");
    const sheets = db.collection("sheets");

    const updatedUser = await users.findOneAndUpdate(
      { email }, 
      { $set: newProfile },
      { returnDocument: "after" },
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // sheet-based changes
    if (newProfile.sheetVisibility !== undefined) {
      await sheets.updateMany(
        { userId: updatedUser._id }, // match all sheets associated with this user
        { $set: { visibility: newProfile.sheetVisibility } }
      );
    }

    return NextResponse.json({ message: "User updated", user: updatedUser }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}