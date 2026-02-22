/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import UserModel from "@/Models/User.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiError } from "@/utils/apiError";
import { apiResponse } from "@/utils/apiResponse";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const user = await UserModel.findOne().lean();

    if (!user) {
      return apiError("No profile set up yet", 404);
    }

    return apiResponse(user, 200, "Profile fetched successfully");
  } catch (error: any) {
    console.error("[GET /api/user] Error:", error);
    return apiError("Failed to fetch profile", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const headline = formData.get("headline") as string;
    const description = formData.get("description") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const cvUrl = formData.get("cvUrl") as string;
    const imageFile = formData.get("image") as File | null;

    const socialsRaw = formData.get("socials") as string;
    let socials: Record<string, string> = {};
    try {
      socials = socialsRaw ? JSON.parse(socialsRaw) : {};
    } catch (error: any) {
      return apiError("Invalid socials JSON", 400, [error.message]);
    }

    if (!headline?.trim()) {
      return apiError("Headline is required", 400);
    }

    if (headline.trim().length < 5) {
      return apiError("Headline must be at least 5 characters", 400);
    }

    if (headline.length > 100) {
      return apiError("Headline cannot exceed 100 characters", 400);
    }
    console.log("Received description:", { description });
    if (!description?.trim()) {
      return apiError("Bio is required", 400);
    }

    if (description.trim().length < 20) {
      return apiError("Bio must be at least 20 characters", 400);
    }

    if (whatsapp && !/^\d{10,15}$/.test(whatsapp)) {
      return apiError(
        "Invalid WhatsApp number — digits only with country code e.g. 923001234567",
        400,
      );
    }

    let imageData: { public_id: string; url: string } | undefined;

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return apiError("Image must be under 5MB", 400);
      }
      if (!imageFile.type.startsWith("image/")) {
        return apiError("Only image files are allowed (JPG, PNG, WebP)", 400);
      }

      const existingUser = await UserModel.findOne().lean();
      if (existingUser?.image?.public_id) {
        await cloudinary.uploader.destroy(existingUser.image.public_id);
        console.log(
          "[Cloudinary] Old image deleted:",
          existingUser.image.public_id,
        );
      }

      const uploadResult = await uploadToCloudinary(
        imageFile,
        "portfolio/profiles",
      );
      imageData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    } else {
      const existingUser = await UserModel.findOne().lean();
      if (!existingUser?.image?.url) {
        return apiError("Profile photo is required", 400);
      }
      imageData = existingUser.image;
    }

    const sanitizedSocials = {
      github: socials.github?.trim() || null,
      linkedin: socials.linkedin?.trim() || null,
      twitter: socials.twitter?.trim() || null,
      instagram: socials.instagram?.trim() || null,
      fiverr: socials.fiverr?.trim() || null,
      upwork: socials.upwork?.trim() || null,
      gmail: socials.gmail?.trim() || null,
    };

    const isNew = !(await UserModel.exists({}));
    const user = await UserModel.findOneAndUpdate(
      {},
      {
        headline: headline.trim(),
        description: description.trim(),
        whatsapp: whatsapp?.trim() || null,
        cvUrl: cvUrl?.trim() || null,
        image: imageData,
        socials: sanitizedSocials,
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    ).lean();

    return apiResponse(
      user,
      201,
      isNew ? "Profile created successfully" : "Profile updated successfully",
    );
  } catch (error: any) {
    console.error("[POST /api/user] Error:", error);

    if (error.name === "ValidationError") {
      return apiError(
        "Validation failed",
        400,
        Object.values(error.errors).map((e: any) => e.message),
      );
    }

    return apiError("Failed to save profile", 500);
  }
}

export async function DELETE() {
  try {
    await dbConnect();

    const user = await UserModel.findOne().lean();

    if (!user) {
      return apiError("No profile to delete", 404);
    }

    if (user.image?.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
      console.log("[Cloudinary] Image deleted:", user.image.public_id);
    }

    await UserModel.deleteOne({});

    return apiResponse(null, 200, "Profile deleted successfully");
  } catch (error: any) {
    console.error("[DELETE /api/user] Error:", error);
    return apiError("Failed to delete profile", 500);
  }
}
