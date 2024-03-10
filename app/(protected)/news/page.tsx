"use client";
import Link from "next/link";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { PenLine, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  fullText: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  const [revalidate, setRevalidate] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("/api/getNews");
        console.log(response.data);
        setNews(response.data.news);
      } catch (error) {
        console.error("Error receiving news:", error);
      }
    };

    fetchNews();
  }, [revalidate]);

  console.log(news);

  const { mutate: deleteNews } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        console.log(id);
        const response = await fetch("/api/deleteNews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (response.ok) {
          if (response.status === 200) {
            console.log("News Deleted!");
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

  if (news.length === 0) {
    return (
      <div className="mx-auto sm:mx-20 py-8">
        <h1 className="text-5xl font-bold mb-4 text-center sm:mt-4">
          Latest News!
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
          There is no news here yet
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto sm:mx-20 py-8">
      <h1 className="text-5xl font-bold mb-4 text-center sm:mt-4">
        Latest News!
      </h1>

      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {news.map((newsItem) => (
          <li
            key={newsItem.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
          >
            <Link href={`/news/${newsItem.id}`} className="flex flex-col gap-2">
              <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-lime-500 to-green-500" />
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-lg font-medium text-zinc-900">
                      {newsItem.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>

            <div
              className="px-6 mt-4 
            flex flex-col py-2 gap-6 text-xs text-zinc-500"
            >
              <p className="truncate">{newsItem.description}</p>
            </div>
            {user?.role !== "USER" && (
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
                  <Link href={`/news/edit/${newsItem.id}`}>
                    <PenLine className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="w-[250px]"
                  variant="destructive"
                  onClick={() => deleteNews({ id: newsItem.id })}
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

export default NewsPage;
