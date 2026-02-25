import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const article = await ArticleModel.findOne({
      slug,
      published: true,
    }).lean();

    if (!article) return apiError("Article not found", 404);
    return apiResponse(article, 200, "Article fetched");
  } catch (error) {
    console.error("[GET /api/articles/:slug]", error);
    return apiError("Failed to fetch article", 500);
  }
}
