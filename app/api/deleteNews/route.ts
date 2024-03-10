import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  // Проверяем, авторизован ли пользователь
  if (!user || user?.role === "USER") {
    return NextResponse.json({ error: "Not Allowed action!" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    // Проверяем наличие id новости
    if (!id) {
      return NextResponse.json(
        { error: "News ID is required!" },
        { status: 400 }
      );
    }

    const newsItem = await db.news.findUnique({
      where: { id: id },
    });

    if (!newsItem) {
      return NextResponse.json({ error: "News not found!" }, { status: 404 });
    }

    await db.news.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "News Deleted Successfully" },
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
