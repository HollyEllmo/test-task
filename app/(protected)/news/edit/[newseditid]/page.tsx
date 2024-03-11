"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";

import { EditNewsSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { NewsStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import UploadButton from "@/components/upload-button";
import { useFileResponse } from "@/components/FileContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const CreateNewsPage = () => {
  const user = useCurrentUser();
  const router = useRouter();
  if (!user || user?.role === "USER") redirect("/");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [newsItem, setNewsItem] = useState({
    id: "",
    title: "",
    description: "",
    fullText: "",
    status: undefined,
    authorId: "",
    fileKey: "",
    file: {
      createdAt: "",
      updatedAt: "",
      id: "",
      name: "",
      key: "",
      url: "",
      uploadStatus: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const { fileResponse } = useFileResponse();

  function removePrefix(path: string) {
    const prefix = "/news/edit/";
    return path.replace(prefix, "");
  }

  const { id, title, description, fullText, status, authorId, fileKey } =
    newsItem;

  const fileUrl = newsItem.file.url;

  const form = useForm<z.infer<typeof EditNewsSchema>>({
    resolver: zodResolver(EditNewsSchema),
    defaultValues: {
      title: "",
      description: "",
      fullText: "",
      status: "DRAFT",
      authorId: "",
      fileKey: "",
      id: "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (fileResponse && fileResponse.key) {
      setValue("fileKey", fileResponse.key);
      setImageUrl(fileResponse.url);
    }
  }, [fileResponse, setValue]);

  useEffect(() => {
    if (
      title &&
      description &&
      fullText &&
      status &&
      fileKey &&
      fileUrl &&
      authorId
    ) {
      setValue("title", title);
      setValue("description", description);
      setValue("fullText", fullText);
      setValue("status", status);
      setValue("fileKey", fileKey);
      setValue("id", id);
      setValue("authorId", authorId);
      setImageUrl(fileUrl);
    }
  }, [
    description,
    fileKey,
    fileUrl,
    fullText,
    setValue,
    status,
    title,
    id,
    authorId,
  ]);

  const pathname = usePathname();

  const NewsId = removePrefix(pathname);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (NewsId) {
        try {
          const response = await axios.post("/api/getNewsItem", {
            id: NewsId,
          });
          setNewsItem(response.data.newsItem);
        } catch (error) {
          console.error("Error while searching for news:", error);
        }
      }
    };

    fetchNewsItem();
  }, [NewsId]);

  const { mutate: sendFormValues } = useMutation({
    mutationFn: async ({
      values,
    }: {
      values: z.infer<typeof EditNewsSchema>;
    }) => {
      try {
        const response = await fetch("/api/updateNews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        router.push(`news/${data.updatedNews.id}`);

        if (response.ok) {
          if (response.status === 200) {
            form.reset();

            setSuccess("News Edited!");
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
        setError("Network error or something went wrong");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof EditNewsSchema>) => {
    startTransition(() => {
      setError(undefined);
      setSuccess(undefined);

      sendFormValues({ values });
    });
  };

  if (!id) {
    return <Skeleton className="w-[375px] sm:w-[600px] h-full" />;
  }

  return (
    <Card className="w-[375px] sm:w-[600px] h-full sm:h-auto">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">📝 Edit News</p>
      </CardHeader>
      <CardContent>
        <div className="py-7 flex flex-col-reverse sm:flex-row items-center justify-center gap-10">
          <UploadButton />
          {imageUrl?.length ? (
            <Image src={imageUrl} alt="news cover" width={300} height={100} />
          ) : null}
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="News Title"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="News Description"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="hidden" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="hidden" />
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
                    <FormControl>
                      <Input {...field} disabled={isPending} type="hidden" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Text</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
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
                        <SelectItem value={NewsStatus.PUBLISHED}>
                          PUBLISHED
                        </SelectItem>
                        <SelectItem value={NewsStatus.DRAFT}>DRAFT</SelectItem>
                        <SelectItem value={NewsStatus.ARCHIVED}>
                          ARCHIVED
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
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateNewsPage;
