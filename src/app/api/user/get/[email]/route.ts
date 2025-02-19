export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { email: string } }) {
  try {
    const { email } = await params;

    const client = await clientPromise
    const db = client.db("user-information")
    const users = db.collection("users");

    const user = await users.findOne(
      { email },
      { projection: { _id: 0, createdAt: 0 } }
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", user: user }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}