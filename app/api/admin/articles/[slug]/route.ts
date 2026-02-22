/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/Models/Article.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import slugify from "slugify";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/articles — Fetch all (with optional filters)
// ?status=published|draft  ?category=...  ?featured=true
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const articles = await ArticleModel.find(filter)
      .select("-content") // exclude heavy markdown on list view
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return apiResponse(articles, 200, "Articles fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/articles] Error:", error);
    return apiError("Failed to fetch articles", 500);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/articles — Create new
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    // ── Parse fields ──────────────────────────────────────────────────────────
    const title = formData.get("title") as string;
    const content = formData.get("content") as string; // markdown
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string; // "draft" | "published"
    const featured = formData.get("featured") as string;
    const coverImage = formData.get("coverImage") as File | null;
    const customSlug = formData.get("slug") as string; // optional override

    // Tags — JSON array ["Next.js", "MongoDB"]
    const tagsRaw = formData.get("tags") as string;
    let tags: string[] = [];
    try {
      tags = tagsRaw ? JSON.parse(tagsRaw) : [];
    } catch {
      tags = [];
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (!title?.trim()) return apiError("Title is required", 400);
    if (title.trim().length > 150) return apiError("Title max 150 chars", 400);

    if (!content?.trim()) return apiError("Content is required", 400);
    if (content.trim().length < 50)
      return apiError("Content must be at least 50 chars", 400);

    if (!excerpt?.trim()) return apiError("Excerpt is required", 400);
    if (excerpt.trim().length > 300)
      return apiError("Excerpt max 300 chars", 400);

    const validCategories = [
      "tutorial",
      "opinion",
      "case-study",
      "news",
      "other",
    ];
    if (category && !validCategories.includes(category)) {
      return apiError("Invalid category", 400);
    }

    const validStatuses = ["draft", "published"];
    if (status && !validStatuses.includes(status)) {
      return apiError("Invalid status. Use 'draft' or 'published'", 400);
    }

    // ── Generate slug ─────────────────────────────────────────────────────────
    const baseSlug = customSlug?.trim()
      ? slugify(customSlug.trim(), { lower: true, strict: true })
      : slugify(title.trim(), { lower: true, strict: true });

    // Ensure slug is unique
    let slug = baseSlug;
    const existing = await ArticleModel.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    // ── Cover image upload (optional) ─────────────────────────────────────────
    let coverImageData: { public_id: string; url: string } | undefined;

    if (coverImage && coverImage.size > 0) {
      if (coverImage.size > 5 * 1024 * 1024)
        return apiError("Cover image must be under 5MB", 400);
      if (!coverImage.type.startsWith("image/"))
        return apiError("Cover must be an image", 400);

      const uploaded = await uploadToCloudinary(
        coverImage,
        "portfolio/articles/covers",
      );
      coverImageData = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    // ── Read time estimate ────────────────────────────────────────────────────
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 wpm

    // ── Save ──────────────────────────────────────────────────────────────────
    const article = await ArticleModel.create({
      title: title.trim(),
      slug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      category: category || "other",
      status: status || "draft",
      featured: featured === "true",
      tags: tags.map((t: string) => t.trim()).filter(Boolean),
      coverImage: coverImageData,
      readTime,
      views: 0,
      publishedAt: status === "published" ? new Date() : undefined,
    });

    return apiResponse(article, 201, "Article created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/articles] Error:", error);

    if (error.code === 11000) {
      return apiError("An article with this slug already exists", 409);
    }

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to create article", 500);
  }
}
