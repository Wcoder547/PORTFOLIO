import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles-data";
import ArticleDetailClient from "@/pages/article-detail-page";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug); // ✅ await added
  if (!article) return {};
  return {
    title: `${article.title} | Waseem Akram`,
    description: article.excerpt,
  };
}

export default async function ArticleSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug); 

  if (!article) notFound();

  return <ArticleDetailClient article={article!} />;
}
