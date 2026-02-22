import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  quote: string;
  author: string;
  title: string;
  location: string;
  avatar?: { public_id?: string; url: string };
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: {
      type: String,
      required: [true, "Quote is required"],
      trim: true,
      minlength: [30, "Quote must be at least 30 chars"],
      maxlength: [600, "Quote max 600 chars"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [80, "Author max 80 chars"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title max 100 chars"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [80, "Location max 80 chars"],
    },
    avatar: {
      public_id: { type: String },
      url: { type: String },
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

if (mongoose.models.Testimonial) delete mongoose.models.Testimonial;

const TestimonialModel: Model<ITestimonial> = mongoose.model<ITestimonial>(
  "Testimonial",
  TestimonialSchema,
);

export default TestimonialModel;
