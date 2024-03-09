import { db } from "@/lib/db";
import Link from "next/link";

const NewsPage = async () => {
  const news = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {news.map((newsItem) => (
          <Link
            key={newsItem.id}
            href={`/news/${newsItem.id}`}
            className="bg-white p-4 rounded-md shadow-md"
          >
            <h2 className="text-xl font-bold">{newsItem.title}</h2>
            <p>Written by: {newsItem.author?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
