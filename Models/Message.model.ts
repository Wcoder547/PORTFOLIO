import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  budget?: string;
  currency?: string;
  timeline?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    budget: { type: String, trim: true },
    currency: { type: String, trim: true },
    timeline: { type: String, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

if (mongoose.models.Message) delete mongoose.models.Message;
const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema,
);
export default MessageModel;
