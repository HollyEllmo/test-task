import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  try {
    if (!user || user?.role === "USER" || !user.id) {
      return NextResponse.json(
        { error: "Not Allowed action!" },
        { status: 401 }
      );
    }

    const { title, description, fullText, status, fileKey } = await req.json();

    const newNews = await db.news.create({
      data: {
        title,
        description,
        fullText,
        status,
        authorId: user.id,
        fileKey,
      },
    });

    return NextResponse.json({ newNews }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
