import dbConnect from "@/lib/mongoose";
import ProjectModel from "@/Models/Project.model";
import TestimonialModel from "@/Models/Testimonial.model";
import FAQModel from "@/Models/FAQ.model";
import ExperienceModel from "@/Models/Experience.model";
import MessageModel from "@/Models/Message.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const [
      projects,
      testimonials,
      faqs,
      experiences,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      ProjectModel.countDocuments({ isVisible: true }),
      TestimonialModel.countDocuments({ isVisible: true }),
      FAQModel.countDocuments({ isVisible: true }),
      ExperienceModel.countDocuments({ isVisible: true }),
      MessageModel.countDocuments(),
      MessageModel.countDocuments({ isRead: false }),
    ]);

    return apiResponse(
      {
        projects,
        testimonials,
        faqs,
        experiences,
        totalMessages,
        unreadMessages,
      },
      200,
      "Stats fetched",
    );
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return apiError("Failed to fetch stats", 500);
  }
}
