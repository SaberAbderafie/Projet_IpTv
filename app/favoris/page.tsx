// app/favoris/page.tsx
export default function FavorisPage() {
  // plus tard tu pourras brancher ça sur de vraies données utilisateur
  const hasFavorites = false;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Bandeau */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900 to-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
              Favoris
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Vos chaînes & programmes préférés
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Retrouvez rapidement les chaînes, films, séries et matchs que
              vous avez marqués en favori.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Astuce
            </p>
            <p className="mt-1 text-slate-300">
              Depuis le guide ou le direct, cliquez sur{" "}
              <span className="font-semibold text-orange-400">“Ajouter aux favoris”</span>{" "}
              pour les voir ici.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="mx-auto max-w-6xl px-4 py-10 pb-16">
        {hasFavorites ? (
          // Placeholder si un jour tu connectes avec la DB
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-200">
            <p>Liste de favoris (à connecter plus tard à la base de données).</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
              ★
            </div>
            <h2 className="text-xl font-semibold">Vous n&apos;avez pas encore de favoris</h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              Parcourez le{" "}
              <a href="/guide" className="text-orange-400 hover:underline">
                guide TV
              </a>{" "}
              ou la page{" "}
              <a href="/en-direct" className="text-orange-400 hover:underline">
                en direct
              </a>{" "}
              et ajoutez des chaînes ou programmes en favoris pour les retrouver ici.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
              <a
                href="/en-direct"
                className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400"
              >
                Voir les programmes en direct
              </a>
              <a
                href="/guide"
                className="rounded-full border border-slate-600 px-4 py-2 font-semibold text-slate-100 hover:bg-slate-800"
              >
                Ouvrir le guide TV
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
