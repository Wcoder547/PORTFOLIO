import ArticlesPageContent from "@/pages/articles-page";

export const revalidate = 3600;

export const metadata = {
  title: "Articles & Insights | Waseem Akram",
  description:
    "In-depth tutorials, best practices, and insights on modern web development, AI, and tech trends.",
};

export default function ArticlesPage() {
  return <ArticlesPageContent />;
}
