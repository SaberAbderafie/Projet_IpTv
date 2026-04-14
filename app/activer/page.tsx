
import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth";

type PageSearchParams = {
  success?: string;
  error?: string;
  code?: string; // si tu renvoies le code dans l'URL après l'activation
};

type PageProps = {
  // Next 16 : searchParams est un Promise
  searchParams: Promise<PageSearchParams>;
};

export default async function ActiverPage({ searchParams }: PageProps) {
  const user = await getOrCreateCurrentUser();
  const params = await searchParams;

  const success = params.success;
  const error = params.error;
  const lastCode = params.code;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <section className="max-w-3xl mx-auto space-y-8">
        {/* HEADER */}
        <header>
            <span className="text-sm text-slate-400 pb-10 grid"> 
             <button className="  px-4 py-2 rounded-md bg-green-700 hover:bg-green-500 text-sm font-medium transition-colors">
                        <Link
                          href="../mes-abonnements"
                          className="mt-1 text-xs text-center text-white hover:text-slate-200 transition-colors"
                        >
                          Retour
                        </Link>
                      </button>
           
          </span>
          <br />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Activer un code IPTV
          </h1>
        
          <p className="mt-3 text-sm md:text-base text-slate-300">
            Entrez le code d&apos;activation que vous avez reçu après votre
            achat Stripe ou par un revendeur. Si le code est valide et disponible,
            il sera immédiatement lié à votre compte VivaVistaTV.
          </p>
        </header>

        {/* ALERTES */}
        <section className="space-y-3">
          {success && (
            <div className="rounded-lg border border-emerald-800 bg-emerald-900/40 px-4 py-3 flex items-start gap-3 text-sm">
              <span className="mt-0.5 text-lg">✅</span>
              <div>
                <p className="font-semibold text-emerald-300">
                  Code activé avec succès
                </p>
                <p className="text-emerald-100">
                  Votre abonnement a été activé sur votre compte. Vous pouvez le
                  retrouver dans la page{" "}
                  <Link
                    href="/mes-abonnements"
                    className="underline hover:text-emerald-200"
                  >
                    Mes abonnements
                  </Link>
                  .
                </p>
                {lastCode && (
                  <p className="mt-2 text-xs text-emerald-200">
                    Code utilisé :{" "}
                    <span className="font-mono tracking-wider">
                      {lastCode}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-800 bg-rose-950/50 px-4 py-3 flex items-start gap-3 text-sm">
              <span className="mt-0.5 text-lg">⚠️</span>
              <div>
                <p className="font-semibold text-rose-300">
                  Impossible d&apos;activer ce code
                </p>
                <p className="text-rose-100">
                  {error === "not-found" &&
                    "Ce code n'existe pas dans notre système. Vérifiez qu'il n'y a pas d'erreur de saisie."}
                  {error === "already-used" &&
                    "Ce code a déjà été utilisé ou est déjà assigné à un autre abonnement."}
                  {error === "not-available" &&
                    "Ce code n'est pas disponible pour l'activation (statut invalide)."}
                  {error !== "not-found" &&
                    error !== "already-used" &&
                    error !== "not-available" &&
                    error}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* FORMULAIRE D’ACTIVATION */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold mb-2">
            Saisir un code d&apos;activation
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            Le code est généralement composé de lettres et de chiffres (ex :
            <span className="font-mono text-emerald-300 mx-1">
              AB7K9T3P
            </span>
            ). Évitez les espaces et respectez la casse si nécessaire.
          </p>

          <form
            method="POST"
            action="/api/activation"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="code"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300 mb-1"
              >
                Code d&apos;activation
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                defaultValue={lastCode ?? ""}
                placeholder="Entrez votre code IPTV ici"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono tracking-widest"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Le code sera automatiquement associé à votre compte :{" "}
                <span className="font-semibold text-slate-300">
                  {user.email}
                </span>
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Activer ce code
            </button>
          </form>
        </section>

        {/* AIDE / LIENS */}
        <section className="text-xs text-slate-400 space-y-2">
          <p>
            Besoin de retrouver vos codes déjà utilisés ? Consultez{" "}
            <Link
              href="/historique"
              className="underline hover:text-slate-200"
            >
              votre historique d&apos;achats
            </Link>
            .
          </p>
          <p>
            Pour acheter un nouveau code, vous pouvez visiter la page{" "}
            <Link href="/plans" className="underline hover:text-slate-200">
              Plans IPTV
            </Link>
            .
          </p>
        </section>
      </section>
    </main>
  );
}
