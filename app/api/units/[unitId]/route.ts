import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { isAdmin } from "@/lib/admin";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export const GET = async (
  req: Request,
  { params }: { params: { unitId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.unitId });
};

export const PUT = async (
  req: Request,
  { params }: { params: { unitId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  return NextResponse.json({ id: params.unitId, ...body });
};

export const DELETE = async (
  req: Request,
  { params }: { params: { unitId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.unitId });
};
