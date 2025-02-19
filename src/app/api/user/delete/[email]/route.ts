export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("user-information");
    const users = db.collection("users");
    const sheets = db.collection("sheets");

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // delete user & sheet
    await users.deleteOne({ email });
    await sheets.deleteOne({ userId: new ObjectId(user._id) });

    // TODO: delete all applications + interviews associated to user

    return NextResponse.json({ message: "User and associated sheet deleted" }, { status: 200 });
  } catch (error) {
    console.error("Database deletion error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}