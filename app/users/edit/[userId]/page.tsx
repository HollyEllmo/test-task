"use client";

import { UserStatus } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import axios from "axios";

const SettingsPage = () => {
  const currentUser = useCurrentUser();

  if (!currentUser || currentUser?.role !== "ADMIN") redirect("/");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState({
    id: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    role: undefined,
    status: undefined,
    isTwoFactorEnabled: undefined,
  });

  function removePrefix(path: string) {
    const prefix = "/users/edit/";
    return path.replace(prefix, "");
  }

  const {
    id,
    password,
    name,
    email,
    phoneNumber,
    role,
    status,
    isTwoFactorEnabled,
  } = user;

  console.log(
    id,
    password,
    name,
    email,
    phoneNumber,
    role,
    status,
    isTwoFactorEnabled
  );

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      password: "",
      name: "",
      email: "",
      phoneNumber: "",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isTwoFactorEnabled: false,
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (name && email && phoneNumber && role && status) {
      setValue("id", id);
      setValue("name", name);
      setValue("email", email);
      setValue("phoneNumber", phoneNumber);
      setValue("role", role);
      setValue("status", status);
    }
  }, [
    id,
    password,
    name,
    email,
    phoneNumber,
    role,
    status,
    isTwoFactorEnabled,
    setValue,
  ]);

  const pathname = usePathname();

  const UserId = removePrefix(pathname);

  console.log(UserId);

  useEffect(() => {
    const fetchUser = async () => {
      if (UserId) {
        try {
          const response = await axios.post("/api/getUser", {
            id: UserId,
          });
          setUser(response.data.user);
        } catch (error) {
          console.error("Error while searching for news:", error);
        }
      }
    };

    fetchUser();
  }, [UserId]);

  console.log(UserId);

  const { mutate: updateUser } = useMutation({
    mutationFn: async ({
      values,
    }: {
      values: z.infer<typeof CreateUserSchema>;
    }) => {
      try {
        const response = await fetch("/api/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
          if (response.status === 200) {
            form.reset();
            update();
            setSuccess("User Updated!");
          }

          if (data?.error) {
            form.reset();
            setError(data.error);
          }
        } else {
          form.reset();
          setError(data.error || "Something went wrong");
        }
      } catch (error) {
        form.reset();
        setError("Server Error");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    startTransition(() => {
      setError(undefined);
      setSuccess(undefined);
      updateUser({ values });
    });
  };

  return (
    <Card className="w-[375px] sm:w-[600px] h-screen sm:h-auto">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">👷‍♂️ Update User</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Vasya"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="hidden" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="vasya.ivanov@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+(998) 71 000-00-00"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                        <SelectItem value={UserRole.MODERATOR}>
                          Moderator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Status</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.BANNED}>
                          BANNED
                        </SelectItem>
                        <SelectItem value={UserStatus.ACTIVE}>
                          ACTIVE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              Update User
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
