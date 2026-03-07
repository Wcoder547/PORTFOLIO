/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ProjectModel from "@/Models/Project.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const projects = await ProjectModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return apiResponse(projects, 200, "Projects fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/projects] Error:", error);
    return apiError("Failed to fetch projects", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const company = formData.get("company") as string;
    const order = formData.get("order") as string;
    const featured = formData.get("featured") as string;
    const isVisible = formData.get("isVisible") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];

    const techStackRaw = formData.get("techStack") as string;
    let techStack: string[] = [];
    try {
      techStack = techStackRaw ? JSON.parse(techStackRaw) : [];
    } catch {
      techStack = [];
    }

    if (!title?.trim()) return apiError("Title is required", 400);
    if (title.trim().length > 100) return apiError("Title max 100 chars", 400);
    if (!description?.trim()) return apiError("Description is required", 400);

    let thumbnailData: { public_id: string; url: string } | undefined;

    if (thumbnailFile && thumbnailFile.size > 0) {
      if (thumbnailFile.size > 5 * 1024 * 1024)
        return apiError("Thumbnail must be under 5MB", 400);
      if (!thumbnailFile.type.startsWith("image/"))
        return apiError("Thumbnail must be an image", 400);

      const uploaded = await uploadToCloudinary(
        thumbnailFile,
        "portfolio/projects/thumbnails",
      );
      thumbnailData = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    let galleryData: { public_id: string; url: string }[] = [];

    if (galleryFiles.length > 0) {
      if (galleryFiles.length > 6) return apiError("Max 6 gallery images", 400);
      const valid = galleryFiles.filter(
        (f) => f.size > 0 && f.type.startsWith("image/"),
      );
      const uploads = await Promise.all(
        valid.map((f) => uploadToCloudinary(f, "portfolio/projects/gallery")),
      );
      galleryData = uploads.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
      }));
    }

    const project = await ProjectModel.create({
      title: title.trim(),
      description: description.trim(),
      longDescription: longDescription?.trim() || undefined,
      thumbnail: thumbnailData,
      images: galleryData,
      techStack: techStack.map((t: string) => t.trim()).filter(Boolean),
      category: category || "fullstack",
      status: status || "completed",
      featured: featured === "true",
      liveUrl: liveUrl?.trim() || undefined,
      githubUrl: githubUrl?.trim() || undefined,
      company: company?.trim() || undefined,
      order: order ? parseInt(order) : 0,
      isVisible: isVisible !== "false",
    });

    return apiResponse(project, 201, "Project created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/projects] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to create project", 500);
  }
}
