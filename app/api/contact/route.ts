/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongoose";
import MessageModel from "@/Models/Message.model";
import { apiResponse } from "@/utils/apiResponse";
import { apiError } from "@/utils/apiError";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, message, budget, currency, timeline } = body;

    if (!name?.trim()) return apiError("Name is required", 400);
    if (!email?.trim()) return apiError("Email is required", 400);
    if (!message?.trim()) return apiError("Message is required", 400);

    // ── Save to DB ────────────────────────────────────────────────────────
    await MessageModel.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      budget: budget?.trim() || undefined,
      currency: currency?.trim() || undefined,
      timeline: timeline?.trim() || undefined,
      isRead: false,
    });

    // ── Send email ────────────────────────────────────────────────────────
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
        replyTo: email,
        subject: `New message from ${name}`,
        html: `
          <h2 style="color:#10b981">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ""}
          ${budget ? `<p><strong>Budget:</strong> ${currency ?? "USD"} ${budget}</p>` : ""}
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        `,
      });
    } catch (emailErr) {
      // Email failure should NOT block the user — message is already saved to DB
      console.error("[contact] Email send failed:", emailErr);
    }

    return apiResponse(null, 200, "Message sent successfully");
  } catch (error: any) {
    console.error("[POST /api/contact]", error);
    return apiError("Failed to send message. Please try again.", 500);
  }
}
