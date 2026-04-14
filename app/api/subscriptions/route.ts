
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

// 🔹 GET /api/subscriptions → retourne les abonnements de l'utilisateur connecté
export async function GET(req: Request) {
  try {
    const user = await getOrCreateCurrentUser();

    const abonnements = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: {
        plan: true,
        activationCode: true,
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(abonnements);
  } catch (err) {
    console.error("Erreur GET /api/subscriptions :", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des abonnements" },
      { status: 500 }
    );
  }
 
}

// Poste une nouvelle subscription
export async function POST(req: Request) {
  try {
    // 1) Utilisateur connecté (Clerk + BD)
    const user = await getOrCreateCurrentUser();

    // 2) Récupérer le planId envoyé par le <form>
    const formData = await req.formData();
    const planId = formData.get("planId");

    if (!planId || typeof planId !== "string") {
      return NextResponse.json(
        { error: "planId manquant dans le formulaire" },
        { status: 400 }
      );
    }

    // 3) Vérifier que le plan existe
    const plan = await prisma.planTarifaire.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan introuvable" },
        { status: 404 }
      );
    }

    // 4) Dates de début et de fin
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plan.dureeJours); // + dureeJours

    // 5) Créer l'abonnement
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "ACTIVE",   // au lieu de "PENDING"
        startDate: now,
        endDate,
      },
    });

    // 6) Générer le code d'activation et le lier à l'abonnement
    const code = Math.random().toString(36).substring(2, 8); // 6 caractères

    await prisma.activationCode.create({
      data: {
        code,
        status: "ASSIGNED",
        assignedAt: now,
        subscriptionId: subscription.id,
      },
    });

    // 7) Redirection vers /mes-abonnements
    return NextResponse.redirect(new URL("/mes-abonnements", req.url));
  }catch (err) {
    console.error("Erreur POST /api/subscriptions :", err);
    return NextResponse.json(
      { error: "Erreur lors de l'achat" },
      { status: 500 }
    );
  }
}

