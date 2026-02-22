import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  headline: string;
  description: string;
  whatsapp?: string;
  cvUrl: string;
  image: {
    public_id: string;
    url: string;
  };
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    fiverr?: string;
    upwork?: string;
    gmail?: string;
  };
}

const UserSchema = new Schema<IUser>(
  {
    headline: {
      type: String,
      required: [true, "Headline is required"],
      trim: true,
      maxlength: [100, "Headline can't exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description can't exceed 500 characters"],
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    cvUrl: {
      type: String,
      required: [true, "CV URL is required"],
      trim: true,
    },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    socials: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      fiverr: { type: String, trim: true },
      upwork: { type: String, trim: true },
      gmail: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
