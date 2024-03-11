// import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

type UserRole = "ADMIN" | "MODERATOR" | "USER";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
