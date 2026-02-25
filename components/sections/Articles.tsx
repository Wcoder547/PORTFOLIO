// NO "use client" — server component
import { getFeaturedArticles } from "@/lib/articles-data";
import ArticlesClient from "@/components/sections/ArticlesClient";

export async function Articles() {
  const featuredArticles = await getFeaturedArticles();
  return <ArticlesClient articles={featuredArticles} />;
}
