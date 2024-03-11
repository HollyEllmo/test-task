"use client";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { PenLine, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [revalidate, setRevalidate] = useState(false);
  const currentUser = useCurrentUser();
  if (!currentUser || currentUser?.role !== "ADMIN") redirect("/");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("/api/getUsers");

        setUsers(response.data.users);
      } catch (error) {
        console.error("Error receiving users:", error);
      }
    };

    fetchNews();
  }, [revalidate]);

  const { mutate: deleteUser } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const response = await fetch("/api/deleteUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (response.ok) {
          if (response.status === 200) {
            console.log("User Deleted!");
          }

          setRevalidate((prevRevalidate) => !prevRevalidate);

          if (data?.error) {
            console.log(data.error);
          }
        } else {
          console.log("Something went wrong!");
        }
      } catch (error) {
        console.log("Network error or something went wrong");
      }
    },
  });

  if (users.length === 0) {
    return (
      <div className="mx-auto sm:mx-20 py-8">
        <h1 className="text-5xl font-bold mb-4 text-center sm:mt-4">
          Our Users!
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[350px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[350px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[350px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[350px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
        </div>
        <div className="text-3xl font-bold mt-10 text-center sm:mt-4 text-zinc-600">
          There is no users here yet 😥
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto sm:mx-20 py-8">
      <h1 className="text-5xl font-bold mb-4 text-center sm:mt-4">
        Our Users!
      </h1>

      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-lime-500 to-green-500" />
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-lg font-medium text-zinc-900">
                      {user.name}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="px-6 mt-4 
            flex flex-col items-center pt-3 gap-6 text-xs text-zinc-500"
            >
              <p className="truncate">{user.email}</p>
            </div>
            {currentUser?.role === "ADMIN" && (
              <div
                className="px-6 mt-4 
            flex justify-between py-2 gap-6 text-xs text-zinc-500"
              >
                <Button
                  asChild
                  size="sm"
                  className="w-[250px]"
                  variant="special"
                >
                  <Link href={`/users/edit/${user.id}`}>
                    <PenLine className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="w-[250px]"
                  variant="destructive"
                  onClick={() => deleteUser({ id: user.id })}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
