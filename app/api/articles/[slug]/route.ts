import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  await dbConnect();
  const { slug } = await params;
  const article = await ArticleModel.findOne({
    slug,
    status: "published",
  }).lean();
  if (!article) return apiError("Not found", 404);
  return apiResponse(article, 200, "OK");
}

export async function POST(_req: NextRequest, { params }: Ctx) {
  await dbConnect();
  const { slug } = await params;
  const article = await ArticleModel.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { returnDocument: "after" },
  )
    .select("views")
    .lean();
  if (!article) return apiError("Not found", 404);
  return apiResponse({ views: article.views }, 200, "View counted");
}
