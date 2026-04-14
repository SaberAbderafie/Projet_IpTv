
// // ===================================================================================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapte le chemin si besoin

// Avec Next 16, params est un Promise dans les app routes dynamiques
type ParamsPromise = Promise<{ id: string }>;

export async function GET(_req: Request, context: { params: ParamsPromise }) {
  try {
    const { id } = await context.params; // ✅ on "await" params

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant dans l'URL" },
        { status: 400 }
      );
    }

    const plan = await prisma.planTarifaire.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erreur GET /api/plans/[id] :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du plan" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: { params: ParamsPromise }) {
  try {
    const { id } = await context.params; // ✅

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant dans l'URL" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { nomPlan, prix, dureeJours, description } = body;

    if (!nomPlan || prix == null || dureeJours == null) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const plan = await prisma.planTarifaire.update({
      where: { id },
      data: {
        nomPlan,
        prix: Number(prix),
        dureeJours: Number(dureeJours),
        description: description ?? null,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erreur PATCH /api/plans/[id] :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour du plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: { params: ParamsPromise }) {
  try {
    const { id } = await context.params; // 

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant dans l'URL" },
        { status: 400 }
      );
    }

    await prisma.planTarifaire.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/plans/[id] :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression du plan" },
      { status: 500 }
    );
  }
}

