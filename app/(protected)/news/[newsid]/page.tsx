import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

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

  if (!news || !news.fileKey) return null;

  const file = await db.file.findUnique({
    where: {
      key: news.fileKey,
    },
  });

  if (!file || !file.url) return null;

  return (
    <div>
      <Card className="w-[375px] sm:w-[800px] xl:w-[1200px] h-full sm:h-auto">
        <CardHeader>
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-center pb-3">
            {news.title}
          </h1>
          <div className="flex flex-col items-center justify-center">
            <Image src={file?.url} alt="news cover" width={500} height={300} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">{news.fullText}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetailPage;
