
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Utilitaire : lire le code d'activation depuis l'URL ou le body.
 */
async function extractCode(req: NextRequest): Promise<string | null> {
  // 1) ?code=XXXX dans l'URL
  const { searchParams } = new URL(req.url);
  let code = searchParams.get("code");

  // 2) Si pas trouvé et qu'on est en POST → lire le body
  if (!code && req.method === "POST") {
    const contentType = req.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        const body = await req.json();
        if (typeof body.code === "string") {
          code = body.code.trim();
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        const rawCode = formData.get("code");
        if (typeof rawCode === "string") {
          code = rawCode.trim();
        }
      }
    } catch (err) {
      console.error("Erreur lecture body /api/activation :", err);
    }
  }

  if (!code) {
    return null;
  }
  return code.trim();
}

/**
 * GET /api/activation?code=XXXX
 * → Sert juste à VÉRIFIER un code (utilisé par la page /activer pour afficher les infos).
 */
export async function GET(req: NextRequest) {
  const code = await extractCode(req);

  if (!code) {
    return NextResponse.json(
      {
        error: "MISSING_CODE",
        message:
          "Code d'activation manquant. Utilise ?code=XXXX ou envoie un body avec 'code'.",
      },
      { status: 400 },
    );
  }

  try {
    const activation = await prisma.activationCode.findUnique({
      where: { code },
      include: {
        subscription: {
          include: {
            plan: true,
            user: true,
          },
        },
      },
    });

    if (!activation || !activation.subscription) {
      return NextResponse.json(
        {
          error: "INVALID_CODE",
          message: "Code invalide ou non associé à un abonnement.",
        },
        { status: 404 },
      );
    }

    const sub = activation.subscription;

    const now = new Date();
    const isExpired =
      sub.endDate && new Date(sub.endDate).getTime() < now.getTime();

    const alreadyUsed =
      activation.status !== "AVAILABLE" ||
      sub.status === "ACTIVE" ||
      isExpired;

    return NextResponse.json(
      {
        code: activation.code,
        activationStatus: activation.status, // AVAILABLE / ASSIGNED...
        alreadyUsed,
        abonnement: {
          id: sub.id,
          statut: sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
          plan: sub.plan
            ? {
                id: sub.plan.id,
                nom: sub.plan.nomPlan,
                dureeJours: sub.plan.dureeJours,
                prix: sub.plan.prix,
              }
            : null,
          user: sub.user
            ? {
                id: sub.user.id,
                email: sub.user.email,
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Erreur GET /api/activation :", err);
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: "Erreur serveur lors de la vérification du code.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/activation
 * → Sert à UTILISER le code : activer l'abonnement + marquer le code comme ASSIGNED,
 * puis rediriger vers /activer.
 *
 * - Formulaire classique : <form method="POST" action="/api/activation">
 * - ou appel JSON { "code": "XXXX" }
 */
export async function POST(req: NextRequest) {
  const code = await extractCode(req);

  // Si aucun code → on renvoie vers /activer avec erreur
  if (!code) {
    const url = new URL("/activer?error=missing-code", req.url);
    return NextResponse.redirect(url, { status: 303 });
  }

  try {
    const activation = await prisma.activationCode.findUnique({
      where: { code },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!activation || !activation.subscription) {
      const url = new URL(
        `/activer?code=${encodeURIComponent(code)}&error=invalid-code`,
        req.url,
      );
      return NextResponse.redirect(url, { status: 303 });
    }

    const sub = activation.subscription;
    const now = new Date();

    // Code déjà utilisé ou abonnement déjà actif / expiré
    const isExpired =
      sub.endDate && new Date(sub.endDate).getTime() < now.getTime();

    if (
      activation.status !== "AVAILABLE" ||
      sub.status === "ACTIVE" ||
      isExpired
    ) {
      const url = new URL(
        `/activer?code=${encodeURIComponent(
          code,
        )}&error=already-used`,
        req.url,
      );
      return NextResponse.redirect(url, { status: 303 });
    }

    // Calcul de la date de fin à partir de la durée du plan
    const dureeJours = sub.plan?.dureeJours ?? 30;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + dureeJours);

    // 1) On passe l'abonnement en ACTIVE + on met les dates
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "ACTIVE",
        startDate: now,
        endDate,
      },
    });

    // 2) On marque le code comme ASSIGNED
    await prisma.activationCode.update({
      where: { id: activation.id },
      data: {
        status: "ASSIGNED",
        assignedAt: now,
      },
    });

    // 3) Redirection vers /activer avec le code et success=1
    const successUrl = new URL(
      `/activer?code=${encodeURIComponent(code)}&success=1`,
      req.url,
    );

    return NextResponse.redirect(successUrl, { status: 303 });
  } catch (err) {
    console.error("Erreur POST /api/activation :", err);
    const url = new URL(
      `/activer?code=${encodeURIComponent(
        code,
      )}&error=server-error`,
      req.url,
    );
    return NextResponse.redirect(url, { status: 303 });
  }
}

