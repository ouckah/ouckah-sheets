export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const client = await clientPromise
    const db = client.db("user-information")
    const sheets = db.collection("sheets");

    const sheet = await sheets.findOne(
      { userId: new ObjectId(id) },
      { projection: { _id: 0, createdAt: 0, lastUpdated: 0 } }
    );
    if (!sheet) {
      return NextResponse.json({ message: "Sheet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sheet found", sheet: sheet }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}