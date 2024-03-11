import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const thisUser = await currentUser();

  if (!thisUser || thisUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Allowed action!" }, { status: 401 });
  }

  try {
    const users = await db.user.findMany();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
