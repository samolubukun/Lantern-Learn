import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { isAdmin } from "@/lib/admin";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export const GET = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await convex.query(api.admin.getAdminCourseById, {
    id: params.courseId as Id<"courses">,
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  const data = await convex.mutation(api.admin.updateAdminCourse, {
    id: params.courseId as Id<"courses">,
    ...body,
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await convex.mutation(api.admin.deleteAdminCourse, {
    id: params.courseId as Id<"courses">,
  });

  return NextResponse.json(data);
};
