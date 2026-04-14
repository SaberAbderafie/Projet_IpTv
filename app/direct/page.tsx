// app/direct/page.tsx
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

// On réutilise les mêmes programmes que /guide
const programs: Program[] = [
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
];

export default function DirectPage() {
  const livePrograms = programs.filter((p) => p.live);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Bandeau titre */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-red-900/40 via-slate-950 to-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            En direct maintenant
          </h1>
          <p className="mt-2 text-sm text-slate-300 md:text-base">
            Retrouve tous les programmes actuellement{" "}
            <span className="font-semibold text-red-400">en live</span> sur
            VivaVistaTV.
          </p>
        </div>
      </section>

      {/* Liste des programmes en direct */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        {livePrograms.length === 0 ? (
          <p className="text-slate-300">
            Aucun programme en direct pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {livePrograms.map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-black/40 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="mb-1 flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 font-semibold uppercase tracking-wide text-red-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      En direct
                    </span>
                    <span className="font-semibold text-slate-200">
                      {p.channel}
                    </span>
                    <span>
                      {p.time} • {p.duration}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-50">
                    {p.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Catégorie :{" "}
                    <span className="font-medium text-orange-400">
                      {p.category}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/guide/${p.id}`}
                    className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-400"
                  >
                    Voir les détails
                  </Link>

                  <button className="rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:border-orange-500 hover:text-orange-400">
                   <Link href="./plans"> Regarder maintenant </Link>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 text-sm">
          <Link
            href="/guide"
            className="inline-flex items-center text-slate-300 hover:text-orange-400"
          >
            <span className="mr-2 text-lg">←</span>
            Retour au guide TV complet
          </Link>
        </div>
      </section>
    </main>
  );
}
