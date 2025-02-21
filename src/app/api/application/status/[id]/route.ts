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

    const { status, date } = await req.json();
    if (!status) {
      return NextResponse.json({ message: "Invalid status given" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ message: "Invalid date given" }, { status: 400 });
    }
    
    const client = await clientPromise
    const db = client.db("user-information")
    const applications = db.collection("applications")

    const updatedApplication = await applications.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { status, date },
        // @ts-expect-error - Ignore TypeScript error for $push operation
        $push: { statusHistory: { status, date } }
      },
      { returnDocument: "after" }
    )

    if (!updatedApplication) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Application updated", application: updatedApplication }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}