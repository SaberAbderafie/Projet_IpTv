// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getOrCreateCurrentUser } from "@/lib/auth";


export async function GET() {
  try {
    const user = await getOrCreateCurrentUser();
    
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return new NextResponse("Non autorisé", { status: 401 });
  }
}
