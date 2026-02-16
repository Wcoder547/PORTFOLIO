import { Schema, model, models, Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  headline: string; // "I build AI‑powered..."
  roleBadge: string; // "Full‑Stack Developer & AI Engineer"
  heroHighlight: string; // "AI-powered"
  heroTitle: string; // "full‑stack web applications."
  heroSubtext: string; // paragraph under title
  stats: {
    projectsDelivered: number;
    yearsExperience: number;
    aiProductsLaunched: number;
  };
  location: string;
  openForRemote: boolean;
  currentRole: string; // "Full‑Stack Dev & AI Engineer"
  avatarInitials: string; // "WA" for the square card
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    headline: { type: String, required: true },
    roleBadge: { type: String, required: true },
    heroHighlight: { type: String, required: true },
    heroTitle: { type: String, required: true },
    heroSubtext: { type: String, required: true },
    stats: {
      projectsDelivered: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
      aiProductsLaunched: { type: Number, default: 0 },
    },
    location: { type: String, required: true },
    openForRemote: { type: Boolean, default: true },
    currentRole: { type: String, required: true },
    avatarInitials: { type: String, default: "WA" },
  },
  { timestamps: true },
);

export const Profile =
  models.Profile || model<IProfile>("Profile", ProfileSchema);
