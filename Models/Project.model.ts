import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  thumbnail?: { public_id: string; url: string };
  images: { public_id: string; url: string }[];
  techStack: string[];
  category: string;
  status: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  company?: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title max 100 chars"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [300, "Description max 300 chars"],
    },
    longDescription: {
      type: String,
      trim: true,
      maxlength: [2000, "Long description max 2000 chars"],
    },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    techStack: { type: [String], default: [] },
    category: { type: String, default: "fullstack" },
    status: { type: String, default: "completed" },
    featured: { type: Boolean, default: false },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    company: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

if (mongoose.models.Project) delete mongoose.models.Project;

const ProjectModel: Model<IProject> = mongoose.model<IProject>(
  "Project",
  ProjectSchema,
);

export default ProjectModel;
