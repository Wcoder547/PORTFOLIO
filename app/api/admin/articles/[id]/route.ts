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

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await dbConnect();
    const { id } = await params;

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

    const existing = await ArticleModel.findById(id);
    if (!existing) return apiError("Article not found", 404);

    // Handle image replacement
    let imageData = existing.image;
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024)
        return apiError("Image must be under 5MB", 400);
      if (!imageFile.type.startsWith("image/"))
        return apiError("Only image files allowed", 400);

      // Delete old image from Cloudinary
      if (existing.image?.public_id)
        await cloudinary.uploader.destroy(existing.image.public_id);

      const uploaded = await uploadToCloudinary(
        imageFile,
        "portfolio/articles",
      );
      imageData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : existing.tags;

    const updatedContent = content?.trim() || existing.content;

    // Re-slug only if title changed
    let slug = existing.slug;
    if (title?.trim() && title.trim() !== existing.title) {
      let baseSlug = slugify(title.trim());
      slug = baseSlug;
      let counter = 1;
      while (await ArticleModel.exists({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updated = await ArticleModel.findByIdAndUpdate(
      id,
      {
        title: title?.trim() || existing.title,
        slug,
        excerpt: excerpt?.trim() || existing.excerpt,
        content: updatedContent,
        category: category?.trim() || existing.category,
        tags,
        image: imageData,
        featured,
        published,
        readTime: calcReadTime(updatedContent),
        author: {
          name: authorName?.trim() || existing.author.name,
          bio: authorBio?.trim() || existing.author.bio,
          avatar: authorAvatar?.trim() || existing.author.avatar,
        },
        tableOfContents: extractTOC(updatedContent),
      },
      { new: true, runValidators: true },
    ).lean();

    return apiResponse(updated, 200, "Article updated successfully");
  } catch (error: any) {
    console.error("[PATCH /api/admin/articles/:id]", error);
    return apiError("Failed to update article", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    await dbConnect();
    const { id } = await params;

    const article = await ArticleModel.findById(id);
    if (!article) return apiError("Article not found", 404);

    if (article.image?.public_id)
      await cloudinary.uploader.destroy(article.image.public_id);

    await ArticleModel.findByIdAndDelete(id);
    return apiResponse(null, 200, "Article deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/admin/articles/:id]", error);
    return apiError("Failed to delete article", 500);
  }
}
