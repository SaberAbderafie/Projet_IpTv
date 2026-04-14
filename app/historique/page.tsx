

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getOrCreateCurrentUser } from "@/lib/auth";

type PageSearchParams = {
  statut?: string;
  plan?: string;
};

type PageProps = {
  // Next 16 : searchParams est un Promise
  searchParams: Promise<PageSearchParams>;
};

function formatStatus(status: string): { label: string; color: string } {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "ACTIVE":
      return { label: "Actif", color: "text-emerald-300" };
    case "PENDING":
      return { label: "En attente", color: "text-amber-300" };
    case "EXPIRED":
      return { label: "Expiré", color: "text-slate-300" };
    case "CANCELLED":
      return { label: "Annulé", color: "text-rose-300" };
    default:
      return { label: normalized, color: "text-slate-300" };
  }
}

export default async function HistoriquePage({ searchParams }: PageProps) {
  const user = await getOrCreateCurrentUser();
  const params = await searchParams;

  const statutFilter = params.statut ?? "all"; // all | ACTIVE | EXPIRED | CANCELLED | PENDING
  const planFilter = params.plan?.trim() ?? "";

  // 🔍 Filtres Prisma
  // const where: Parameters<typeof prisma.subscription.findMany>[0]["where"] = {
  //   userId: user.id,
  // };
  const where: Prisma.SubscriptionWhereInput = {};

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

  const totalAbonnements = subscriptions.length;
  const nbActifs = subscriptions.filter((s) => s.status === "ACTIVE").length;

  const totalDepense = subscriptions.reduce((sum, sub) => {
    const montant = sub.plan?.prix ? Number(sub.plan.prix) : 0;
    return sum + montant;
  }, 0);

  const derniereDate =
    subscriptions[0]?.startDate &&
    new Date(subscriptions[0].startDate).toLocaleString("fr-CA", {
      dateStyle: "short",
      timeStyle: "short",
    });

  // URL export CSV (si tu fais plus tard /historique/export)
  const paramsExport = new URLSearchParams();
  if (statutFilter) paramsExport.set("statut", statutFilter);
  if (planFilter) paramsExport.set("plan", planFilter);
  const exportUrl = `/historique/export${
    paramsExport.toString() ? `?${paramsExport.toString()}` : ""
  }`;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      {/* HEADER */}
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Historique de mes achats
        </h1>
        <p className="mt-3 text-slate-300 max-w-2xl">
          Retrouvez l&apos;ensemble de vos abonnements IPTV achetés, renouvelés
          ou expirés, avec les montants payés et les dates clés.
        </p>
      </header>

      {/* RÉSUMÉ */}
      <section className="max-w-5xl mx-auto mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Total dépensé</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {totalDepense.toFixed(2)} $
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tous abonnements et renouvellements confondus.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Nombre d&apos;abonnements</p>
          <p className="mt-2 text-2xl font-bold">{totalAbonnements}</p>
          <p className="mt-1 text-xs text-slate-500">
            Dont{" "}
            <span className="font-semibold text-emerald-300">{nbActifs}</span>{" "}
            actif(s).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Dernier achat</p>
          <p className="mt-2 text-sm font-semibold">
            {derniereDate ?? "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Basé sur votre historique le plus récent.
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <section className="max-w-5xl mx-auto mb-6">
        <form
          method="GET"
          className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 md:px-6"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="statut"
              className="text-xs font-medium text-slate-300"
            >
              Filtrer par statut
            </label>
            <select
              id="statut"
              name="statut"
              defaultValue={statutFilter}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="PENDING">En attente</option>
              <option value="EXPIRED">Expiré</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="plan"
              className="text-xs font-medium text-slate-300"
            >
              Rechercher par nom de plan
            </label>
            <input
              id="plan"
              name="plan"
              defaultValue={planFilter}
              placeholder="ex : 1 mois, Premium..."
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-emerald-500"
          >
            Appliquer les filtres
          </button>

          <a
            href={exportUrl}
            className="mt-2 ml-auto inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-emerald-500 hover:text-emerald-300"
          >
            Exporter en CSV
          </a>
        </form>
      </section>

      {/* LISTE */}
      <section className="max-w-5xl mx-auto pb-10">
        {subscriptions.length === 0 ? (
          <p className="text-center text-slate-300">
            Aucun abonnement ne correspond aux filtres sélectionnés.
          </p>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const start =
                sub.startDate &&
                new Date(sub.startDate).toLocaleString("fr-CA", {
                  dateStyle: "short",
                  timeStyle: "short",
                });

              const end =
                sub.endDate &&
                new Date(sub.endDate).toLocaleDateString("fr-CA");

              const montant = sub.plan?.prix?.toString() ?? "—";
              const nomPlan = sub.plan?.nomPlan ?? "Plan inconnu";

              const statutInfo = formatStatus(sub.status);

              return (
                <article
                  key={sub.id}
                  className="border border-slate-800 bg-slate-900/70 rounded-xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-semibold text-emerald-400">
                          {nomPlan}
                        </h2>
                        <span className={`text-xs ${statutInfo.color}`}>
                          {statutInfo.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">Montant payé :</span>{" "}
                        {montant} $
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">
                          Date d&apos;achat / renouvellement :
                        </span>{" "}
                        {start ?? "N/A"}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">
                          Date d&apos;expiration :
                        </span>{" "}
                        {end ?? "N/A"}
                      </p>

                      {sub.activationCode && (
                        <p className="mt-2 text-sm text-slate-300">
                          <span className="font-semibold">
                            Code d&apos;activation :
                          </span>{" "}
                          <span className="font-mono">
                            {sub.activationCode.code}
                          </span>
                        </p>
                      )}

                      <p className="mt-1 text-[11px] text-slate-500">
                        ID abonnement :{" "}
                        <span className="font-mono">{sub.id}</span>
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      <p>
                        Créé le :{" "}
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString("fr-CA")
                          : start ?? ""}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
