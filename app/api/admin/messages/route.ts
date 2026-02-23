import dbConnect from "@/lib/mongoose";
import MessageModel from "@/Models/Message.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const [messages, unreadCount] = await Promise.all([
      MessageModel.find().sort({ createdAt: -1 }).lean(),
      MessageModel.countDocuments({ isRead: false }),
    ]);

    return apiResponse({ messages, unreadCount }, 200, "Messages fetched");
  } catch (error) {
    console.error("[GET /api/admin/messages]", error);
    return apiError("Failed to fetch messages", 500);
  }
}
