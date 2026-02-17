import { notFound } from "next/navigation";
import ArticleDetailPage from "@/pages/article-detail-page";
import { getArticleBySlug, getAllArticles } from "@/lib/articles-data";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; 
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | Yash Kapure`,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; // ← AWAIT HERE!
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailPage article={article} />;
}
