import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.challengeId });
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  return NextResponse.json({ id: params.challengeId, ...body });
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.challengeId });
};
