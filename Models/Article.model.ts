import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: { public_id: string; url: string };
  featured: boolean;
  published: boolean;
  readTime: string;
  author: {
    name: string;
    bio: string;
    avatar: string;
  };
  tableOfContents: { id: string; title: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    readTime: { type: String, default: "5 min read" },
    author: {
      name: { type: String, required: true },
      bio: { type: String, default: "" },
      avatar: { type: String, default: "" },
    },
    tableOfContents: [{ id: String, title: String }],
  },
  { timestamps: true },
);

ArticleSchema.pre("validate", async function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
});

const ArticleModel: Model<IArticle> =
  (mongoose.models.Article as Model<IArticle>) ||
  mongoose.model<IArticle>("Article", ArticleSchema);

export default ArticleModel;
