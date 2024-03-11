import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not Allowed action!" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "News ID is required!" },
        { status: 400 }
      );
    }

    const newsItem = await db.news.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        file: true,
      },
    });

    if (!newsItem) {
      return NextResponse.json({ error: "News not found!" }, { status: 404 });
    }

    return NextResponse.json({ newsItem }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
