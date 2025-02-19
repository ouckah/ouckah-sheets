export const config = {
  runtime: "nodejs",
};

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { email: string } }) {
  try {
    const { email } = await params;

    const client = await clientPromise;
    const db = client.db("user-information");
    const users = db.collection("users");
    const interviews = db.collection("interviews")

    // find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // find interviews with userId matching user
    const interviewsByUser = await interviews.find({ userId: user._id }).toArray()

    return NextResponse.json({ message: "Interviews found", interviews: interviewsByUser }, { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
