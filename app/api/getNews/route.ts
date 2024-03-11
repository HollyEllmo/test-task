import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not Allowed action!" }, { status: 401 });
  }

  try {
    const news = await db.news.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
