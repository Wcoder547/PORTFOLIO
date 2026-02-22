/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ProjectModel from "@/Models/Project.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// GET /api/admin/projects/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await ProjectModel.findById(id).lean();
    if (!project) return apiError("Project not found", 404);
    return apiResponse(project, 200, "Project fetched successfully");
  } catch (error: any) {
    return apiError("Failed to fetch project", 500);
  }
}

// PUT /api/admin/projects/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const existing = await ProjectModel.findById(id);
    if (!existing) return apiError("Project not found", 404);

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const company = formData.get("company") as string; // ✅
    const order = formData.get("order") as string;
    const featured = formData.get("featured") as string;
    const isVisible = formData.get("isVisible") as string;
    const newThumbnail = formData.get("thumbnail") as File | null;
    const removeThumbnail = formData.get("removeThumbnail") as string; // ✅
    const newGallery = formData.getAll("gallery") as File[];

    const removeGalleryRaw = formData.get("removeGallery") as string;
    let removeGalleryIds: string[] = [];
    try {
      removeGalleryIds = removeGalleryRaw ? JSON.parse(removeGalleryRaw) : [];
    } catch {
      removeGalleryIds = [];
    }

    const techStackRaw = formData.get("techStack") as string;
    let techStack: string[] = [];
    try {
      techStack = techStackRaw ? JSON.parse(techStackRaw) : existing.techStack;
    } catch {
      techStack = existing.techStack;
    }

    if (!title?.trim()) return apiError("Title is required", 400);
    if (!description?.trim()) return apiError("Description is required", 400);

    // ── Handle thumbnail ──────────────────────────────────────────────────────
    let thumbnailData = existing.thumbnail;

    // User explicitly removed the image
    if (removeThumbnail === "true" && existing.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(existing.thumbnail.public_id);
      thumbnailData = undefined;
    }

    // User uploaded a new image
    if (newThumbnail && newThumbnail.size > 0) {
      if (newThumbnail.size > 5 * 1024 * 1024)
        return apiError("Thumbnail must be under 5MB", 400);
      if (!newThumbnail.type.startsWith("image/"))
        return apiError("Thumbnail must be an image", 400);

      if (existing.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(existing.thumbnail.public_id);
      }

      const uploaded = await uploadToCloudinary(
        newThumbnail,
        "portfolio/projects/thumbnails",
      );
      thumbnailData = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    // ── Handle gallery ────────────────────────────────────────────────────────
    let updatedGallery = existing.images || [];

    if (removeGalleryIds.length > 0) {
      await Promise.all(
        removeGalleryIds.map((pid) => cloudinary.uploader.destroy(pid)),
      );
      updatedGallery = updatedGallery.filter(
        (img: any) => !removeGalleryIds.includes(img.public_id),
      );
    }

    if (newGallery.length > 0) {
      if (updatedGallery.length + newGallery.length > 6) {
        return apiError(`Max 6 gallery images`, 400);
      }
      const valid = newGallery.filter(
        (f) => f.size > 0 && f.type.startsWith("image/"),
      );
      const uploads = await Promise.all(
        valid.map((f) => uploadToCloudinary(f, "portfolio/projects/gallery")),
      );
      updatedGallery = [
        ...updatedGallery,
        ...uploads.map((r) => ({ public_id: r.public_id, url: r.secure_url })),
      ];
    }

    const updated = await ProjectModel.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription?.trim() || undefined,
        thumbnail: thumbnailData,
        images: updatedGallery,
        techStack: techStack.map((t: string) => t.trim()).filter(Boolean),
        category: category || existing.category,
        status: status || existing.status,
        featured: featured !== null ? featured === "true" : existing.featured,
        isVisible:
          isVisible !== null ? isVisible === "true" : existing.isVisible,
        liveUrl: liveUrl?.trim() || undefined,
        githubUrl: githubUrl?.trim() || undefined,
        company: company?.trim() || undefined, // ✅
        order: order ? parseInt(order) : existing.order,
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    return apiResponse(updated, 200, "Project updated successfully");
  } catch (error: any) {
    console.error("[PUT /api/admin/projects/:id] Error:", error);
    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }
    return apiError("Failed to update project", 500);
  }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await ProjectModel.findById(id);
    if (!project) return apiError("Project not found", 404);

    const deleteTargets: string[] = [];
    if (project.thumbnail?.public_id)
      deleteTargets.push(project.thumbnail.public_id);
    project.images?.forEach((img: any) => {
      if (img.public_id) deleteTargets.push(img.public_id);
    });

    if (deleteTargets.length > 0) {
      await Promise.all(
        deleteTargets.map((pid) => cloudinary.uploader.destroy(pid)),
      );
    }

    await ProjectModel.findByIdAndDelete(id);
    return apiResponse(null, 200, "Project deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/admin/projects/:id] Error:", error);
    return apiError("Failed to delete project", 500);
  }
}
