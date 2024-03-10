import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const thisUser = await currentUser();

  try {
    if (!thisUser || thisUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not Allowed action!" },
        { status: 401 }
      );
    }

    const values = await req.json();

    const id = values.id;

    console.log(id);

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...values,
      },
    });

    return NextResponse.json({ message: "User Updated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
