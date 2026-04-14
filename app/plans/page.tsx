
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type PageProps = {
  // Next 16 : searchParams est un Promise
  searchParams: Promise<{
    sort?: string;
    duree?: string;
  }>;
};

export default async function PlansPage({ searchParams }: PageProps) {
  // 🔹 Récupération des filtres depuis l’URL
  const params = await searchParams;
  const sort = params.sort ?? "price-asc";
  const dureeFilter = params.duree ?? "";

  // 🔹 Construction du "where" pour filtrer par durée
  const where: Prisma.PlanTarifaireWhereInput = {};

  if (dureeFilter === "short") {
    // < 40 jours
    where.dureeJours = { lt: 40 };
  } else if (dureeFilter === "medium") {
    // 40–364 jours
    where.dureeJours = { gte: 40, lt: 365 };
  } else if (dureeFilter === "long") {
    // >= 365 jours
    where.dureeJours = { gte: 365 };
  }

  // 🔹 Construction du "orderBy" pour le tri
  let orderBy: Prisma.PlanTarifaireOrderByWithRelationInput = { prix: "asc" };

  switch (sort) {
    case "price-desc":
      orderBy = { prix: "desc" };
      break;
    case "duration-asc":
      orderBy = { dureeJours: "asc" };
      break;
    case "duration-desc":
      orderBy = { dureeJours: "desc" };
      break;
    case "name-asc":
      orderBy = { nomPlan: "asc" };
      break;
    case "name-desc":
      orderBy = { nomPlan: "desc" };
      break;
    case "price-asc":
    default:
      orderBy = { prix: "asc" };
      break;
  }

  const plans = await prisma.planTarifaire.findMany({
    where,
    orderBy,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Bandeau haut */}
      <section className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Plans IPTV VivaVistaTV
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Choisissez votre abonnement
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Accédez à votre code d&apos;activation IPTV immédiatement après le
            paiement. Aucune surprise : prix clairs, durée définie, renouvellement
            simple.
          </p>
        </div>
      </section>

      {/* Filtres + tri */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <form
          method="GET"
          className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 md:px-6"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="sort" className="text-xs font-medium text-slate-300">
              Trier par
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="price-asc">Prix : du moins cher au plus cher</option>
              <option value="price-desc">Prix : du plus cher au moins cher</option>
              <option value="duration-asc">Durée : la plus courte d&apos;abord</option>
              <option value="duration-desc">
                Durée : la plus longue d&apos;abord
              </option>
              <option value="name-asc">Nom : A → Z</option>
              <option value="name-desc">Nom : Z → A</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="duree" className="text-xs font-medium text-slate-300">
              Filtrer par durée
            </label>
            <select
              id="duree"
              name="duree"
              defaultValue={dureeFilter}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Toutes les durées</option>
              <option value="short">Courte (&lt; 40 jours)</option>
              <option value="medium">Moyenne (40–364 jours)</option>
              <option value="long">Longue (≥ 365 jours)</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-emerald-500"
          >
            Appliquer les filtres
          </button>

          <p className="ml-auto hidden text-xs text-slate-400 md:block">
            {plans.length === 0
              ? "Aucun plan pour ces critères."
              : `${plans.length} plan(s) disponible(s).`}
          </p>
        </form>
      </section>

      {/* Liste des plans */}
      <section className="mx-auto max-w-5xl px-6 pb-14">
        {plans.length === 0 ? (
          <p className="mt-4 text-center text-slate-300">
            Aucun plan ne correspond aux filtres sélectionnés. Essayez un autre
            tri ou une autre durée.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-emerald-500/70 hover:bg-slate-900"
              >
                <header>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-emerald-400">
                      {plan.nomPlan}
                    </h2>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                      {plan.dureeJours} jours
                    </span>
                  </div>

                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {plan.prix.toString()} $
                    </span>
                    <span className="text-xs text-slate-400">
                      paiement unique
                    </span>
                  </p>

                  {plan.description && (
                    <p className="mt-3 text-sm text-slate-300">
                      {plan.description}
                    </p>
                  )}
                </header>

                {/* Petite liste de “features” génériques */}
                <ul className="mt-4 space-y-1 text-xs text-slate-300">
                  <li>• Code d&apos;activation généré automatiquement</li>
                  <li>• Activation immédiate depuis votre espace client</li>
                  <li>• Renouvellement simple en un clic</li>
                </ul>

                {/* Bouton Acheter */}
                <form
                  method="POST"
                  action={`/api/stripe/checkout?planId=${plan.id}`}
                  className="mt-6"
                >
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold shadow-md shadow-emerald-900/40 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Acheter ce plan
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
