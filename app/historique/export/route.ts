// app/historique/export/route.ts
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getOrCreateCurrentUser().catch(() => null);

  if (!user) {
    return new Response("Non authentifié", { status: 401 });
  }

  const url = new URL(req.url);
  const statutFilter = url.searchParams.get("statut") ?? "all";
  const planFilter = (url.searchParams.get("plan") ?? "").trim();

  const where: any = {
    userId: user.id,
  };

  if (statutFilter !== "all") {
    where.status = statutFilter.toUpperCase();
  }

  if (planFilter !== "") {
    where.plan = {
      nomPlan: {
        contains: planFilter,
        mode: "insensitive",
      },
    };
  }

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      plan: true,
      activationCode: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  // Construction du CSV
  let csv = "Plan;Montant;Statut;DateAchat;DateExpiration;CodeActivation;IdAbonnement\n";

  for (const sub of subscriptions) {
    const nomPlan = sub.plan?.nomPlan ?? "Plan inconnu";
    const montant = sub.plan?.prix?.toString() ?? "";
    const statut = sub.status;
    const dateAchat = sub.startDate
      ? new Date(sub.startDate).toISOString()
      : "";
    const dateExpiration = sub.endDate
      ? new Date(sub.endDate).toISOString()
      : "";
    const codeActivation = sub.activationCode?.code ?? "";
    const idAbonnement = sub.id;

    // On échappe les ; au cas où
    const safe = (v: string) => v.replace(/;/g, ",");

    csv += [
      safe(nomPlan),
      safe(montant),
      safe(statut),
      safe(dateAchat),
      safe(dateExpiration),
      safe(codeActivation),
      safe(idAbonnement),
    ].join(";") + "\n";
  }

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="historique_abonnements.csv"',
    },
  });
}
