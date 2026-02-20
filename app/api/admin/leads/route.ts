import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Lead from "@/Models/Lead";

export async function GET() {
  await dbConnect();
  const leads = await Lead.find().sort({ createdAt: -1 });
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const lead = new Lead(body);
  await lead.save();
  return NextResponse.json(lead, { status: 201 });
}
