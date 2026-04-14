
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import crypto from "crypto";

type RouteParams = {
  params: {
    id: string; // id de l'abonnement
  };
};

// 🔹 GET (optionnel) : juste pour voir l'abonnement en JSON si tu ouvres l'URL dans le navigateur
export async function GET(req: Request, { params }: RouteParams) {
  const user = await getOrCreateCurrentUser().catch(() => null);

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      plan: true,
      activationCode: true,
    },
  });

  if (!subscription) {
    return NextResponse.json(
      { error: "Abonnement introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json(subscription);
}

// 🔹 POST : utilisé par ton bouton "Renouveler l'abonnement"
export async function POST(req: Request, { params }: RouteParams) {
  const user = await getOrCreateCurrentUser().catch(() => null);

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      plan: true,
      activationCode: true,
    },
  });

  if (!subscription || !subscription.plan) {
    return NextResponse.redirect(
      new URL("/mes-abonnements?error=notfound", req.url)
    );
  }

  const now = new Date();
  const newEndDate = new Date(now);
  newEndDate.setDate(newEndDate.getDate() + subscription.plan.dureeJours);

  const newCode = crypto.randomBytes(6).toString("hex").toUpperCase();

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "ACTIVE",
      startDate: now,
      endDate: newEndDate,
      activationCode: subscription.activationCode
        ? {
            update: {
              code: newCode,
              status: "ASSIGNED",
              assignedAt: now,
            },
          }
        : {
            create: {
              code: newCode,
              status: "ASSIGNED",
              assignedAt: now,
            },
          },
    },
  });

  const redirectUrl = new URL("/mes-abonnements?success=renew", req.url);
  return NextResponse.redirect(redirectUrl);
}

