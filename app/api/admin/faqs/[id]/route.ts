/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import FAQModel from "@/Models/FAQ.model";
import type { IFAQData } from "@/Models/FAQ.model"; 

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const faq = await FAQModel.findById(id).lean<IFAQData>();
    if (!faq) return apiError("FAQ not found", 404);

    return apiResponse(faq, 200, "FAQ fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/faqs/:id] Error:", error);
    return apiError("Failed to fetch FAQ", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    // ── IFAQData (not IFAQ) — lean() returns plain object, not Document ────────
    const existing = await FAQModel.findById(id).lean<IFAQData>();
    if (!existing) return apiError("FAQ not found", 404);

    const body = await req.json();
    const { question, answer, category, order, isVisible } = body;

    if (!question?.trim()) return apiError("Question is required", 400);
    if (question.trim().length < 10)
      return apiError("Question must be at least 10 chars", 400);
    if (question.trim().length > 200)
      return apiError("Question max 200 chars", 400);

    if (!answer?.trim()) return apiError("Answer is required", 400);
    if (answer.trim().length < 10)
      return apiError("Answer must be at least 10 chars", 400);
    if (answer.trim().length > 1000)
      return apiError("Answer max 1000 chars", 400);

    const validCategories = [
      "general",
      "services",
      "pricing",
      "technical",
      "other",
    ];
    if (category && !validCategories.includes(category)) {
      return apiError("Invalid category", 400);
    }

    const updated = await FAQModel.findByIdAndUpdate(
      id,
      {
        question: question.trim(),
        answer: answer.trim(),
        category: category || existing.category, 
        order: order ?? existing.order,
        isVisible: isVisible ?? existing.isVisible,
      },
      { returnDocument: "after", runValidators: true },
    ).lean<IFAQData>();

    return apiResponse(updated, 200, "FAQ updated successfully");
  } catch (error: any) {
    console.error("[PUT /api/admin/faqs/:id] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to update FAQ", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const existing = await FAQModel.findById(id);
    if (!existing) return apiError("FAQ not found", 404);

    const updated = await FAQModel.findByIdAndUpdate(
      id,
      { isVisible: !existing.isVisible },
      { returnDocument: "after" },
    ).lean<IFAQData>();

    return apiResponse(
      updated,
      200,
      `FAQ ${updated?.isVisible ? "visible" : "hidden"} successfully`,
    );
  } catch (error: any) {
    console.error("[PATCH /api/admin/faqs/:id] Error:", error);
    return apiError("Failed to toggle FAQ visibility", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const faq = await FAQModel.findById(id);
    if (!faq) return apiError("FAQ not found", 404);

    await FAQModel.findByIdAndDelete(id);

    return apiResponse(null, 200, "FAQ deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/admin/faqs/:id] Error:", error);
    return apiError("Failed to delete FAQ", 500);
  }
}
