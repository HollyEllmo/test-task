import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const thisUser = await currentUser();

  if (!thisUser || thisUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not Allowed action!" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    // Проверяем наличие id новости
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required!" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
