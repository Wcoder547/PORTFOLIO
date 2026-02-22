/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import FAQModel from "@/Models/FAQ.model";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";

export const runtime = "nodejs";

// ✅ GET ALL — NO params here
export async function GET() {
  try {
    await dbConnect();

    const faqs = await FAQModel.find().sort({ order: 1, createdAt: 1 }).lean();

    return apiResponse(faqs, 200, "FAQs fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/admin/faq] Error:", error);
    return apiError("Failed to fetch FAQs", 500);
  }
}

// POST /api/admin/faq
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { question, answer } = body;

    if (!question?.trim()) return apiError("Question is required", 400);
    if (question.trim().length < 10)
      return apiError("Question must be at least 10 chars", 400);
    if (question.trim().length > 200)
      return apiError("Question max 200 chars", 400);
    if (!answer?.trim()) return apiError("Answer is required", 400);
    if (answer.trim().length < 20)
      return apiError("Answer must be at least 20 chars", 400);
    if (answer.trim().length > 1000)
      return apiError("Answer max 1000 chars", 400);

    const faq = await FAQModel.create({
      question: question.trim(),
      answer: answer.trim(),
      order: 0,
      isVisible: true,
    });

    return apiResponse(faq, 201, "FAQ created successfully");
  } catch (error: any) {
    console.error("[POST /api/admin/faq] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to create FAQ", 500);
  }
}
