export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid job application Id" }, { status: 400 });
    }
    
    const newApplication = await req.json();

    const client = await clientPromise
    const db = client.db("user-information")
    const applications = db.collection("applications")

    const updatedApplication = await applications.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: newApplication },
      { returnDocument: "after" },
    )

    return NextResponse.json({ message: "Application updated", application: updatedApplication }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}