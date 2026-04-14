import React from "react";
import Link from "next/link";

type Program = {
  id: number;
  channel: string;
  title: string;
  category: string;
  time: string;
  duration: string;
  live?: boolean;
};

const programsByCategory: { category: string; items: Program[] }[] = [
  {
    category: "Sports",
    items: [
      {
        id: 1,
        channel: "VivaSport 1",
        title: "Match Ligue des Champions",
        category: "Football",
        time: "20:45",
        duration: "120 min",
        live: true,
      },
      {
        id: 2,
        channel: "VivaSport 2",
        title: "NBA Highlights",
        category: "Basketball",
        time: "23:00",
        duration: "60 min",
      },
    ],
  },
  {
    category: "Films & Séries",
    items: [
      {
        id: 3,
        channel: "Cinema+",
        title: "Inception",
        category: "Film",
        time: "21:00",
        duration: "150 min",
      },
      {
        id: 4,
        channel: "Series HD",
        title: "CasaMode – Saison 1",
        category: "Série",
        time: "22:30",
        duration: "45 min",
      },
    ],
  },
  {
    category: "Documentaires",
    items: [
      {
        id: 5,
        channel: "Discovery+",
        title: "Planète Terre",
        category: "Nature",
        time: "19:30",
        duration: "52 min",
      },
      {
        id: 6,
        channel: "History Max",
        title: "Les secrets des pyramides",
        category: "Histoire",
        time: "21:15",
        duration: "90 min",
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Bandeau haut style maquette */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-orange-400">
              Guide TV
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Consultez le guide TV{" "}
              <span className="text-orange-400">en temps réel</span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Retrouvez les programmes en cours et à venir sur vos chaînes
              préférées : films, séries, sports et documentaires, tout en un
              seul endroit.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="rounded-xl bg-slate-900/70 px-4 py-3">
                <div className="text-xs uppercase text-slate-400">Chaînes</div>
                <div className="text-lg font-semibold">500+</div>
              </div>
              <div className="rounded-xl bg-slate-900/70 px-4 py-3">
                <div className="text-xs uppercase text-slate-400">
                  Programmes aujourd&apos;hui
                </div>
                <div className="text-lg font-semibold">1200+</div>
              </div>
              <div className="rounded-xl bg-slate-900/70 px-4 py-3">
                <div className="text-xs uppercase text-slate-400">Langues</div>
                <div className="text-lg font-semibold">10+</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/en-direct"
                className="rounded-full bg-orange-500 px-5 py-2 font-medium text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-400"
              >
                Voir ce qui est en direct
              </Link>
              <Link
                href="/plans"
                className="rounded-full border border-slate-600 px-5 py-2 font-medium text-slate-100 hover:border-orange-500 hover:text-orange-400"
              >
                S&apos;abonner
              </Link>
            </div>
          </div>

          {/* Petit bloc résumé horaire */}
          <div className="w-full max-w-sm rounded-2xl bg-slate-900/80 p-5 shadow-xl shadow-black/60">
            <h2 className="text-sm font-semibold text-slate-200">
              Prochains programmes
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Sélection automatique des meilleurs contenus de la soirée.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2">
                <div>
                  <div className="font-medium">Match Ligue des Champions</div>
                  <div className="text-xs text-slate-400">
                    VivaSport 1 • 20:45
                  </div>
                </div>
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                  Live
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2">
                <div>
                  <div className="font-medium">Inception</div>
                  <div className="text-xs text-slate-400">Cinema+ • 21:00</div>
                </div>
                <span className="text-xs text-slate-400">Film</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3 py-2">
                <div>
                  <div className="font-medium">Planète Terre</div>
                  <div className="text-xs text-slate-400">
                    Discovery+ • 19:30
                  </div>
                </div>
                <span className="text-xs text-slate-400">Docu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des programmes par catégorie */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Programmes de la soirée</h2>
          <span className="text-xs text-slate-400">
            Données fictives pour le labo – intégration possible avec une vraie
            API plus tard.
          </span>
        </div>

        <div className="space-y-8">
          {programsByCategory.map((block) => (
            <div key={block.category}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {block.category}
              </h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {block.items.map((p) => (
                  //   <article
                  //     key={p.id}
                  //     className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/40"
                  //   >
                  //     <div>
                  //       <div className="flex items-center justify-between text-xs text-slate-400">
                  //         <span className="font-semibold text-slate-200">
                  //           {p.channel}
                  //         </span>
                  //         <span>
                  //           {p.time} • {p.duration}
                  //         </span>
                  //       </div>
                  //       <h4 className="mt-2 text-sm font-semibold text-slate-50">
                  //         {p.title}
                  //       </h4>
                  //       <p className="mt-1 text-xs text-slate-400">
                  //         {p.category}
                  //       </p>
                  //     </div>

                  //     <div className="mt-3 flex items-center justify-between text-xs">
                  //       {p.live ? (
                  //         <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 font-semibold text-red-400">
                  //           <span className="h-2 w-2 rounded-full bg-red-500" />
                  //           En direct
                  //         </span>
                  //       ) : (
                  //         <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                  //           À venir
                  //         </span>
                  //       )}

                  //       <button className="rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-100 hover:border-orange-500 hover:text-orange-400">
                  //         Ajouter aux favoris
                  //       </button>
                  //     </div>
                  //   </article>
                  <article
                    key={p.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/40"
                  >
                    <Link href={`/guide/${p.id}`}>
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">
                            {p.channel}
                          </span>
                          <span>
                            {p.time} • {p.duration}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-slate-50">
                          {p.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                          {p.category}
                        </p>
                      </div>
                    </Link>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      {p.live ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 font-semibold text-red-400">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          En direct
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                          À venir
                        </span>
                      )}

                      <button className="rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-100 hover:border-orange-500 hover:text-orange-400">
                        Ajouter aux favoris
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
