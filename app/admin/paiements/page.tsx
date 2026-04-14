
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export default async function AdminPaiementsPage() {
  const user = await getOrCreateCurrentUser();

  if (user.role !== "ADMIN") {
    // Par sécurité (le layout admin bloque déjà normalement)
    return (
      <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-slate-300">
            Cette page est réservée aux administrateurs.
          </p>
        </div>
      </main>
    );
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      stripePaymentIntentId: {
        not: null,
      },
    },
    include: {
      user: true,
      plan: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  const totalPaiements = subscriptions.length;
  const totalRevenue = subscriptions.reduce((sum, sub) => {
    const montant = sub.plan?.prix ? Number(sub.plan.prix) : 0;
    return sum + montant;
  }, 0);

  const dernierPaiementDate =
    subscriptions[0]?.startDate &&
    new Date(subscriptions[0].startDate).toLocaleString("fr-CA", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold mb-4 text-white py-4  text-5xl  border-8 border-t-orange-400 border-r-orange-400 text-center rounded-2xl">
            Paiements Stripe
          </h1>
          <p className="mt-2 text-slate-300 max-w-xl">
            Vue d&apos;ensemble des paiements réalisés via Stripe sur VivaVistaTV,
            reliés aux abonnements et utilisateurs.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 text-xs text-slate-400">
          <span>Connecté en tant qu&apos;administrateur</span>
          <Link
            href="/admin/plans"
            className="mt-1 inline-flex items-center rounded-md border border-slate-700 px-3 py-1 text-xs font-medium hover:border-orange-300 transition"
          >
            Gestion des Plans IPTV
          </Link>
        </div>
      </header>

      {/* RÉSUMÉ */}
      <section className="max-w-6xl mx-auto mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Revenu total (Stripe)</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {totalRevenue.toFixed(2)} $
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Basé sur les montants des plans associés aux paiements Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Nombre de paiements</p>
          <p className="mt-2 text-2xl font-bold">{totalPaiements}</p>
          <p className="mt-1 text-xs text-slate-500">
            Un paiement = un abonnement créé via Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">Dernier paiement</p>
          <p className="mt-2 text-sm font-semibold">
            {dernierPaiementDate ?? "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            D&apos;après la date de création d&apos;abonnement la plus récente.
          </p>
        </div>
      </section>

      {/* TABLEAU PAIEMENTS */}
      <section className="max-w-6xl mx-auto">
        {subscriptions.length === 0 ? (
          <p className="text-center text-slate-300">
            Aucun paiement Stripe trouvé pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
            <table className="min-w-full text-left text-xs text-slate-200">
              <thead className="border-b border-slate-800 bg-slate-900/90">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Status abonnement</th>
                  <th className="px-4 py-3">Stripe PaymentIntent</th>
                  <th className="px-4 py-3">Stripe Session</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => {
                  const date =
                    sub.startDate &&
                    new Date(sub.startDate).toLocaleString("fr-CA", {
                      dateStyle: "short",
                      timeStyle: "short",
                    });

                  const amount = sub.plan?.prix
                    ? `${Number(sub.plan.prix).toFixed(2)} $`
                    : "—";

                  const email = sub.user?.email ?? "—";

                  const piId = sub.stripePaymentIntentId;
                  const sessionId = sub.stripeSessionId;

                  const stripeBase = "https://dashboard.stripe.com";
                  const mode = "test"; // adapte à "live" plus tard

                  const piUrl =
                    piId != null
                      ? `${stripeBase}/${mode}/payments/${piId}`
                      : null;
                  const sessionUrl =
                    sessionId != null
                      ? `${stripeBase}/${mode}/checkouts/sessions/${sessionId}`
                      : null;

                  return (
                    <tr
                      key={sub.id}
                      className="border-t border-slate-800/80 hover:bg-slate-900"
                    >
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        {date}
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-100">
                            {email}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            userId: {sub.userId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {sub.plan?.nomPlan ?? "Plan inconnu"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            planId: {sub.planId}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        {amount}
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span className="text-[11px] text-slate-200">
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        {piId ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] break-all">
                              {piId}
                            </span>
                            {piUrl && (
                              <a
                                href={piUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                              >
                                Ouvrir dans Stripe
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {sessionId ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] break-all">
                              {sessionId}
                            </span>
                            {sessionUrl && (
                              <a
                                href={sessionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                              >
                                Ouvrir la session
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
