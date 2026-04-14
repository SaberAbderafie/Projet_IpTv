
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export default async function ProfilPage() {
  const user = await getOrCreateCurrentUser();

  const [stats, lastSubscription] = await Promise.all([
    prisma.subscription.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { userId: user.id },
    }),
    prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { startDate: "desc" },
      include: { plan: true },
    }),
  ]);

  const totalSubs = stats.reduce((sum, s) => sum + s._count._all, 0);
  const activeCount =
    stats.find((s) => s.status === "ACTIVE")?._count._all ?? 0;

  const createdAtLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleString("fr-CA", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

  const lastSubDate =
    lastSubscription?.startDate &&
    new Date(lastSubscription.startDate).toLocaleString("fr-CA", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <section className="max-w-4xl mx-auto space-y-8">
        {/* HEADER PROFIL */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Mon profil
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl text-sm md:text-base">
              Informations de votre compte VivaVistaTV, rôle, et résumé de vos
              abonnements IPTV.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex flex-col items-start md:items-end gap-1">
            <span>ID utilisateur (DB) :</span>
            <span className="font-mono text-[11px] break-all">
              {user.id}
            </span>
            <span className="mt-1">
              Créé le :{" "}
              <span className="text-slate-200">{createdAtLabel}</span>
            </span>
          </div>
        </header>

        {/* INFO UTILISATEUR */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Informations du compte
            </h2>
            <dl className="space-y-2 text-sm text-slate-200">
              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Email
                </dt>
                <dd>{user.email}</dd>
              </div>

              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Rôle
                </dt>
                <dd>
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-300">
                      Administrateur
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-700/60 px-2 py-0.5 text-xs font-semibold text-slate-200">
                      Utilisateur
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 text-xs uppercase tracking-wide">
                  Clerk ID
                </dt>
                <dd className="font-mono text-[11px] break-all">
                  {user.clerkId}
                </dd>
              </div>
            </dl>

            <div className="mt-4 text-xs text-slate-400">
              Pour modifier votre email, mot de passe ou facteurs de connexion,
              utilisez l&apos;interface Clerk.
            </div>

            <div className="mt-3">
              <Link
                href="/user"
                className="inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-500 hover:text-emerald-300"
              >
                Ouvrir les paramètres de compte (Clerk)
              </Link>
            </div>
          </div>

          {/* RÉSUMÉ ABONNEMENTS */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Résumé de mes abonnements
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-slate-800/80 p-3">
                <p className="text-[11px] text-slate-400">
                  Nombre total d&apos;abonnements
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-50">
                  {totalSubs}
                </p>
              </div>

              <div className="rounded-lg bg-slate-800/80 p-3">
                <p className="text-[11px] text-slate-400">
                  Abonnements actifs
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {activeCount}
                </p>
              </div>
            </div>

            {lastSubscription ? (
              <div className="rounded-lg bg-slate-900/80 p-3 text-xs text-slate-200">
                <p className="font-semibold text-slate-100 mb-1">
                  Dernier abonnement
                </p>
                <p>
                  Plan :{" "}
                  <span className="font-medium text-emerald-300">
                    {lastSubscription.plan?.nomPlan ?? "Plan inconnu"}
                  </span>
                </p>
                <p>
                  Montant :{" "}
                  {lastSubscription.plan?.prix
                    ? `${Number(lastSubscription.plan.prix).toFixed(2)} $`
                    : "—"}
                </p>
                <p>Statut : {lastSubscription.status}</p>
                <p>Effectué le : {lastSubDate ?? "N/A"}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                Vous n&apos;avez pas encore acheté d&apos;abonnement IPTV.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link
                href="/mes-abonnements"
                className="rounded bg-emerald-600 px-3 py-1.5 font-medium hover:bg-emerald-500"
              >
                Voir mes abonnements
              </Link>
              <Link
                href="/historique"
                className="rounded border border-slate-700 px-3 py-1.5 font-medium text-slate-100 hover:border-emerald-500"
              >
                Voir mon historique d&apos;achats
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

