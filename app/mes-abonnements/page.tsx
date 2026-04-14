
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

type PageSearchParams = {
  success?: string;
  error?: string;
};

type PageProps = {
  // Next 16 : searchParams est un Promise
  searchParams: Promise<PageSearchParams>;
};

function formatStatus(status: string): {
  label: string;
  bg: string;
  text: string;
} {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "ACTIVE":
      return {
        label: "Actif",
        bg: "bg-emerald-900/40",
        text: "text-emerald-300",
      };
    case "PENDING":
      return {
        label: "En attente",
        bg: "bg-amber-900/40",
        text: "text-amber-300",
      };
    case "CANCELLED":
      return { label: "Annulé", bg: "bg-rose-900/40", text: "text-rose-300" };
    case "EXPIRED":
      return { label: "Expiré", bg: "bg-slate-800", text: "text-slate-300" };
    default:
      return { label: normalized, bg: "bg-slate-800", text: "text-slate-200" };
  }
}

function getRemainingDays(endDate: Date | null): number | null {
  if (!endDate) return null;
  const diffMs = endDate.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 0 : diffDays;
}

export default async function MesAbonnements({ searchParams }: PageProps) {
  const user = await getOrCreateCurrentUser();
  const params = await searchParams;

  const success =
    typeof params.success === "string" && params.success.length > 0
      ? params.success
      : undefined;

  const error =
    typeof params.error === "string" && params.error.length > 0
      ? params.error
      : undefined;

  const abonnements = await prisma.subscription.findMany({
    where: { userId: user.id },
    include: {
      plan: true,
      activationCode: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Mes abonnements
        </h1>
        <p className="mt-3 text-slate-300">
          Visualisez vos plans IPTV actifs, vos codes d&apos;activation et les
          dates d&apos;expiration. Vous pouvez aussi gérer le renouvellement et
          l&apos;annulation.
        </p>
      </header>

      {/* Messages de succès / erreur */}
      <section className="max-w-5xl mx-auto space-y-3 mb-6">
        {success && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-900/40 px-4 py-3 flex items-start gap-3 text-sm">
            <span className="mt-0.5 text-lg">✅</span>
            <div>
              <p className="font-semibold text-emerald-300">
                Paiement / action réussie
              </p>
              <p className="text-emerald-100">
                {success === "stripe"
                  ? "Votre paiement Stripe a bien été confirmé et l’abonnement a été créé."
                  : success === "renew"
                  ? "Votre abonnement a été renouvelé avec succès."
                  : success === "cancel"
                  ? "Votre abonnement a été annulé."
                  : "Opération effectuée avec succès."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 flex items-start gap-3 text-sm">
            <span className="mt-0.5 text-lg">⚠️</span>
            <div>
              <p className="font-semibold text-rose-300">
                Une erreur est survenue
              </p>
              <p className="text-rose-100">
                {error === "no-session"
                  ? "Session Stripe introuvable. Réessayez de lancer le paiement."
                  : error}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Contenu principal */}
      <section className="max-w-5xl mx-auto">
        {abonnements.length === 0 ? (
          <div className="border border-dashed border-slate-700 bg-slate-900/40 rounded-xl px-6 py-10 text-center">
            <p className="text-lg font-semibold mb-2">
              Vous n&apos;avez aucun abonnement pour le moment.
            </p>
            <p className="text-slate-300 mb-6">
              Découvrez nos plans IPTV et choisissez la formule qui vous
              convient.
            </p>
            <Link
              href="/plans"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition-colors"
            >
              Voir les plans IPTV
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {abonnements.map((sub) => {
              const statusInfo = formatStatus(sub.status);
              const planName = sub.plan?.nomPlan ?? "Plan inconnu";
              const price = sub.plan?.prix?.toString() ?? "—";
              const duration = sub.plan?.dureeJours ?? 0;

              const endDateLabel = sub.endDate
                ? new Date(sub.endDate).toLocaleDateString("fr-CA")
                : "N/A";

              const startDateLabel = sub.startDate
                ? new Date(sub.startDate).toLocaleDateString("fr-CA")
                : "N/A";

              const remainingDays = getRemainingDays(sub.endDate ?? null);

              return (
                <article
                  key={sub.id}
                  className="border border-slate-800 bg-slate-900/70 rounded-xl p-6 shadow-sm shadow-slate-900/40"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Infos principales */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-emerald-400">
                          {planName}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">Prix :</span> {price} $
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">Durée :</span>{" "}
                        {duration} jours
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">
                          Date d&apos;achat :
                        </span>{" "}
                        {startDateLabel}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">Expire le :</span>{" "}
                        {endDateLabel}
                        {remainingDays !== null && (
                          <span className="ml-2 text-xs text-slate-400">
                            ({remainingDays} jour
                            {remainingDays > 1 ? "s" : ""} restant
                            {remainingDays > 1 ? "s" : ""})
                          </span>
                        )}
                      </p>

                      {sub.activationCode && (
                        <p className="mt-2 text-sm text-slate-300">
                          <span className="font-semibold">
                            Code d&apos;activation :
                          </span>{" "}
                          <span className="font-mono tracking-wider">
                            {sub.activationCode.code}
                          </span>
                        </p>
                      )}

                      <p className="mt-1 text-[11px] text-slate-500">
                        ID abonnement :{" "}
                        <span className="font-mono">{sub.id}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-stretch gap-2 min-w-[200px]">
                      <form
                        method="POST"
                        action={`/api/subscriptions/${sub.id}/renew`}
                      >
                        <button
                          type="submit"
                          className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
                        >
                          Renouveler l&apos;abonnement
                        </button>
                      </form>

                      <form
                        method="POST"
                        action={`/api/subscriptions/${sub.id}/cancel`}
                      >
                        <button
                          type="submit"
                          className="w-full px-4 py-2 rounded-md bg-rose-700 hover:bg-rose-600 text-sm font-medium transition-colors"
                        >
                          Annuler l&apos;abonnement
                        </button>
                      </form>
                       <button className="w-full px-4 py-2 rounded-md bg-green-700 hover:bg-green-500 text-sm font-medium transition-colors">
                        <Link
                          href="/activer"
                          className="mt-1 text-xs text-center text-white hover:text-slate-200 transition-colors"
                        >
                          Activer votre code sur un appareil
                        </Link>
                      </button>
                      {/* Historique
                       */}
                       <button className="w-full px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-sm font-medium transition-colors">
                        <Link
                          href="/historique"
                          className="mt-1 text-xs text-center text-white hover:text-slate-200 transition-colors"
                        >
                          Voir l&apos;historique des achats
                        </Link>
                      </button>
                       {/* Plans */}
                      <Link
                        href="/plans"
                        className="mt-1 text-xs text-center text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Voir d&apos;autres plans
                      </Link>
                     
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
