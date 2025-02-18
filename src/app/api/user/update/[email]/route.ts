export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

export async function PUT(req: Request, context: { params: { email: string } }) {
  try {
    const { email } = await context.params;
    const newProfile = await req.json();

    const client = await clientPromise
    const db = client.db("user-information")
    const users = db.collection("users");

    console.log(newProfile);
    const user = await users.findOneAndUpdate({ email }, { $set: newProfile });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", user: user }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}