export const config = {
  runtime: "nodejs",
};

import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server';

type JobApplication = {
  _id: string;
  companyName: string;
  date: string;
  status: string;
  statusHistory: { status: string; date: string }[];
}

export async function POST(req: Request) {
  try { 
    const client = await clientPromise;
    const db = client.db("user-information");
    const users = db.collection("users");
    const sheets = db.collection("sheets");
    const interviews = db.collection("interviews");

    const newInterview = await req.json();

    // validate user
    const user = await users.findOne({ 
      $or: [{ _id: newInterview.id }, { email: newInterview.userEmail }] 
    });
    if (!user) {
      throw new Error("User not found")
    }

    // if email was used, replace it with userId
    if (newInterview.userEmail) {
      newInterview.userId = user._id;
      delete newInterview.email;
    }

    // validate job application
    const sheet = await sheets.findOne({ userId: user._id })
    if (!sheet) {
      throw new Error("Sheet not found")
    }
    const jobApplication = sheet.applications.filter((application: JobApplication) => application._id === newInterview.applicationId)
    if (jobApplication.length === 0) {
      throw new Error("Job application not found")
    }

    // insert new interview
    newInterview.createdAt = new Date();
    newInterview.lastUpdated = new Date();
    
    await interviews.insertOne(newInterview)

    return NextResponse.json({ message: "Interview created", interview: newInterview }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}