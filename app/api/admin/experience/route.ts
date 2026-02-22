/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ExperienceModel from "@/Models/Experience.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const experiences = await ExperienceModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return apiResponse(experiences, 200, "Experiences fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/experience] Error:", error);
    return apiError("Failed to fetch experiences", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { company, role, duration, description, techStack } = body;

    if (!company?.trim()) return apiError("Company is required", 400);
    if (!role?.trim()) return apiError("Role is required", 400);
    if (!duration?.trim()) return apiError("Duration is required", 400);

    const experience = await ExperienceModel.create({
      company: company.trim(),
      role: role.trim(),
      duration: duration.trim(),
      description: description?.trim() || "",
      techStack: Array.isArray(techStack)
        ? techStack.map((t: string) => t.trim()).filter(Boolean)
        : [],
      order: 0,
      isVisible: true,
    });

    return apiResponse(experience, 201, "Experience created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/experience] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to create experience", 500);
  }
}
