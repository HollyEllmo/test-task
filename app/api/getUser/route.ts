import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const thisUser = await currentUser();

  if (!thisUser || thisUser?.role !== "ADMIN") redirect("/");

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required!" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
