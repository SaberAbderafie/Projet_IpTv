
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { planSchema } from "@/lib/validation";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function GET() {
  const plans = await prisma.planTarifaire.findMany({
    orderBy: { prix: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateCurrentUser();

    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const parsed = planSchema.parse(body);

    const plan = await prisma.planTarifaire.create({
      data: {
        nomPlan: parsed.nomPlan,
        prix: parsed.prix,
        dureeJours: parsed.dureeJours,
        description: parsed.description,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Invalid data", { status: 400 });
  }
}
