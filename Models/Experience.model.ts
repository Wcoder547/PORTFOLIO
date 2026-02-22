import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience extends Document {
  company: string;
  role: string;
  duration: string;
  description: string;
  techStack: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
      maxlength: [100, "Company max 100 chars"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role max 100 chars"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
      maxlength: [50, "Duration max 50 chars"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description max 500 chars"],
    },
    techStack: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

if (mongoose.models.Experience) {
  delete mongoose.models.Experience;
}

const ExperienceModel: Model<IExperience> = mongoose.model<IExperience>(
  "Experience",
  ExperienceSchema,
);

export default ExperienceModel;
