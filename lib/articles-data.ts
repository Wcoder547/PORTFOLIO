/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: { public_id: string; url: string };
  featured: boolean;
  published: boolean;
  readTime: string;
  date: string;
  author: { name: string; bio: string; avatar: string };
  tableOfContents: { id: string; title: string }[];
}

function serialize<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function getAllArticles(): Promise<Article[]> {
  await dbConnect();
  const raw = await ArticleModel.find({ published: true })
    .sort({ createdAt: -1 })
    .lean();

  return serialize<any[]>(raw).map((a) => ({
    ...a,
    _id: String(a._id),
    date: formatDate(a.createdAt),
  })) as Article[];
}

export async function getFeaturedArticles(): Promise<Article[]> {
  await dbConnect();
  const raw = await ArticleModel.find({ published: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return serialize<any[]>(raw).map((a) => ({
    ...a,
    _id: String(a._id),
    date: formatDate(a.createdAt),
  })) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await dbConnect();
  const raw = await ArticleModel.findOne({ slug, published: true }).lean();

  if (!raw) return null;

  const a = serialize<any>(raw);
  return {
    ...a,
    _id: String(a._id),
    date: formatDate(a.createdAt),
  } as Article;
}
