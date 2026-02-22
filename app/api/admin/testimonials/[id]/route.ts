/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/mongoose";
import TestimonialModel from "@/Models/Testimonial.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

// GET /api/admin/testimonials/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const testimonial = await TestimonialModel.findById(id).lean();
    if (!testimonial) return apiError("Testimonial not found", 404);

    return apiResponse(testimonial, 200, "Testimonial fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/testimonials/:id] Error:", error);
    return apiError("Failed to fetch testimonial", 500);
  }
}

// PUT /api/admin/testimonials/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const existing = await TestimonialModel.findById(id);
    if (!existing) return apiError("Testimonial not found", 404);

    const formData = await req.formData();
    const quote = formData.get("quote") as string;
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const newAvatarFile = formData.get("avatar") as File | null;
    const avatarUrl = formData.get("avatarUrl") as string | null;
    const removeAvatar = formData.get("removeAvatar") as string | null;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!quote?.trim()) return apiError("Quote is required", 400);
    if (quote.trim().length < 30)
      return apiError("Quote must be at least 30 chars", 400);
    if (quote.trim().length > 600) return apiError("Quote max 600 chars", 400);
    if (!author?.trim()) return apiError("Author is required", 400);
    if (!title?.trim()) return apiError("Title is required", 400);
    if (!location?.trim()) return apiError("Location is required", 400);

    // ── Handle avatar ─────────────────────────────────────────────────────────
    let avatarData = existing.avatar;

    if (removeAvatar === "true") {
      // User cleared the avatar
      if (existing.avatar?.public_id) {
        await cloudinary.uploader.destroy(existing.avatar.public_id);
      }
      avatarData = undefined;
    } else if (newAvatarFile && newAvatarFile.size > 0) {
      // New file uploaded → delete old Cloudinary image if any
      if (newAvatarFile.size > 3 * 1024 * 1024)
        return apiError("Avatar must be under 3MB", 400);
      if (!newAvatarFile.type.startsWith("image/"))
        return apiError("Avatar must be an image", 400);

      if (existing.avatar?.public_id) {
        await cloudinary.uploader.destroy(existing.avatar.public_id);
      }

      const uploaded = await uploadToCloudinary(
        newAvatarFile,
        "portfolio/testimonials/avatars",
      );
      avatarData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    } else if (avatarUrl?.startsWith("http")) {
      // Switched to URL mode — delete old Cloudinary image if any
      if (existing.avatar?.public_id) {
        await cloudinary.uploader.destroy(existing.avatar.public_id);
      }
      avatarData = { url: avatarUrl }; // no public_id
    }
    // else: no change to avatar — keep existing.avatar

    const updated = await TestimonialModel.findByIdAndUpdate(
      id,
      {
        quote: quote.trim(),
        author: author.trim(),
        title: title.trim(),
        location: location.trim(),
        avatar: avatarData,
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    return apiResponse(updated, 200, "Testimonial updated successfully");
  } catch (error: any) {
    console.error("[PUT /api/admin/testimonials/:id] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to update testimonial", 500);
  }
}

// DELETE /api/admin/testimonials/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const testimonial = await TestimonialModel.findById(id);
    if (!testimonial) return apiError("Testimonial not found", 404);

    // Delete Cloudinary avatar only if it was uploaded (has public_id)
    if (testimonial.avatar?.public_id) {
      await cloudinary.uploader.destroy(testimonial.avatar.public_id);
    }

    await TestimonialModel.findByIdAndDelete(id);

    return apiResponse(null, 200, "Testimonial deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/admin/testimonials/:id] Error:", error);
    return apiError("Failed to delete testimonial", 500);
  }
}
