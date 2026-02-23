import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(20, Number(searchParams.get("limit") ?? 9));
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");

    const filter: Record<string, unknown> = { status: "published" };
    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.featured = true;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const [articles, total] = await Promise.all([
      ArticleModel.find(filter)
        .select("-content")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ArticleModel.countDocuments(filter),
    ]);

    return apiResponse(
      { articles, total, page, pages: Math.ceil(total / limit) },
      200,
      "OK",
    );
  } catch {
    return apiError("Failed to fetch articles", 500);
  }
}
