// // app/en-direct/page.tsx

import Link from "next/link";

// export default function EnDirectPage() {
//   const categories = [
//     {
//       title: "Sports",
//       description: "Matchs en direct, ligues européennes, combats, etc.",
//       tag: "EN DIRECT",
//     },
//     {
//       title: "Films & Séries",
//       description: "Blockbusters, séries originales et classiques cultes.",
//       tag: "PREMIUM",
//     },
//     {
//       title: "Infos & Actualités",
//       description: "Chaînes d’info 24/7 partout dans le monde.",
//       tag: "NEWS",
//     },
//     {
//       title: "Divertissement",
//       description: "Talk-shows, téléréalité, musique et gaming.",
//       tag: "FUN",
//     },
//   ];

//   const channels = [
//     { name: "VivaSport 1", type: "Sport", quality: "4K" },
//     { name: "VivaCinema", type: "Films", quality: "Full HD" },
//     { name: "VivaNews", type: "Infos", quality: "HD" },
//     { name: "VivaFamily", type: "Famille", quality: "HD" },
//     { name: "VivaSeries+", type: "Séries", quality: "4K" },
//     { name: "VivaKids", type: "Enfants", quality: "HD" },
//   ];

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
//       {/* Bandeau titre */}
//       <section className="border-b border-slate-800 bg-slate-950/80">
//         <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 md:flex-row md:items-center md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">
//               En Direct
//             </p>
//             <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
//               Regarder la TV en direct
//             </h1>
//             <p className="mt-3 max-w-xl text-sm text-slate-300">
//               Zappe entre les chaînes en un clic. Sports, films, infos,
//               divertissement — tout en streaming instantané.
//             </p>
//           </div>

//           <div className="mt-3 flex gap-3 md:mt-0">
//               {/* =================================== etoile =========== */}
//             <a
//               href="./"
//               className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition"
//             >
//               ⟵ Retour à l&apos;accueil
//             </a>
//               {/* =================================== etoile =========== */}
//             <a
//               href="./plans"
//               className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/40 hover:bg-orange-400 transition"
//             >
//               S&apos;abonner
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Catégories */}
//       <section className="mx-auto max-w-6xl px-4 py-8">
//         <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
//           Catégories populaires
//         </h2>
//         <div className="mt-4 grid gap-4 md:grid-cols-4">
//           {categories.map((cat) => (
//             <div
//               key={cat.title}
//               className="flex flex-col justify-between rounded-2xl bg-slate-900/80 p-4 shadow-lg shadow-slate-950/70"
//             >
//               <div>
//                 <div className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
//                   {cat.tag}
//                 </div>
//                 <h3 className="mt-3 text-base font-semibold">{cat.title}</h3>
//                 <p className="mt-2 text-xs text-slate-400">{cat.description}</p>
//               </div>
//               <button className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-orange-500/90 px-3 py-1.5 text-xs font-semibold hover:bg-orange-400 transition">
//                 Voir les chaînes
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Liste simple de chaînes (mock) */}
//       <section className="mx-auto max-w-6xl px-4 pb-12">
//         <div className="flex items-center justify-between gap-3">
//           <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
//             Chaînes en direct (exemple)
//           </h2>
//           <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
//             Aperçu statique pour le labo
//           </span>
//         </div>

//         <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
//               <tr>
//                 <th className="px-4 py-3 text-left">Chaîne</th>
//                 <th className="px-4 py-3 text-left">Type</th>
//                 <th className="px-4 py-3 text-left">Qualité</th>
//                 <th className="px-4 py-3 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {channels.map((c, idx) => (
//                 <tr
//                   key={c.name}
//                   className={
//                     idx % 2 === 0
//                       ? "bg-slate-900/60"
//                       : "bg-slate-900/30 border-t border-slate-800/80"
//                   }
//                 >
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/90 text-[11px] font-bold">
//                         ▶
//                       </div>
//                       <span>{c.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-slate-300">{c.type}</td>
//                   <td className="px-4 py-3 text-slate-300">{c.quality}</td>
//                   <td className="px-4 py-3 text-right">
//                     <button className="rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-semibold hover:bg-orange-400 transition">
//                       Regarder
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <p className="mt-3 text-xs text-slate-500">
//           Pour le labo, cette page reste statique (pas encore connectée au
//           backend). Le but est de montrer une interface &quot;En Direct&quot;
//           cohérente avec l&apos;accueil.
//         </p>
//       </section>
//     </main>
//   );
// }
// app/en-direct/page.tsx
export default function EnDirectPage() {
  const now = new Date().toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Bandeau */}
      <section className="border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-900 to-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
              En direct
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Regardez la TV en temps réel
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Zappez entre vos chaînes favorites, suivez les matchs, les films
              et l&apos;actualité en direct, sans limite.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-right text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Heure actuelle
            </p>
            <p className="font-semibold">{now}</p>
            <p className="mt-1 text-xs text-slate-400">
              Streaming stable • 4K / Full HD
            </p>
          </div>
        </div>
      </section>

      {/* Grille de chaînes en direct */}
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between text-sm">
          <p className="text-slate-300">
            <span className="font-semibold text-orange-400">En direct</span> – Sélection de chaînes les plus regardées.
          </p>
          <button className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800">
            Voir toutes les chaînes
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Carte 1 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/40 hover:border-orange-500/70 hover:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400">
                VV CINÉ
              </span>
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Live
              </span>
            </div>
            <h2 className="text-lg font-semibold">Mission Eclipse</h2>
            <p className="mt-1 text-xs text-slate-400">Film d&apos;action • VF • 4K</p>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <span>20:30 – 22:15</span>
              <span className="text-green-400">En cours</span>
            </div>

            <button className="mt-4 w-full rounded-full bg-orange-500 py-2 text-xs font-semibold text-white hover:bg-orange-400">
              <Link href="/plans"> Regarder en direct </Link>
            </button>
          </div>

          {/* Carte 2 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/40 hover:border-orange-500/70 hover:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400">
                VV SPORT
              </span>
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Live
              </span>
            </div>
            <h2 className="text-lg font-semibold">Ligue Pro – Match en direct</h2>
            <p className="mt-1 text-xs text-slate-400">Football • Commentaires FR</p>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <span>19:45 – 22:00</span>
              <span className="text-green-400">2e mi-temps</span>
            </div>

            <button className="mt-4 w-full rounded-full bg-orange-500 py-2 text-xs font-semibold text-white hover:bg-orange-400">
              <Link href="/plans"> Regarder en direct </Link>
            </button>
          </div>

          {/* Carte 3 */}
          <div className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/40 hover:border-orange-500/70 hover:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded bg-purple-500/10 px-2 py-1 text-xs font-semibold text-purple-400">
                VV SÉRIES
              </span>
              <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-900">
                Bientôt
              </span>
            </div>
            <h2 className="text-lg font-semibold">Nuit Blanche – S01E05</h2>
            <p className="mt-1 text-xs text-slate-400">Épisode inédit • Drame</p>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <span>22:00 – 22:45</span>
              <span className="text-yellow-400">Commence à 22:00</span>
            </div>

            <button className="mt-4 w-full rounded-full border border-slate-600 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800">
              <Link href="/plans"> Activer un rappel</Link>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
