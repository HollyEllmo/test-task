import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

interface PageProps {
  params: {
    newsid: string;
  };
}

const NewsDetailPage = async ({ params }: PageProps) => {
  const { newsid } = params;
  const user = await currentUser();
  const news = await db.news.findFirst({
    where: {
      id: newsid,
      authorId: user?.id,
    },
  });

  console.log(news);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold">{news?.title}</h1>
      <p>Written by: {news?.authorId}</p>
      <div className="mt-4">{news?.description}</div>
      <div className="mt-4">{news?.fullText}</div>
    </div>
  );
};

export default NewsDetailPage;
