export const config = {
  runtime: "nodejs",
};

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params;

    const client = await clientPromise;
    const db = client.db("user-information");
    const applications = db.collection("applications");

    // find applications using the user's `email`
    const userApplications = await applications.find(
      { userId: email },
      { projection: { createdAt: 0, lastUpdated: 0 } }
    ).toArray();

    if (!applications) {
      return NextResponse.json({ message: "Applications not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Applications found", applications: userApplications }, { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
