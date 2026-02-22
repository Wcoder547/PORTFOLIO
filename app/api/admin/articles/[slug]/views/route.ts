/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const article = await ArticleModel.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    )
      .select("views")
      .lean();

    if (!article) return apiError("Article not found", 404);

    return apiResponse({ views: article.views }, 200, "View counted");
  } catch (error: any) {
    console.error("[POST /api/articles/:slug/views] Error:", error);
    return apiError("Failed to count view", 500);
  }
}
