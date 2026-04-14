// app/guide/[id]/page.tsx
import { notFound } from "next/navigation";
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

// ⚠️ Avec Next 15/16, params est un Promise → on tape comme ça :
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProgrammeDetailsPage({ params }: PageProps) {
  const { id } = await params; // on "await" le Promise
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return notFound();
  }

  const program = programs.find((p) => p.id === numericId);

  if (!program) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Bandeau haut détaillé */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              {program.channel}
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              {program.title}
            </h1>

            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Catégorie :{" "}
              <span className="font-semibold text-orange-400">
                {program.category}
              </span>
              <br />
              Heure de diffusion :{" "}
              <span className="font-semibold">{program.time}</span> • Durée :{" "}
              <span className="font-semibold">{program.duration}</span>
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              {program.live ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  En direct maintenant
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Programme à venir
                </span>
              )}

              <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-400">
                <Link href="/plans">
                Regarder sur VivaVistaTV
                </Link> 
              </button>

              <button className="rounded-full border border-slate-600 px-5 py-2 text-sm font-medium text-slate-100 hover:border-orange-500 hover:text-orange-400">
                Ajouter aux favoris
              </button>
            </div>

            <p className="mt-5 text-sm text-slate-300 md:text-base">
              Description fictive pour le laboratoire : ce programme illustre
              comment une page de détail peut afficher des informations
              enrichies sur un contenu TV (chaîne, horaire, durée, statut
              &quot;live&quot;, actions possibles, etc.). Dans un vrai projet,
              ces données viendraient d&apos;une API externe ou de ta base de
              données Prisma.
            </p>
          </div>

          {/* Carte récap à droite */}
          <div className="w-full max-w-sm rounded-2xl bg-slate-900/80 p-5 shadow-xl shadow-black/60">
            <h2 className="text-sm font-semibold text-slate-200">
              Informations programme
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chaîne</span>
                <span className="font-semibold text-slate-100">
                  {program.channel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Catégorie</span>
                <span className="font-semibold text-slate-100">
                  {program.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Heure</span>
                <span className="font-semibold text-slate-100">
                  {program.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Durée</span>
                <span className="font-semibold text-slate-100">
                  {program.duration}
                </span>
              </div>
              <div className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
                Ces informations sont statiques pour le laboratoire VivaVistaTV
                et servent à démontrer une page détail cohérente avec le guide
                TV.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bouton retour */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <Link
          href="/guide"
          className="inline-flex items-center text-sm text-slate-300 hover:text-orange-400"
        >
          <span className="mr-2 text-lg">←</span>
          Retour au guide TV
        </Link>
      </section>
    </main>
  );
}
