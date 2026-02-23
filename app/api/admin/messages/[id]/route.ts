/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import MessageModel from "@/Models/Message.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { isRead } = await req.json();

    const message = await MessageModel.findByIdAndUpdate(
      id,
      { isRead },
      { new: true },
    ).lean();

    if (!message) return apiError("Message not found", 404);
    return apiResponse(message, 200, "Message updated");
  } catch (error: any) {
    console.error("[PATCH /api/admin/messages/:id]", error);
    return apiError("Failed to update message", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const message = await MessageModel.findByIdAndDelete(id);
    if (!message) return apiError("Message not found", 404);

    return apiResponse(null, 200, "Message deleted");
  } catch (error: any) {
    console.error("[DELETE /api/admin/messages/:id]", error);
    return apiError("Failed to delete message", 500);
  }
}
