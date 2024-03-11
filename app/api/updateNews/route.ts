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

    const { id, title, description, fullText, status, authorId, fileKey } =
      await req.json();

   

    const updatedNews = await db.news.update({
      where: { id },
      data: {
        title,
        description,
        fullText,
        status,
        fileKey,
      },
    });

    return NextResponse.json({ updatedNews }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
