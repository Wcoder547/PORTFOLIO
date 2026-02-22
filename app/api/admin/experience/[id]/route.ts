/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import ExperienceModel from "@/Models/Experience.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

// GET /api/admin/experience/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const experience = await ExperienceModel.findById(id).lean();
    if (!experience) return apiError("Experience not found", 404);

    return apiResponse(experience, 200, "Experience fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/experience/:id] Error:", error);
    return apiError("Failed to fetch experience", 500);
  }
}

// PUT /api/admin/experience/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const existing = await ExperienceModel.findById(id);
    if (!existing) return apiError("Experience not found", 404);

    const body = await req.json(); // ✅ JSON not formData
    const { company, role, duration, description, techStack } = body;

    if (!company?.trim()) return apiError("Company is required", 400);
    if (!role?.trim()) return apiError("Role is required", 400);
    if (!duration?.trim()) return apiError("Duration is required", 400);

    const updated = await ExperienceModel.findByIdAndUpdate(
      id,
      {
        company: company.trim(),
        role: role.trim(),
        duration: duration.trim(),
        description: description?.trim() ?? existing.description,
        techStack: Array.isArray(techStack)
          ? techStack.map((t: string) => t.trim()).filter(Boolean)
          : existing.techStack,
      },
      { returnDocument: "after", runValidators: true },
    ).lean();

    return apiResponse(updated, 200, "Experience updated successfully");
  } catch (error: any) {
    console.error("[PUT /api/admin/experience/:id] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to update experience", 500);
  }
}

// DELETE /api/admin/experience/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const experience = await ExperienceModel.findById(id);
    if (!experience) return apiError("Experience not found", 404);

    await ExperienceModel.findByIdAndDelete(id);

    return apiResponse(null, 200, "Experience deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/admin/experience/:id] Error:", error);
    return apiError("Failed to delete experience", 500);
  }
}
