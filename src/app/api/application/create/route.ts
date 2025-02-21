export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try { 
    const client = await clientPromise;
    const db = client.db("user-information");
    const users = db.collection("users");
    const applications = db.collection("applications");

    const newApplication = await req.json();

    // validate user
    const user = await users.findOne({ email: newApplication.userId });
    if (!user) {
      throw new Error("User not found")
    }

    // if email was used, replace it with userId
    if (newApplication.userEmail) {
      newApplication.userId = user._id;
      delete newApplication.email;
    }

    // insert new interview
    newApplication.createdAt = new Date();
    newApplication.lastUpdated = new Date();
    
    await applications.insertOne(newApplication)

    return NextResponse.json({ message: "Application created", application: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}