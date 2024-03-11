// import { UserRole } from "@prisma/client";
import { UserStatus } from "@prisma/client";
import { NewsStatus } from "@prisma/client";

import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["ADMIN", "USER", "MODERATOR"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    phoneNumber: z.optional(z.string().min(7)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const CreateUserSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum(["ADMIN", "USER", "MODERATOR"]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  phoneNumber: z.optional(z.string().min(7)),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum(["ADMIN", "USER", "MODERATOR"]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  phoneNumber: z.optional(z.string().min(7)),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  phone: z.string().min(7, {
    message: "Phone is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const NewsSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  fullText: z.string({
    required_error: "Full text is required",
  }),
  status: z.enum(
    [NewsStatus.ARCHIVED, NewsStatus.PUBLISHED, NewsStatus.DRAFT],
    {
      required_error: "Status is required",
    }
  ),
  authorId: z.string({
    required_error: "Author ID is required",
  }),
  fileKey: z.string().optional(),
});

export const EditNewsSchema = z.object({
  id: z.string({
    required_error: "ID is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  fullText: z.string({
    required_error: "Full text is required",
  }),
  status: z.enum(
    [NewsStatus.ARCHIVED, NewsStatus.PUBLISHED, NewsStatus.DRAFT],
    {
      required_error: "Status is required",
    }
  ),
  authorId: z.string({
    required_error: "Author ID is required",
  }),
  fileKey: z.string().optional(),
});
