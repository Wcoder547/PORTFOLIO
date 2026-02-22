/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import TestimonialModel from "@/Models/Testimonial.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

// GET /api/admin/testimonials
export async function GET() {
  try {
    await dbConnect();

    const testimonials = await TestimonialModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return apiResponse(testimonials, 200, "Testimonials fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/testimonials] Error:", error);
    return apiError("Failed to fetch testimonials", 500);
  }
}

// POST /api/admin/testimonials
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const quote = formData.get("quote") as string;
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const avatarFile = formData.get("avatar") as File | null;
    const avatarUrl = formData.get("avatarUrl") as string | null;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!quote?.trim()) return apiError("Quote is required", 400);
    if (quote.trim().length < 30)
      return apiError("Quote must be at least 30 chars", 400);
    if (quote.trim().length > 600) return apiError("Quote max 600 chars", 400);
    if (!author?.trim()) return apiError("Author is required", 400);
    if (author.trim().length > 80) return apiError("Author max 80 chars", 400);
    if (!title?.trim()) return apiError("Title is required", 400);
    if (title.trim().length > 100) return apiError("Title max 100 chars", 400);
    if (!location?.trim()) return apiError("Location is required", 400);
    if (location.trim().length > 80)
      return apiError("Location max 80 chars", 400);

    // ── Avatar (file upload OR external URL) ──────────────────────────────────
    let avatarData: { public_id?: string; url: string } | undefined;

    if (avatarFile && avatarFile.size > 0) {
      if (avatarFile.size > 3 * 1024 * 1024)
        return apiError("Avatar must be under 3MB", 400);
      if (!avatarFile.type.startsWith("image/"))
        return apiError("Avatar must be an image", 400);

      const uploaded = await uploadToCloudinary(
        avatarFile,
        "portfolio/testimonials/avatars",
      );
      avatarData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    } else if (avatarUrl?.startsWith("http")) {
      avatarData = { url: avatarUrl }; // no public_id — external URL
    }

    const testimonial = await TestimonialModel.create({
      quote: quote.trim(),
      author: author.trim(),
      title: title.trim(),
      location: location.trim(),
      avatar: avatarData,
      order: 0,
      isVisible: true,
    });

    return apiResponse(testimonial, 201, "Testimonial created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/testimonials] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to create testimonial", 500);
  }
}
