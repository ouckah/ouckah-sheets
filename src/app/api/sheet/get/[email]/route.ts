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
    const users = db.collection("users");
    const sheets = db.collection("sheets");

    // find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // find sheet using the user's `_id`
    const sheet = await sheets.findOne(
      { userId: user._id },
      { projection: { _id: 0, createdAt: 0, lastUpdated: 0 } }
    );

    if (!sheet) {
      return NextResponse.json({ message: "Sheet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sheet found", sheet }, { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
