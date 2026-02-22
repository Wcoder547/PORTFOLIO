import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: { public_id: string; url: string };
  tags: string[];
  category: string;
  status: "draft" | "published";
  featured: boolean;
  readTime: number; // in minutes
  views: number;
  publishedAt?: Date;
  isVisible: boolean;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    thumbnail: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true, default: "general" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ArticleSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

export default mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);
