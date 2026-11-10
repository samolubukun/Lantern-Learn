import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.challengeOptionId });
};

export const PUT = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();
  return NextResponse.json({ id: params.challengeOptionId, ...body });
};

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.json({ id: params.challengeOptionId });
};
