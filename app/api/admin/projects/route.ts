import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/Models/Project";

export async function GET() {
  await connectDB();
  const projects = await Project.find({});
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId || !userId.publicMetadata.admin)
    return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const data = await req.json();
  const project = new Project(data);
  await project.save();
  return NextResponse.json(project, { status: 201 });
}
