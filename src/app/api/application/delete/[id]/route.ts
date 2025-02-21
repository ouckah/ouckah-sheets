export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid job application Id" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("user-information");
    const applications = db.collection("applications")

    // find application by id
    const application = await applications.findOneAndDelete({ _id: new ObjectId(id) });
    if (!application) {
      return NextResponse.json({ message: "Job application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job application deleted" }, { status: 200 });
  } catch (error) {
    console.error("Database deletion error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}