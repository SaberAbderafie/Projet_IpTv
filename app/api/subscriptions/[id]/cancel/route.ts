// app/api/subscriptions/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function POST(req: Request, context: any) {
  try {
    // ⚠️ Sur Next 16, context.params est UNE PROMISE
    const params = await context.params;
    const id = params?.id as string | undefined;

    if (!id) {
      return NextResponse.json(
        { error: "ID d'abonnement manquant dans l'URL" },
        { status: 400 }
      );
    }

    const user = await getOrCreateCurrentUser();

    // 1) Vérifier que l'abonnement existe et appartient au user
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { activationCode: true },
    });

    if (!sub || sub.userId !== user.id) {
      return NextResponse.json(
        { error: "Abonnement introuvable" },
        { status: 404 }
      );
    }

    // 2) Supprimer le code d'activation lié s'il existe
    if (sub.activationCode) {
      await prisma.activationCode.delete({
        where: { id: sub.activationCode.id },
      });
    }

    // 3) Supprimer l'abonnement
    await prisma.subscription.delete({
      where: { id },
    });

    // 4) Rediriger vers /mes-abonnements
    return NextResponse.redirect(new URL("/mes-abonnements", req.url));
  } catch (err: any) {
    console.error("Erreur POST /api/subscriptions/[id]/cancel :", err);

    if (err?.message === "UNAUTHENTICATED") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
