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

  const data = await convex.query(api.admin.getAdminUnits);
  const response = NextResponse.json(data);
  response.headers.set("Content-Range", `units 0-${data.length}/${data.length}`);
  response.headers.set("Access-Control-Expose-Headers", "Content-Range");

  return response;
};
