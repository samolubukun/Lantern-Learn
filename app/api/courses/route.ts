import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { isAdmin } from "@/lib/admin";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await convex.query(api.admin.getAdminCourses);
  const response = NextResponse.json(data);
  response.headers.set("Content-Range", `courses 0-${data.length}/${data.length}`);
  response.headers.set("Access-Control-Expose-Headers", "Content-Range");

  return response;
};

export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = await convex.mutation(api.admin.createAdminCourse, body);

  return NextResponse.json(data);
};
