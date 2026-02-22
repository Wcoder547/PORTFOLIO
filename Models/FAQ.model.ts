import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [10, "Question must be at least 10 chars"],
      maxlength: [200, "Question max 200 chars"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      minlength: [20, "Answer must be at least 20 chars"],
      maxlength: [1000, "Answer max 1000 chars"],
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

if (mongoose.models.FAQ) delete mongoose.models.FAQ;

const FAQModel: Model<IFAQ> = mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQModel;
