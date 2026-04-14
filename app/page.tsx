import Link from "next/link";

export default function HomePage() {
  return (
    <div className=" bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white  px-4 py-10">
      {/* HERO */}
      <section className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
        {/* Texte gauche */}

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-900/40 px-3 py-1 text-xs font-semibold text-red-200/90">
            <span className="inline-flex h-2 w-2 rounded-full bg-red-400" />
            Streaming en Direct
          </div>
          <p className="inline-flex items-center rounded-full border border-emerald-600/50  px-3 py-1 text-xs font-medium text-white shadow-md shadow-emerald-600/20">
            IPTV • Paiements sécurisés Stripe • Codes d&apos;activation
            instantanés
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Votre télévision <br />
            <span className="text-orange-400">sans limites</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
            Accédez à des centaines de chaînes TV en direct. Films, séries,
              sports et documentaires en streaming illimité, en haute qualité.
          </p>
          {/* Boutons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="./plans"
              className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold shadow-md shadow-orange-500/40 hover:bg-orange-400 transition"
            >
              Regarder la TV
            </a>
            <a
              href="./guide"
              className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800/80 transition"
            >
              Consulter le guide
            </a>
          </div>
   {/* ====================================================== =========*/}
   

          <div className="flex flex-wrap gap-4">
            <Link
              href="/plans"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Voir les plans IPTV
            </Link>
            <Link
              href="/mes-abonnements"
              className="rounded-md border bg-orange-400 border-orange-400 px-5 py-2.5 text-sm font-medium text-white transition hover:border-orange-500 hover:text-"
            >
              Accéder à mon espace client
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Paiements sécurisés par Stripe
            </div>
            <div className="flex items-center gap-2 py-8">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Authentification via Clerk
            </div>
          </div>
        </div>

        {/* Carte TV droite */}
        <div className="relative">
          
          {/* Glow arrière-plan */}
          <div className="pointer-events-none absolute inset-0 -top-10 -z-10 animate-pulse rounded-3xl bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-purple-500/10 blur-2xl" />

          <div className="group overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl shadow-black/60 transition-transform duration-300 hover:-translate-y-1">
            {/* Bandeau en haut de la “TV” */}
            <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
                Tableau de bord IPTV
              </span>
              <span className="text-[11px] text-slate-400">
                Temps réel • Admin
              </span>
            </div>

            {/* Contenu “écran TV” */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-slate-100">
                  Vue d&apos;abonnements
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">
                  Admin
                </span>
              </div>

              {/* Petites cartes “abonnements” */}
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-900/90 px-3 py-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-100">
                      Abonnement 1 mois
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Code : <span className="font-mono">YWWXFB64</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="text-emerald-400">Actif</p>
                    <p className="text-slate-500">Expire dans 27j</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-100">
                      Abonnement Premium
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Code : <span className="font-mono">P55GPA9M</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="text-yellow-400">En attente</p>
                    <p className="text-slate-500">Activation requise</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-100">Essai 24h</p>
                    <p className="text-[11px] text-slate-400">
                      Code : <span className="font-mono">TRY24H78</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="text-rose-400">Expiré</p>
                    <p className="text-slate-500">Voir l&apos;historique</p>
                  </div>
                </div>
              </div>

              {/* Badge flottant en bas à droite */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Suivi des paiements Stripe</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                  + Nouveau webhook
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
<hr  className="border-orange-400"/>
      {/* STATS */}
      {/* Bande de stats sous le hero */}
      <section className="border-y border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-4 py-6 text-center text-sm">
          <div className="flex-1 min-w-[120px]">
            <p className="text-2xl font-extrabold text-white">500+</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Chaînes
            </p>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-2xl font-extrabold text-white">1M+</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Utilisateurs
            </p>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-2xl font-extrabold text-white">4K</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Ultra HD
            </p>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-2xl font-extrabold text-white">24/7</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              Support
            </p>
          </div>
        </div>
      </section>
      {/* ======================================================================================== */}
      <hr  className="border-orange-400"/>
      <section className="max-w-3xl mx-auto space-y-8 py-10">
         <div className="mt-6 flex flex-1 flex-col gap-4 md:mt-0">
          <div className="grid grid-cols-2 gap-4">
            {/* En Direct */}
            <div className="col-span-1 rounded-2xl bg-slate-800/80 p-4 shadow-lg shadow-slate-900/60">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/90">
                <span className="text-sm font-bold"><Link href="/en-direct"> ▶</Link></span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                <Link href="/en-direct"> En Direct</Link>
               
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Regardez en temps réel vos chaînes préférées.
              </p>
            </div>

            {/* 1M+ utilisateurs */}
            <div className="col-span-1 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500 p-4 shadow-lg shadow-purple-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-100/90">
                Communauté
              </p>
              <p className="mt-2 text-3xl font-extrabold text-white">1M+</p>
              <p className="text-xs text-purple-100/90">Utilisateurs actifs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 500+ chaînes */}
            <div className="rounded-2xl bg-slate-800/80 p-4 shadow-lg shadow-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Catalogue
              </p>
              <p className="mt-1 text-2xl font-extrabold text-white">500+</p>
              <p className="text-xs text-slate-400">Chaînes TV</p>
            </div>

            {/* Worldwide */}
            <div className="rounded-2xl bg-slate-800/80 p-4 shadow-lg shadow-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Worldwide
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Accédez à vos contenus partout dans le monde.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                🌍 Disponible 24/7
              </div>
            </div>
          </div>
        </div>
        </section>
        <hr />
        {/* ======================================================================================== */}
      {/* COMMENT ÇA MARCHE */}
      <section className="space-y-6 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            Comment ça fonctionne ?
          </h2>
          <p className="text-xs text-slate-400">
            De l&apos;achat à l&apos;activation, tout est centralisé.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-400">Étape 1</p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              Choisissez votre plan IPTV
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Comparez les durées, les prix, les packs, et sélectionnez
              l&apos;abonnement qui correspond à votre usage.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-block text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Voir les plans &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-400">Étape 2</p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              Payez via Stripe et recevez votre code
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Le paiement est traité par Stripe. Un code d&apos;activation
              unique est généré pour chaque abonnement.
            </p>
            <Link
              href="/historique"
              className="mt-3 inline-block text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Consulter l&apos;historique &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold text-emerald-400">Étape 3</p>
            <h3 className="mt-1 text-sm font-semibold text-white">
              Activez votre code et profitez de la TV
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Saisissez votre code sur la page{" "}
              <span className="font-mono">/activer</span> ; l&apos;abonnement
              est lié à votre compte instantanément.
            </p>
            <Link
              href="/activer"
              className="mt-3 inline-block text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Activer un code &rarr;
            </Link>
          </div>
        </div>
      </section>
<hr  className="border-orange-400"/>
      {/* GESTION DE COMPTE */}
      <section className="grid gap-6 md:grid-cols-[1.1fr,0.9fr] py-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Espace client complet
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Gérez tous vos abonnements IPTV au même endroit : codes, dates
            d&apos;expiration, renouvellements, annulations, historique des
            paiements Stripe, etc.
          </p>

          <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
            <Link
              href="/mes-abonnements"
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 transition hover:border-emerald-500 hover:bg-slate-900"
            >
              <span className="font-semibold text-slate-50">
                Mes abonnements
              </span>
              <span className="mt-1 text-slate-400">
                Voir les plans actifs, codes d&apos;activation et dates
                d&apos;expiration.
              </span>
            </Link>

            <Link
              href="/historique"
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 transition hover:border-emerald-500 hover:bg-slate-900"
            >
              <span className="font-semibold text-slate-50">
                Historique des paiements
              </span>
              <span className="mt-1 text-slate-400">
                Suivi clair des paiements Stripe et des sessions de checkout.
              </span>
            </Link>

            <Link
              href="/activer"
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 transition hover:border-emerald-500 hover:bg-slate-900"
            >
              <span className="font-semibold text-slate-50">
                Activer un code IPTV
              </span>
              <span className="mt-1 text-slate-400">
                Liez un code existant à votre compte VivaVistaTV.
              </span>
            </Link>

            <Link
              href="/profil"
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 transition hover:border-emerald-500 hover:bg-slate-900"
            >
              <span className="font-semibold text-slate-50">
                Profil & sécurité
              </span>
              <span className="mt-1 text-slate-400">
                Gérez vos infos de profil et la sécurité de votre compte.
              </span>
            </Link>
          </div>
        </div>

        {/* Bloc sécurité / technique */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-700/50 bg-gradient-to-br from-emerald-900/40 via-slate-950 to-slate-950 p-5">
          <div>
            <h2 className="text-sm font-semibold text-emerald-300">
              Pensé aussi pour les développeurs & admins
            </h2>
            <p className="mt-2 text-xs text-emerald-100/80">
              Webhooks Stripe, codes d&apos;activation, rôles admin, panel de
              paiements… La plateforme est prête pour un usage réel en
              production.
            </p>
          </div>

          <div className="space-y-2 text-xs text-emerald-100/80">
            <p>• Intégration Stripe Checkout & Webhooks</p>
            <p>• Authentification Clerk (roles USER / ADMIN)</p>
            <p>• Prisma + Neon Postgres pour les données</p>
            <p>• Dashboard admin pour suivre les paiements</p>
          </div>

          <div className="pt-2 text-xs">
            <Link
              href="/admin/paiements"
              className="text-emerald-300 underline-offset-2 hover:underline"
            >
              Accéder au dashboard admin (Stripe / abonnements) &rarr;
            </Link>
            <p className="mt-1 text-[11px] text-emerald-200/70">
              Visible uniquement si votre compte a le rôle ADMIN.
            </p>
          </div>
        </div>
      </section>
<hr  className="border-orange-400"/>
      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950/95 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row">
          {/* Bloc gauche : logo + description */}
          <div className="md:w-2/5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                <span className="text-lg font-extrabold text-white">▶</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                vivavista<span className="text-orange-400">tv</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              La meilleure plateforme de streaming TV en ligne. Profitez de
              centaines de chaînes et films en haute qualité.
            </p>
          </div>

          {/* Navigation */}
          {/* =================================== etoile =========== */}
          <div className="grid flex-1 grid-cols-2 gap-8 text-sm md:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Navigation
              </h4>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>
                  <a href="./" className="hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="./mes-abonnements" className="hover:text-white">
                    Abonnement
                  </a>
                </li>
                <li>
                  <a href="./plans" className="hover:text-white">
                    Plans
                  </a>
                </li>
                <li>
                  <a href="./historique" className="hover:text-white">
                    Historique
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Favoris
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Support
              </h4>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support 24/7
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Conditions d&apos;utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Rester informé
              </h4>
              <p className="mt-3 text-xs text-slate-400">
                Recevez les dernières actualités sur les nouveaux contenus.
              </p>
              <form className="mt-3 flex overflow-hidden rounded-full border border-slate-700 bg-slate-900">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="bg-orange-500 px-4 text-sm font-semibold text-white hover:bg-orange-400 transition"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
            <span>© 2025 vivavistatv. Tous droits réservés.</span>
            <span className="hidden sm:inline">Made with Saber</span>
          </div>
        </div>
      </footer>
   
    </div>
  );
}

// ========================================================================================
//================================= app/page.tsx ================================================
