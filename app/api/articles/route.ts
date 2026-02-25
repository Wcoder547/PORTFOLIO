import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();
    const articles = await ArticleModel.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return apiResponse(articles, 200, "Articles fetched");
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return apiError("Failed to fetch articles", 500);
  }
}
