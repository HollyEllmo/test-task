import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const user = await currentUser();

  try {
    if (!user || user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not Allowed action!" },
        { status: 401 }
      );
    }

    const {
      password,
      name,
      email,
      phoneNumber,
      role,
      status,
      isTwoFactorEnabled,
    } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(
      hashedPassword,
      name,
      email,
      phoneNumber,
      role,
      status,
      isTwoFactorEnabled
    );

    const newUser = await db.user.create({
      data: {
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        role,
        status,
        isTwoFactorEnabled,
        emailVerified: new Date(),
      },
    });

    console.log(newUser);

    return NextResponse.json({ message: "User Created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
