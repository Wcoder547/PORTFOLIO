import { getAllArticles } from "@/lib/articles-data";
import ArticlesListClient from "@/components/articles/ArticlesListClient";

export const revalidate = 3600;

export const metadata = {
  title: "Articles & Insights | Waseem Akram",
  description:
    "In-depth tutorials, best practices, and insights on modern web development, AI, and tech trends.",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  const categories = [
    "All",
    ...Array.from(new Set(articles.map((a) => a.category))).sort(),
  ];

  return <ArticlesListClient articles={articles} categories={categories} />;
}
