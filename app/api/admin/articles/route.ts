/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";
import { calcReadTime, extractTOC, slugify } from "@/lib/articles-utils";

export const runtime = "nodejs";

// ── GET all articles (admin — includes unpublished) ───────────────────────────
export async function GET() {
  try {
    await dbConnect();
    const articles = await ArticleModel.find().sort({ createdAt: -1 }).lean();
    return apiResponse(articles, 200, "Articles fetched");
  } catch (error: any) {
    console.error("[GET /api/admin/articles]", error);
    return apiError("Failed to fetch articles", 500);
  }
}

// ── POST create article ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tagsRaw = formData.get("tags") as string;
    const featured = formData.get("featured") === "true";
    const published = formData.get("published") === "true";
    const imageFile = formData.get("image") as File | null;

    const authorName = formData.get("authorName") as string;
    const authorBio = formData.get("authorBio") as string;
    const authorAvatar = formData.get("authorAvatar") as string;

    // Validation
    if (!title?.trim()) return apiError("Title is required", 400);
    if (!excerpt?.trim()) return apiError("Excerpt is required", 400);
    if (!content?.trim()) return apiError("Content is required", 400);
    if (!category?.trim()) return apiError("Category is required", 400);
    if (!imageFile) return apiError("Cover image is required", 400);

    // Image upload
    if (imageFile.size > 5 * 1024 * 1024)
      return apiError("Image must be under 5MB", 400);
    if (!imageFile.type.startsWith("image/"))
      return apiError("Only image files allowed", 400);

    const uploaded = await uploadToCloudinary(imageFile, "portfolio/articles");
    const imageData = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };

    // Build slug — ensure uniqueness
    let baseSlug = slugify(title.trim());
    let slug = baseSlug;
    let counter = 1;
    while (await ArticleModel.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const article = await ArticleModel.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      tags,
      image: imageData,
      featured,
      published,
      readTime: calcReadTime(content),
      author: {
        name: authorName?.trim() || "Waseem Akram",
        bio: authorBio?.trim() || "",
        avatar: authorAvatar?.trim() || "",
      },
      tableOfContents: extractTOC(content),
    });

    return apiResponse(article, 201, "Article created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/articles]", error);
    if (error.code === 11000) return apiError("Slug already exists", 400);
    if (error.name === "ValidationError")
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => (e as any).message),
      );
    return apiError("Failed to create article", 500);
  }
}
