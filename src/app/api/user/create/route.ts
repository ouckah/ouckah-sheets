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
    const sheets = db.collection("sheets");

    const { email, name, image: pfp } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ message: "Email and username are required" }, { status: 400 });
    }

    // check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists", user: existingUser }, { status: 200 });
    }

    // create new user
    const newUser = await users.insertOne({ 
      email,
      name, 
      pfp,
      firstName: "",
      lastName: "",
      location: "",
      bio: "",
      linkedin: "",
      github: "",
      experiences: [],
      education: [],
      sheetVisibility: false,
      createdAt: new Date(),
    });

    // create associated sheet
    const newSheet = await sheets.insertOne({
      userId: newUser.insertedId, // reference to user
      title: `${name}'s Sheet`,
      applications: [],
      visibility: false,
      createdAt: new Date(),
      lastUpdated: new Date(),
    });

    return NextResponse.json({ message: "User created", user: newUser, sheet: newSheet }, { status: 201 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}