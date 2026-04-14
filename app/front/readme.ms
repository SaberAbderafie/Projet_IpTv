
## Stripe 
 // app/api/stripe/webhook/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from "@/lib/prisma";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// function generateActivationCode(length = 10): string {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   let res = "";
//   for (let i = 0; i < length; i++) {
//     res += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return res;
// }

// // éviter tout cache
// export const dynamic = "force-dynamic";

// export async function POST(req: NextRequest) {
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!webhookSecret) {
//     console.error("STRIPE_WEBHOOK_SECRET manquant dans .env");
//     return new NextResponse("Webhook non configuré", { status: 500 });
//   }

//   // Stripe veut le RAW body
//   const body = await req.text();
//   const signature = req.headers.get("stripe-signature");

//   if (!signature) {
//     return new NextResponse("Signature Stripe manquante", { status: 400 });
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//   } catch (err: unknown) {
//     console.error("Erreur vérification webhook Stripe :", err);
//     const message =
//       err instanceof Error ? err.message : "Erreur de vérification";
//     return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
//   }

//   // ----- TRAITEMENT DES ÉVÉNEMENTS -----
//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       const userId = session.metadata?.userId;
//       const planId = session.metadata?.planId;

//       if (!userId || !planId) {
//         console.error(
//           "Webhook checkout.session.completed sans metadata userId / planId",
//           session.id
//         );
//         return NextResponse.json({ received: true }, { status: 200 });
//       }

//       // éviter de créer deux fois la même subscription
//       const existing = await prisma.subscription.findFirst({
//         where: { stripeSessionId: session.id },
//       });

//       if (existing) {
//         console.log(
//           "Subscription déjà existante pour cette session Stripe",
//           session.id
//         );
//         return NextResponse.json({ received: true }, { status: 200 });
//       }

//       const plan = await prisma.planTarifaire.findUnique({
//         where: { id: planId },
//       });

//       if (!plan) {
//         console.error("Plan introuvable dans webhook pour planId =", planId);
//         return NextResponse.json({ received: true }, { status: 200 });
//       }

//       // récupérer le PaymentIntent ID si possible
//       let paymentIntentId: string | null = null;
//       if (typeof session.payment_intent === "string") {
//         paymentIntentId = session.payment_intent;
//       } else if (
//         session.payment_intent &&
//         "id" in session.payment_intent &&
//         typeof session.payment_intent.id === "string"
//       ) {
//         paymentIntentId = session.payment_intent.id;
//       }

//       const startDate = new Date();
//       const endDate = new Date(
//         startDate.getTime() + plan.dureeJours * 24 * 60 * 60 * 1000
//       );

//       const code = generateActivationCode();

//       const subscription = await prisma.subscription.create({
//         data: {
//           userId,
//           planId: plan.id,
//           status: "ACTIVE",
//           startDate,
//           endDate,
//           stripeSessionId: session.id,
//           stripePaymentIntentId: paymentIntentId,
//           activationCode: {
//             create: {
//               code,
//               status: "ASSIGNED",
//               assignedAt: new Date(),
//             },
//           },
//         },
//       });

//       console.log("Subscription créée via webhook :", subscription.id);
//     } else {
//       // pour le debug, tu peux logger les autres events si tu veux
//       console.log("Webhook Stripe ignoré, type :", event.type);
//     }

//     return NextResponse.json({ received: true }, { status: 200 });
//   } catch (error) {
//     console.error("Erreur interne dans le webhook Stripe :", error);
//     return new NextResponse("Erreur serveur webhook", { status: 500 });
//   }
// }
// ==============================================================================================

// ==============================================================================================
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from "@/lib/prisma";

// export const config = {
//   api: {
//     bodyParser: false, // important pour Stripe
//   },
// };

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-11-17.clover",
// });

// async function readRawBody(req: Request): Promise<Buffer> {
//   const chunks: Uint8Array[] = [];
//   const reader = req.body?.getReader();

//   if (!reader) return Buffer.from("");

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     if (value) chunks.push(value);
//   }

//   return Buffer.concat(chunks);
// }

// export async function POST(req: NextRequest) {
//   const signature = req.headers.get("stripe-signature");
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!signature || !webhookSecret) {
//     return NextResponse.json(
//       { error: "Signature Stripe manquante." },
//       { status: 400 }
//     );
//   }

//   let event: Stripe.Event;

//   try {
//     const rawBody = await readRawBody(req);

//     event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
//   } catch (err) {
//     console.error("❌ Erreur validation webhook:", err);
//     return NextResponse.json({ error: "Webhook invalide." }, { status: 400 });
//   }

//   // 🟦 Cas 1 — Paiement réussi
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;

//     const planId = session.metadata?.planId;
//     const userId = session.metadata?.userId;
//     const paymentIntentId = session.payment_intent as string;

//     if (!planId || !userId) {
//       console.error("❌ Missing planId or userId in metadata");
//       return NextResponse.json({ received: true });
//     }

//     console.log("🎉 Paiement réussi pour user:", userId);

//     // Récupérer le plan pour calculer les dates
//     const plan = await prisma.planTarifaire.findUnique({
//       where: { id: planId },
//     });

//     if (!plan) {
//       console.error("❌ Plan introuvable dans la DB:", planId);
//       return NextResponse.json({ received: true });
//     }

//     const start = new Date();
//     const end = new Date();
//     end.setDate(start.getDate() + plan.dureeJours);

//    // Créer l’abonnement
//     // const subscription = await prisma.subscription.create({
//     //   data: {
//     //     userId,
//     //     planId,
//     //     status: "ACTIVE",
//     //     startDate: start,
//     //     endDate: end,
//     //     stripePaymentIntentId: paymentIntentId,
//     //     stripeSessionId: session.id,

//     //     activationCode: {
//     //       create: {
//     //         code: Math.random().toString(36).substring(2, 10).toUpperCase(),
//     //         status: "ASSIGNED",
//     //         assignedAt: new Date(),
//     //       },
//     //     },
//     //   },
//     // });
//     const subscription = await prisma.subscription.create({
//       data: {
//         userId,
//         planId,
//         status: "PENDING", // en attente d'activation
//         startDate: null, // sera rempli au moment de l'activation
//         endDate: null, // idem
//         stripePaymentIntentId: paymentIntentId,
//         stripeSessionId: session.id,
//         activationCode: {
//           create: {
//             code: Math.random().toString(36).substring(2, 10).toUpperCase(),
//             status: "AVAILABLE", // encore non utilisé
//             assignedAt: null,
//           },
//         },
//       },
//     });
//     console.log("✔ Abonnement créé:", subscription.id);
//   }

//   // 🟥 Cas 2 — Paiement échoué
//   if (event.type === "payment_intent.payment_failed") {
//     const intent = event.data.object as Stripe.PaymentIntent;
//     console.error("❌ Paiement échoué:", intent.id);
//   }

//   return NextResponse.json({ received: true });
// }

// ==============================================================================================
// =====================Admin/Payment=========================================================================
 
// import { prisma } from "@/lib/prisma";
// import { User, PlanTarifaire } from "@prisma/client";

// // On définit manuellement le type avec les champs qu'on utilise
// type SubscriptionWithRelations = {
//   id: string;
//   userId: string;
//   planId: string;
//   status: string;
//   startDate: Date | null;
//   endDate: Date | null;
//   stripeSessionId: string | null;
//   stripePaymentIntentId: string | null;
//   user: User | null;
//   plan: PlanTarifaire | null;
// };

// export default async function AdminPaiementsPage() {
//   const subscriptions: SubscriptionWithRelations[] =
//     await prisma.subscription.findMany({
//       where: {
//         stripePaymentIntentId: {
//           not: null,
//         },
//       },
//       include: {
//         plan: true,
//         user: true,
//       },
//       orderBy: {
//         startDate: "desc",
//       },
//     });

//   return (
//     <main className="p-10 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Paiements Stripe</h1>

//       {subscriptions.length === 0 ? (
//         <p className="text-slate-300">
//           Aucun paiement Stripe n&apos;a encore été enregistré.
//         </p>
//       ) : (
//         <div className="overflow-x-auto border border-slate-700 rounded-lg">
//           <table className="min-w-full text-sm bg-gray-100">
//             <thead className="bg-slate-900">
//               <tr>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Utilisateur</th>
//                 <th className="px-4 py-2 text-left">Plan</th>
//                 <th className="px-4 py-2 text-right">Montant</th>
//                 <th className="px-4 py-2 text-left">PaymentIntent</th>
//                 <th className="px-4 py-2 text-left">Session</th>
//                 <th className="px-4 py-2 text-left">Statut</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subscriptions.map((sub) => {
//                 const start =
//                   sub.startDate &&
//                   new Date(sub.startDate).toLocaleString("fr-CA", {
//                     dateStyle: "short",
//                     timeStyle: "short",
//                   });

//                 const montant = sub.plan?.prix
//                   ? Number(sub.plan.prix).toFixed(2)
//                   : "—";

//                 const paymentLink = sub.stripePaymentIntentId
//                   ? `https://dashboard.stripe.com/test/payments/${sub.stripePaymentIntentId}`
//                   : null;

//                 const sessionLink = sub.stripeSessionId
//                   ? `https://dashboard.stripe.com/test/checkouts/sessions/${sub.stripeSessionId}`
//                   : null;

//                 return (
//                   <tr key={sub.id} className="border-t border-slate-700 text-blue-400">
//                     {/* Date */}
//                     <td className="px-4 py-2 whitespace-nowrap">{start}</td>

//                     {/* Utilisateur */}
//                     <td className="px-4 py-2">
//                       <div className="flex flex-col">
//                         <span className="font-semibold">
//                           {sub.user?.email ?? "Utilisateur inconnu"}
//                         </span>
//                         <span className="text-xs text-slate-400">
//                           ID user : {sub.userId}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Plan */}
//                     <td className="px-4 py-2">
//                       <div className="flex flex-col">
//                         <span className="font-semibold">
//                           {sub.plan?.nomPlan ?? "Plan inconnu"}
//                         </span>
//                         <span className="text-xs text-slate-400">
//                           ID plan : {sub.planId}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Montant */}
//                     <td className="px-4 py-2 text-right">{montant} $</td>

//                     {/* PaymentIntent */}
//                     <td className="px-4 py-2 max-w-xs">
//                       {paymentLink && (
//                         <a
//                           href={paymentLink}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-xs text-emerald-400 underline break-all"
//                         >
//                           {sub.stripePaymentIntentId}
//                         </a>
//                       )}
//                     </td>

//                     {/* Session */}
//                     <td className="px-4 py-2 max-w-xs">
//                       {sessionLink && (
//                         <a
//                           href={sessionLink}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-xs text-blue-400 underline break-all"
//                         >
//                           {sub.stripeSessionId}
//                         </a>
//                       )}
//                     </td>

//                     {/* Statut */}
//                     <td className="px-4 py-2">
//                       <span className="text-xs px-2 py-1 rounded bg-slate-700">
//                         {sub.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </main>
//   );
// }
// app/admin/paiements/page.tsx
//==================================================================================================
//===================// app/profil/page.tsx ================================================================
// // app/profil/page.tsx
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";

// export default async function ProfilPage() {
//   // 1) Utilisateur connecté (Clerk + Prisma)
//   const user = await getOrCreateCurrentUser();

//   // 2) On charge ses abonnements (les plus récents en premier)
//   const subscriptions = await prisma.subscription.findMany({
//     where: { userId: user.id },
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//     orderBy: {
//       startDate: "desc",
//     },
//   });

//   const totalSubs = subscriptions.length;
//   const activeSubs = subscriptions.filter(
//     (sub) => sub.status === "ACTIVE"
//   ).length;
//   const lastSub = subscriptions[0] ?? null;

//   const createdAt = new Date(user.createdAt).toLocaleDateString("fr-CA");

//   const lastSubExpiresAt =
//     lastSub?.endDate
//       ? new Date(lastSub.endDate).toLocaleDateString("fr-CA")
//       : null;

//   return (
//     <div className="p-10 text-white">
//       <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

//       {/* Carte infos utilisateur */}
//       <div className="mb-6 rounded-md border border-slate-700 bg-slate-800 px-6 py-4">
//         <h2 className="text-xl font-semibold mb-2">Informations personnelles</h2>

//         <p>
//           <span className="font-semibold">Email :</span> {user.email}
//         </p>
//         <p>
//           <span className="font-semibold">Rôle :</span> {user.role}
//         </p>
//         <p>
//           <span className="font-semibold">Compte créé le :</span> {createdAt}
//         </p>
//       </div>

//       {/* Carte résumé abonnements */}
//       <div className="mb-6 rounded-md border border-slate-700 bg-slate-800 px-6 py-4">
//         <h2 className="text-xl font-semibold mb-2">Mes abonnements</h2>

//         <p>
//           <span className="font-semibold">Nombre total :</span> {totalSubs}
//         </p>
//         <p>
//           <span className="font-semibold">Actifs :</span> {activeSubs}
//         </p>

//         {lastSub && lastSub.plan && (
//           <div className="mt-4 border-t border-slate-600 pt-3">
//             <p className="font-semibold mb-1">Dernier abonnement :</p>
//             <p>
//               <span className="font-semibold">Plan :</span>{" "}
//               {lastSub.plan.nomPlan}
//             </p>
//             <p>
//               <span className="font-semibold">Statut :</span> {lastSub.status}
//             </p>
//             <p>
//               <span className="font-semibold">Code d&apos;activation :</span>{" "}
//               {lastSub.activationCode?.code ?? "N/A"}
//             </p>
//             <p>
//               <span className="font-semibold">Expire le :</span>{" "}
//               {lastSubExpiresAt ?? "N/A"}
//             </p>
//           </div>
//         )}

//         {!lastSub && (
//           <p className="mt-3 text-sm text-slate-300">
//             Vous n&apos;avez pas encore d&apos;abonnement.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
// =============================================================================================
// ==============================// app/page.tsx ===============================================================
// import Link from "next/link";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// export default function HomePage() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
//       <div className="max-w-xl text-center space-y-4">
//         <h1 className="text-3xl md:text-4xl font-bold">VivaVistaTV</h1>
//         <p className="text-sm md:text-base text-slate-300">
//           Plateforme transactionnelle pour acheter des abonnements IPTV
//           numériques et recevoir instantanément votre code d&apos;activation.
//         </p>

//         <SignedOut>
//           <div className="flex gap-4 justify-center mt-4">
//             <Link
//               href="/sign-in"
//               className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
//             >
//               Se connecter
//             </Link>
//             <Link
//               href="/sign-up"
//               className="px-4 py-2 rounded border border-slate-500 text-sm"
//             >
//               Créer un compte
//             </Link>
//           </div>
//         </SignedOut>

//         <SignedIn>
//           <div className="flex items-center justify-center gap-4 mt-4">
//             <span className="text-sm text-slate-300">
//               Vous êtes connecté.
//             </span>
//             <UserButton afterSignOutUrl="/" />
//           </div>
//         </SignedIn>
//       </div>
//     </main>
//   );
// }
// ====================================================================================================================
// ============================// app/layout.tsx ========================================================================================

// import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "VivaVistaTV",
//   description: "Achat d'abonnements IPTV numériques",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider>
//       <html lang="fr">
//         <body
//           className="bg-slate-950 text-slate-50"
//           suppressHydrationWarning={true}
//         >
//           {children}
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }
// app/layout.tsx
// ====================================================================================================================
// ==================================// app/mes-abonnements/page.tsx ==================================================================================
// // app/mes-abonnements/page.tsx
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";

// export default async function MesAbonnements() {
//   const user = await getOrCreateCurrentUser();

//   const abonnements = await prisma.subscription.findMany({
//     where: { userId: user.id },
//     include: {

//       plan: true,
//       activationCode: true,
//     },
//     orderBy: {
//       startDate: "desc",
//     },
//   });

//   if (abonnements.length === 0) {
//     return (
//       <div className="p-10 text-white">
//         <h1 className="text-3xl font-bold mb-6">Mes abonnements</h1>
//         <p className="text-gray-400">
//           Vous n&apos;avez aucun abonnement pour le moment.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-10 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
//       <h1 className="font-bold mb-6 text-white-900 bg-b-4 p-10  text-5xl  border-8 border-b-rose-900 border-r-rose-900 text-center rounded-2xl">Mes abonnements</h1>

//       <div className="space-y-4 mt-4">
//         {abonnements.map((sub) => (
//           <div
//             key={sub.id}
//             className="border border-gray-700 bg-slate-800 p-6 rounded-md"
//           >
//             <h2 className="text-xl font-semibold text-green-400">
//               {sub.plan?.nomPlan ?? "Plan inconnu"}
//             </h2>

//             <p className="mt-2">
//               <strong>Prix :</strong> {sub.plan?.prix.toString()} $
//             </p>
//             <p>
//               <strong>Durée :</strong> {sub.plan?.dureeJours} jours
//             </p>

//             <p className="mt-2">
//               <strong>Statut :</strong> {sub.status}
//             </p>

//             <p>
//               <strong>Code d&apos;activation :</strong>{" "}
//               {sub.activationCode?.code ?? "N/A"}
//             </p>

//             <p>
//               <strong>Expire le :</strong>{" "}
//               {sub.endDate
//                 ? new Date(sub.endDate).toLocaleDateString("fr-CA")
//                 : "N/A"}
//             </p>

//             {/* 🔴 Bouton "Annuler l'abonnement" */}
//             {/* Bouton ANNULER */}
//             <form
//               method="POST"
//               action={`/api/subscriptions/${sub.id}/cancel`}
//               className="mt-4 inline-block"
//             >
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
//               >
//                 Annuler l&apos;abonnement
//               </button>
//             </form>
//             {/* Bouton RENOUVELER */}
//             <form
//               method="POST"
//               action={`/api/subscriptions/${sub.id}/renew`}
//               className="inline-block ml-2"
//             >
//               <button
//                 type="submit"
//                 className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
//               >
//                 Renouveler l&apos;abonnement
//               </button>
//             </form>
//             {/* Abonnement expirer  */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// // ===============================// app/api/stripe/success/route.ts=====================================================

// // app/api/stripe/success/route.ts
// import { NextRequest, NextResponse } from "next/server";

// // Le webhook Stripe s'occupe maintenant de créer la Subscription.
// // Cette route ne fait plus que gérer la redirection côté navigateur.

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const url = new URL(req.url);
//   const sessionId = url.searchParams.get("session_id");

//   if (!sessionId) {
//     // Aucun session_id → on renvoie vers /plans avec un message d'erreur
//     return NextResponse.redirect(
//       new URL("/plans?error=no-session", req.url),
//       303
//     );
//   }

//   // Juste pour le debug en local si tu regardes la console
//   console.log("Retour Stripe success pour la session :", sessionId);

//   // Le webhook a déjà (ou va) créer l'abonnement.
//   // Ici on envoie juste l'utilisateur vers "Mes abonnements".
//   return NextResponse.redirect(
//     new URL("/mes-abonnements?success=stripe", req.url),
//     303
//   );
// }
// ================================================================================================
// =================================// app/plans/page.tsx ==================================================================
// // app/plans/page.tsx
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

// // ⚠️ Avec Next 16, searchParams est un Promise dans un composant async
// type PageProps = {
//   searchParams: Promise<{
//     sort?: string;
//     duree?: string;
//   }>;
// };

// export default async function PlansPage({ searchParams }: PageProps) {
//   // On "await" d'abord les searchParams
//   const params = await searchParams;

//   const sort = params.sort ?? "price-asc";
//   const dureeFilter = params.duree;

//   // Construction du "where" pour filtrer selon la durée
//   const where: Prisma.PlanTarifaireWhereInput = {};

//   // Catégories de durée
//   if (dureeFilter === "short") {
//     where.dureeJours = { lt: 40 };
//   } else if (dureeFilter === "medium") {
//     where.dureeJours = { gte: 40, lt: 365 };
//   } else if (dureeFilter === "long") {
//     where.dureeJours = { gte: 365 };
//   }

//   // Construction du "orderBy" pour le tri
//   let orderBy: Prisma.PlanTarifaireOrderByWithRelationInput = { prix: "asc" };

//   switch (sort) {
//     case "price-desc":
//       orderBy = { prix: "desc" };
//       break;
//     case "duration-asc":
//       orderBy = { dureeJours: "asc" };
//       break;
//     case "duration-desc":
//       orderBy = { dureeJours: "desc" };
//       break;
//     case "name-asc":
//       orderBy = { nomPlan: "asc" };
//       break;
//     case "name-desc":
//       orderBy = { nomPlan: "desc" };
//       break;
//     case "price-asc":
//     default:
//       orderBy = { prix: "asc" };
//       break;
//   }

//   const plans = await prisma.planTarifaire.findMany({
//     where,
//     orderBy,
//   });

//   return (
//     <main className="p-10 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
//       <h1 className="font-bold mb-4 text-blue-700 bg-amber-400 p-10  text-7xl  border-8 border-t-rose-900 border-r-rose-900 text-center rounded-2xl">
//         Plans d&apos;abonnement
//       </h1>

//       {/* Filtres + tri */}
//       <form
//         method="GET"
//         className="mb-6 flex flex-wrap items-end gap-4 bg-slate-800 border border-gray-700 rounded p-8"
//       >
//         <div className="flex flex-col bg-cyan-800/30 p-2 rounded">
//           <label htmlFor="sort" className="text-sm text-slate-300 mb-1">
//             Trier par
//           </label>
//           <select
//             id="sort"
//             name="sort"
//             defaultValue={sort}
//             className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm"
//           >
//             <option value="price-asc">Prix : du moins cher au plus cher</option>
//             <option value="price-desc">
//               Prix : du plus cher au moins cher
//             </option>
//             <option value="duration-asc">
//               Durée : la plus courte d&apos;abord
//             </option>
//             <option value="duration-desc">
//               Durée : la plus longue d&apos;abord
//             </option>
//             <option value="name-asc">Nom : A → Z</option>
//             <option value="name-desc">Nom : Z → A</option>
//           </select>
//         </div>

//         <div className="flex flex-col bg-cyan-800/30 p-2 rounded">
//           <label htmlFor="duree" className="text-sm text-slate-300 mb-1">
//             Filtrer par durée
//           </label>
//           <select
//             id="duree"
//             name="duree"
//             defaultValue={dureeFilter ?? ""}
//             className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm"
//           >
//             <option value="">Toutes les durées</option>
//             <option value="short">Courte (&lt; 40 jours)</option>
//             <option value="medium">Moyenne (40–364 jours)</option>
//             <option value="long">Longue (&ge; 365 jours)</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
//         >
//           Appliquer
//         </button>
//       </form>

//       {/* ============ Liste des plans =================*/}
//       {plans.length === 0 ? (
//         <p className="text-slate-300">
//           Aucun plan ne correspond aux filtres sélectionnés.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className="border border-gray-700 bg-slate-800 p-6 rounded-md"
//             >
//               <h2 className="text-xl font-semibold text-green-400">
//                 {plan.nomPlan}
//               </h2>

//               <p className="mt-2">
//                 <strong>Prix :</strong> {plan.prix.toString()} $
//               </p>
//               <p>
//                 <strong>Durée :</strong> {plan.dureeJours} jours
//               </p>

//               {plan.description && (
//                 <p className="mt-2 text-slate-300">{plan.description}</p>
//               )}

//               {/* Bouton Acheter – adapte l’action selon ton flow */}
//               {/* <form
//                 method="POST"
//                 action={`/api/subscriptions`}
//                 className="mt-4"
//               >
//                 <input type="hidden" name="planId" value={plan.id} />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded"
//                 >
//                   Acheter ce plan
//                 </button>
//               </form> */}

//               {/* =================Stripe ================*/}
//               <form
//                 method="POST"
//                 action={`/api/stripe/checkout?planId=${plan.id}`}
//                 className="mt-4"
//               >
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded"
//                 >
//                   Acheter ce plan
//                 </button>
//               </form>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }
=================================================================================================================

// "use client";

// import { useEffect, useState, FormEvent } from "react";

// type PlanInfo = {
//   id: string;
//   nom: string;
//   dureeJours: number;
//   prix: string | number;
// };

// type UserInfo = {
//   id: string;
//   email: string;
// };

// type AbonnementInfo = {
//   id: string;
//   statut: string;
//   startDate: string;
//   endDate: string;
//   plan: PlanInfo | null;
//   user: UserInfo | null;
// };

// interface ActivationResult {
//   code?: string;
//   activationStatus?: string;
//   abonnement?: AbonnementInfo;
//   error?: string;   // au cas où l'API renvoie "error"
//   erreur?: string;  // ou "erreur"
// }

// export default function ActivationPage() {
//   const [code, setCode] = useState<string>("");
//   const [result, setResult] = useState<ActivationResult | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Si ?code=XXXXX dans l’URL → préremplir + vérifier automatiquement
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const c = params.get("code");
//     if (c) {
//       setCode(c);
//       void verifyCode(c);
//     }
//   }, []);

//   async function verifyCode(value: string): Promise<void> {
//     if (!value.trim()) {
//       setResult({ error: "Veuillez entrer un code d'activation." });
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const res = await fetch(
//         `/api/activation?code=${encodeURIComponent(value.trim())}`
//       );
//       const data: ActivationResult = await res.json();
//       setResult(data);
//     } catch {
//       setResult({ error: "Erreur de connexion au serveur." });
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleSubmit(e: FormEvent<HTMLFormElement>): void {
//     e.preventDefault();
//     void verifyCode(code);
//   }

//   const errorMessage = result?.error ?? result?.erreur ?? "";

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-slate-900 text-white p-4">
//       <div className="bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-lg">
//         <h1 className="text-3xl font-bold mb-6 text-center">
//           Activer votre abonnement
//         </h1>

//         {/* Bloc succès */}
//         {result?.abonnement && (
//           <div className="bg-slate-700 p-4 rounded mb-6">
//             <p className="text-emerald-400 font-bold mb-2">✔ Code reconnu</p>

//             <p>
//               <b>Code :</b> {result.code}
//             </p>
//             {result.abonnement.plan && (
//               <>
//                 <p>
//                   <b>Plan :</b> {result.abonnement.plan.nom}
//                 </p>
//                 <p>
//                   <b>Durée :</b> {result.abonnement.plan.dureeJours} jours
//                 </p>
//               </>
//             )}
//             <p>
//               <b>Expire le :</b>{" "}
//               {result.abonnement.endDate
//                 ? result.abonnement.endDate.split("T")[0]
//                 : "N/A"}
//             </p>
//           </div>
//         )}

//         {/* Bloc erreur */}
//         {errorMessage && (
//           <p className="bg-red-600 p-3 rounded mb-6 text-center">
//             ❌ {errorMessage}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Entrez votre code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="w-full p-3 rounded bg-slate-900 border border-slate-600"
//           />

//           <button
//             className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-semibold"
//             disabled={loading}
//           >
//             {loading ? "Vérification..." : "Activer mon abonnement"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-sm text-slate-400">
//           Vous avez déjà un abonnement actif ?{" "}
//           <a href="/mes-abonnements" className="text-blue-300 underline">
//             Voir mes abonnements
//           </a>
//         </p>
//       </div>
//     </main>
//   );
// }


// =================================// app/activer/page.tsx =================================================

// "use client";

// import { FormEvent, useCallback, useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// type ActivationPlan = {
//   id: string;
//   nom: string;
//   dureeJours: number;
//   prix: string;
// };

// type ActivationUser = {
//   id: string;
//   email: string;
// };

// type ActivationDetails = {
//   code: string;
//   activationStatus: string;
//   abonnementId: string;
//   statut: string;
//   startDate: string | null;
//   endDate: string | null;
//   plan: ActivationPlan | null;
//   user: ActivationUser | null;
// };

// export default function ActiverPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const codeFromUrl = searchParams.get("code") ?? "";
//   const errorFromUrl = searchParams.get("error");

//   const [code, setCode] = useState<string>(codeFromUrl);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(
//     errorFromUrl ? "Impossible d'activer ce code." : null
//   );
//   const [errorDetail, setErrorDetail] = useState<string | null>(
//     errorFromUrl === "already-used"
//       ? "Ce code a déjà été utilisé ou est déjà assigné à un autre abonnement."
//       : errorFromUrl === "invalid"
//       ? "Ce code est invalide ou n'est lié à aucun abonnement."
//       : null
//   );
//   const [success, setSuccess] = useState<string | null>(null);
//   const [details, setDetails] = useState<ActivationDetails | null>(null);

//   // Fonction commune pour vérifier le code via l'API (sans redirection)
//   const verifyCode = useCallback(
//     async (codeToCheck: string, updateUrl: boolean) => {
//       const trimmed = codeToCheck.trim();

//       if (!trimmed) {
//         setError("Veuillez entrer un code d'activation.");
//         setErrorDetail(null);
//         setSuccess(null);
//         setDetails(null);
//         return;
//       }

//       setLoading(true);
//       setError(null);
//       setErrorDetail(null);
//       setSuccess(null);
//       setDetails(null);

//       try {
//         const res = await fetch(
//           `/api/activation?code=${encodeURIComponent(trimmed)}`,
//           {
//             method: "GET",
//           }
//         );

//         const data = await res.json().catch(() => ({} as unknown));

//         if (!res.ok) {
//           const message =
//             typeof data?.error === "string"
//               ? data.error
//               : "Impossible de valider ce code pour le moment.";
//           setError("Impossible d'activer ce code.");
//           setErrorDetail(message);

//           if (updateUrl) {
//             const params = new URLSearchParams(searchParams.toString());
//             params.set("error", "invalid");
//             params.delete("code");
//             router.replace(`/activer?${params.toString()}`);
//           }

//           return;
//         }

//         const abonnement = data.abonnement;

//         const mappedDetails: ActivationDetails = {
//           code: String(data.code),
//           activationStatus: String(data.activationStatus ?? ""),
//           abonnementId: String(abonnement?.id ?? ""),
//           statut: String(abonnement?.statut ?? ""),
//           startDate: abonnement?.startDate ?? null,
//           endDate: abonnement?.endDate ?? null,
//           plan: abonnement?.plan
//             ? {
//                 id: String(abonnement.plan.id),
//                 nom: String(abonnement.plan.nom),
//                 dureeJours: Number(abonnement.plan.dureeJours),
//                 prix: String(abonnement.plan.prix),
//               }
//             : null,
//           user: abonnement?.user
//             ? {
//                 id: String(abonnement.user.id),
//                 email: String(abonnement.user.email),
//               }
//             : null,
//         };

//         setDetails(mappedDetails);
//         setSuccess("Code reconnu ! Votre abonnement est prêt à être utilisé.");

//         if (updateUrl) {
//           const params = new URLSearchParams();
//           params.set("code", trimmed);
//           params.set("success", "1");
//           router.replace(`/activer?${params.toString()}`);
//         }
//       } catch (e) {
//         console.error("Erreur côté client /activer :", e);
//         setError("Erreur inattendue lors de la vérification du code.");
//         setErrorDetail(
//           "Veuillez réessayer dans quelques instants ou contacter le support."
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [router, searchParams]
//   );

//   // Si on arrive avec ?code=XXXX dans l’URL, on vérifie automatiquement
//   useEffect(() => {
//     if (codeFromUrl) {
//       void verifyCode(codeFromUrl, false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [codeFromUrl]);

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     await verifyCode(code, true);
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-10">
//       <div className="mx-auto max-w-3xl">
//         {/* Titre */}
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
//             Activer un code IPTV
//           </h1>
//           <p className="mt-2 text-sm md:text-base text-slate-300">
//             Entrez le code d&apos;activation reçu après votre achat Stripe ou
//             via un revendeur. Si le code est valide et disponible, il sera lié
//             à votre compte VivaVistaTV.
//           </p>
//         </header>

//         {/* Alertes */}
//         {error && (
//           <div className="mb-6 rounded-lg border border-red-800 bg-red-900/40 px-4 py-3 text-sm">
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-xl">⚠️</span>
//               <div>
//                 <p className="font-semibold text-red-200">{error}</p>
//                 {errorDetail && (
//                   <p className="mt-1 text-red-100 text-xs md:text-sm">
//                     {errorDetail}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 rounded-lg border border-emerald-700 bg-emerald-900/30 px-4 py-3 text-sm">
//             <div className="flex items-start gap-3">
//               <span className="mt-0.5 text-xl">✅</span>
//               <div>
//                 <p className="font-semibold text-emerald-200">
//                   Paiement / code validé
//                 </p>
//                 <p className="mt-1 text-emerald-100 text-xs md:text-sm">
//                   {success}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bloc formulaire */}
//         <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-lg">
//           <h2 className="text-lg font-semibold mb-4">
//             Saisir un code d&apos;activation
//           </h2>
//           <p className="text-sm text-slate-300 mb-4">
//             Le code est généralement composé de lettres et de chiffres (ex :{" "}
//             <span className="font-mono text-emerald-300">AB7K9T3P</span>).{" "}
//             Évitez les espaces et respectez la casse si nécessaire.
//           </p>

//           <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//             <div>
//               <label
//                 htmlFor="code"
//                 className="block text-xs font-medium uppercase tracking-wide text-slate-400 mb-1"
//               >
//                 Code d&apos;activation
//               </label>
//               <input
//                 id="code"
//                 name="code"
//                 value={code}
//                 onChange={(e) => setCode(e.target.value.toUpperCase())}
//                 placeholder="Entrez votre code IPTV ici"
//                 className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 font-mono"
//                 autoComplete="off"
//               />
//               {details?.user?.email && (
//                 <p className="mt-1 text-xs text-slate-400">
//                   Le code sera automatiquement associé à votre compte :{" "}
//                   <span className="font-semibold">
//                     {details.user.email}
//                   </span>
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
//               >
//                 {loading ? "Vérification..." : "Activer ce code"}
//               </button>

//               <a
//                 href="/historique"
//                 className="text-xs md:text-sm text-slate-300 hover:text-white underline-offset-2 hover:underline"
//               >
//                 Voir votre historique d&apos;achats
//               </a>
//             </div>
//           </form>
//         </section>

//         {/* Résumé de l’abonnement si le code est valide */}
//         {details && (
//           <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8">
//             <h2 className="text-lg font-semibold mb-4">
//               Détails de l&apos;abonnement
//             </h2>
//             <div className="grid gap-3 text-sm md:grid-cols-2">
//               <div>
//                 <p className="text-slate-400 text-xs uppercase mb-1">
//                   Plan
//                 </p>
//                 <p className="font-semibold">
//                   {details.plan?.nom ?? "Plan inconnu"}
//                 </p>
//                 {details.plan && (
//                   <p className="text-xs text-slate-300 mt-1">
//                     {details.plan.dureeJours} jours • {details.plan.prix} $
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <p className="text-slate-400 text-xs uppercase mb-1">
//                   Code d&apos;activation
//                 </p>
//                 <p className="font-mono text-sm">{details.code}</p>
//                 <p className="text-xs text-slate-300 mt-1">
//                   Statut du code :{" "}
//                   <span className="font-semibold">
//                     {details.activationStatus}
//                   </span>
//                 </p>
//               </div>

//               <div>
//                 <p className="text-slate-400 text-xs uppercase mb-1">
//                   Période
//                 </p>
//                 <p className="text-xs text-slate-200">
//                   Début :{" "}
//                   {details.startDate
//                     ? new Date(details.startDate).toLocaleDateString("fr-CA")
//                     : "—"}
//                 </p>
//                 <p className="text-xs text-slate-200">
//                   Fin :{" "}
//                   {details.endDate
//                     ? new Date(details.endDate).toLocaleDateString("fr-CA")
//                     : "—"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-slate-400 text-xs uppercase mb-1">
//                   Compte associé
//                 </p>
//                 <p className="text-xs text-slate-200">
//                   {details.user?.email ?? "Non disponible"}
//                 </p>
//                 <p className="text-xs text-slate-300 mt-1">
//                   ID abonnement :{" "}
//                   <span className="font-mono">{details.abonnementId}</span>
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Bas de page */}
//         <footer className="mt-10 text-xs text-slate-500 text-center">
//           Besoin d&apos;un nouveau code ?{" "}
//           <a
//             href="./plans"
//             className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
//           >
//             Consulter les plans IPTV
//           </a>
//         </footer>
//       </div>
//     </main>
//   );
// }

// ==================================================================================================

// =================================================================================================
// =========================// app/api/activation/route.ts========================================================================
// app/api/activation/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// /**
//  * Fonction commune pour vérifier un code d'activation.
//  * Accepte :
//  *   - GET /api/activation?code=XXXX
//  *   - POST /api/activation  (form ou JSON avec { code })
//  */
// async function handleActivation(req: NextRequest) {
//   let code: string | null = null;

//   // 1) Essayer de récupérer le code dans l'URL : ?code=XXXX
//   const { searchParams } = new URL(req.url);
//   code = searchParams.get("code");

//   // 2) Si pas de code dans l'URL et que c'est un POST → regarder le body
//   if (!code && req.method === "POST") {
//     const contentType = req.headers.get("content-type") || "";

//     try {
//       if (contentType.includes("application/json")) {
//         // formulaire envoyé en JSON : { "code": "..." }
//         const body = await req.json();
//         if (typeof body.code === "string") {
//           code = body.code.trim();
//         }
//       } else if (contentType.includes("application/x-www-form-urlencoded")) {
//         // formulaire HTML classique : <form method="POST" action="/api/activation">
//         const formData = await req.formData();
//         const rawCode = formData.get("code");
//         if (typeof rawCode === "string") {
//           code = rawCode.trim();
//         }
//       }
//     } catch (err) {
//       console.error("Erreur lors de la lecture du body /api/activation :", err);
//     }
//   }

//   if (!code) {
//     return NextResponse.json(
//       { error: "Code d'activation manquant. Utilise ?code=XXXX ou un formulaire avec 'code'." },
//       { status: 400 }
//     );
//   }

//   try {
//     const activation = await prisma.activationCode.findUnique({
//       where: { code },
//       include: {
//         subscription: {
//           include: {
//             plan: true,
//             user: true,
//           },
//         },
//       },
//     });

//     if (!activation || !activation.subscription) {
//       return NextResponse.json(
//         { error: "Code invalide ou non associé à un abonnement." },
//         { status: 404 }
//       );
//     }

//     const sub = activation.subscription;

//     const now = new Date();
//     const isExpired =
//       sub.endDate && new Date(sub.endDate).getTime() < now.getTime();

//     if (sub.status !== "ACTIVE" || isExpired) {
//       return NextResponse.json(
//         { error: "Abonnement expiré ou inactif pour ce code." },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         code: activation.code,
//         activationStatus: activation.status,
//         abonnement: {
//           id: sub.id,
//           statut: sub.status,
//           startDate: sub.startDate,
//           endDate: sub.endDate,
//           plan: sub.plan
//             ? {
//                 id: sub.plan.id,
//                 nom: sub.plan.nomPlan,
//                 dureeJours: sub.plan.dureeJours,
//                 prix: sub.plan.prix,
//               }
//             : null,
//           user: sub.user
//             ? {
//                 id: sub.user.id,
//                 email: sub.user.email,
//               }
//             : null,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Erreur /api/activation :", err);
//     return NextResponse.json(
//       { error: "Erreur serveur lors de la vérification du code." },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * GET /api/activation?code=XXXX
//  */
// export async function GET(req: NextRequest) {
//   return handleActivation(req);
// }

// /**
//  * POST /api/activation
//  * - avec form <input name="code">
//  * - ou JSON { "code": "XXXX" }
//  */
// export async function POST(req: NextRequest) {
//   return handleActivation(req);
// }

// =================================================================================================
// ==================================== app/api/subscriptions/[id]/renew/route.ts================================================
//
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";
// import crypto from "crypto";

// type RouteParams = {
//   params: {
//     id: string; // id de l'abonnement
//   };
// };

// // POST /api/subscriptions/:id/renew
// export async function POST(req: Request, { params }: RouteParams) {
//   // 1) Vérifier que l'utilisateur est connecté
//   const user = await getOrCreateCurrentUser().catch(() => null);

//   if (!user) {
//     // pas connecté → redirection vers Clerk
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   // 2) Récupérer l'abonnement de cet utilisateur
//   const subscription = await prisma.subscription.findFirst({
//     where: {
//       id: params.id,
//       userId: user.id, // sécurité : l'abonnement doit appartenir à cet utilisateur
//     },
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//   });

//   if (!subscription || !subscription.plan) {
//     // Abonnement introuvable ou plan manquant → retour vers la page avec un message
//     return NextResponse.redirect(
//       new URL("/mes-abonnements?error=notfound", req.url)
//     );
//   }

//   // 3) Calcul des nouvelles dates de validité
//   const now = new Date();
//   const newEndDate = new Date(now);
//   newEndDate.setDate(newEndDate.getDate() + subscription.plan.dureeJours);

//   // 4) Nouveau code d’activation
//   const newCode = crypto.randomBytes(6).toString("hex").toUpperCase();

//   // 5) Mise à jour de l'abonnement + du code d'activation
//   await prisma.subscription.update({
//     where: { id: subscription.id },
//     data: {
//       status: "ACTIVE",
//       startDate: now,
//       endDate: newEndDate,
//       activationCode: subscription.activationCode
//         ? {
//             // Il existe déjà un code → on le met à jour
//             update: {
//               code: newCode,
//               status: "ASSIGNED",
//               assignedAt: now,
//             },
//           }
//         : {
//             // Pas encore de code → on le crée
//             create: {
//               code: newCode,
//               status: "ASSIGNED",
//               assignedAt: now,
//             },
//           },
//     },
//   });

//   // 6) Redirection vers la page "Mes abonnements" avec un flag de succès
//   const redirectUrl = new URL("/mes-abonnements?success=renew", req.url);
//   return NextResponse.redirect(redirectUrl);
// }
// =================================================================================================

// app/api/subscriptions/[id]/renew/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";
// import crypto from "crypto";

// type RouteParams = {
//   params: {
//     id: string; // id de l'abonnement
//   };
// };

// export async function POST(_req: Request, { params }: RouteParams) {
//   // 1) Vérifier que l'utilisateur est connecté
//   const user = await getOrCreateCurrentUser().catch(() => null);

//   if (!user) {
//     return NextResponse.json(
//       { error: "Utilisateur non authentifié" },
//       { status: 401 }
//     );
//   }

//   // 2) Récupérer l'abonnement + le plan + le code d'activation
//   const subscription = await prisma.subscription.findFirst({
//     where: {
//       id: params.id,
//       userId: user.id, // sécurité : l'abonnement doit appartenir à cet user
//     },
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//   });

//   if (!subscription) {
//     return NextResponse.json(
//       { error: "Abonnement introuvable" },
//       { status: 404 }
//     );
//   }

//   // 3) Calculer les nouvelles dates
//   const now = new Date();
//   const newEndDate = new Date(now);
//   newEndDate.setDate(newEndDate.getDate() + subscription.plan.dureeJours);

//   // 4) Générer un nouveau code d'activation
//   const newCode = crypto.randomBytes(6).toString("hex").toUpperCase();

//   // 5) Mettre à jour l'abonnement + le code d'activation
//   const updated = await prisma.subscription.update({
//     where: { id: subscription.id },
//     data: {
//       status: "ACTIVE",
//       startDate: now,
//       endDate: newEndDate,
//       activationCode: subscription.activationCode
//         ? {
//             // il existe déjà un code → on le met à jour
//             update: {
//               code: newCode,
//               status: "ASSIGNED", // ou "ACTIVE" / "USED" selon ton choix
//               assignedAt: now,
//             },
//           }
//         : {
//             // pas encore de code → on le crée
//             create: {
//               code: newCode,
//               status: "ASSIGNED",
//               assignedAt: now,
//             },
//           },
//     },
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//   });

//   return NextResponse.json(updated, { status: 200 });
// }
// ==================================app/api/subscriptions/route.ts==================================================
// // // 
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const user = await getOrCreateCurrentUser();

//     // Si tu envoies du JSON depuis le client
//     const body = await req.json();
//     const planId = body.planId as string;

//     if (!planId) {
//       return NextResponse.json(
//         { error: "planId manquant" },
//         { status: 400 }
//       );
//     }

//     const plan = await prisma.planTarifaire.findUnique({
//       where: { id: planId },
//     });

//     if (!plan) {
//       return NextResponse.json(
//         { error: "Plan introuvable" },
//         { status: 404 }
//       );
//     }

//     const now = new Date();
//     const endDate = new Date(
//       now.getTime() + plan.dureeJours * 24 * 60 * 60 * 1000
//     );

//     // 1) Créer la subscription
//     const sub = await prisma.subscription.create({
//       data: {
//         userId: user.id,
//         planId: plan.id,
//         status: "ACTIVE",
//         startDate: now,
//         endDate: endDate,
//       },
//     });

//     // 2) Générer et attacher un code d’activation
//     const code = Math.random().toString(36).substring(2, 10);

//     await prisma.activationCode.create({
//       data: {
//         code,
//         status: "ASSIGNED",
//         assignedAt: now,
//         subscriptionId: sub.id,
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Erreur POST /api/subscriptions :", err);
//     return NextResponse.json(
//       { error: "Erreur lors de l'achat" },
//       { status: 500 }
//     );
//   }
// }
// app/api/subscriptions/route.ts
=========================================historique/route ========================================

// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";

// type PageProps = {
//   // Next 16 : searchParams est un Promise
//   searchParams: Promise<{
//     statut?: string;
//     plan?: string;
//   }>;
// };

// export default async function HistoriquePage({ searchParams }: PageProps) {
//   const user = await getOrCreateCurrentUser();

//   const params = await searchParams;
//   const statutFilter = params.statut ?? "all"; // all | ACTIVE | EXPIRED | CANCELLED | PENDING
//   const planFilter = params.plan?.trim() ?? "";

//   // Filtres Prisma
//   const where: any = {
//     userId: user.id,
//   };

//   if (statutFilter !== "all") {
//     where.status = statutFilter.toUpperCase();
//   }

//   if (planFilter !== "") {
//     where.plan = {
//       nomPlan: {
//         contains: planFilter,
//         mode: "insensitive",
//       },
//     };
//   }

//   const subscriptions = await prisma.subscription.findMany({
//     where,
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//     orderBy: {
//       startDate: "desc",
//     },
//   });

//   // 🔹 Résumé rapide
//   const totalAbonnements = subscriptions.length;
//   const nbActifs = subscriptions.filter((s) => s.status === "ACTIVE").length;

//   const totalDepense = subscriptions.reduce((sum, sub) => {
//     // prix est un Decimal → Number() suffit pour ton projet
//     const montant = sub.plan?.prix ? Number(sub.plan.prix) : 0;
//     return sum + montant;
//   }, 0);

//   const derniereDate =
//     subscriptions[0]?.startDate &&
//     new Date(subscriptions[0].startDate).toLocaleString("fr-CA", {
//       dateStyle: "short",
//       timeStyle: "short",
//     });

//   // URL export CSV avec les filtres
//   const paramsExport = new URLSearchParams();
//   if (statutFilter) paramsExport.set("statut", statutFilter);
//   if (planFilter) paramsExport.set("plan", planFilter);
//   const exportUrl = `/historique/export${
//     paramsExport.toString() ? `?${paramsExport.toString()}` : ""
//   }`;

//   return (
//     <main className="p-10 text-white">
//       <h1 className="font-bold mb-4 text-blue-700 bg-amber-400 p-10 text-7xl border-8 border-t-rose-900 border-r-rose-900 text-center rounded-2xl">
//         Historique de mes achats
//       </h1>

//       {/* 🔹 Bloc résumé */}
//       <section className="mb-6 grid gap-4 md:grid-cols-3">
//         <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
//           <p className="text-sm text-slate-300">Total dépensé</p>
//           <p className="mt-1 text-2xl font-bold text-emerald-400">
//             {totalDepense.toFixed(2)} $
//           </p>
//         </div>

//         <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
//           <p className="text-sm text-slate-300">Nombre d&apos;abonnements</p>
//           <p className="mt-1 text-2xl font-bold">
//             {totalAbonnements}{" "}
//             <span className="text-sm text-slate-400">au total</span>
//           </p>
//           <p className="text-xs text-slate-300 mt-1">
//             Dont{" "}
//             <span className="font-semibold text-emerald-400">{nbActifs}</span>{" "}
//             actif(s)
//           </p>
//         </div>

//         <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
//           <p className="text-sm text-slate-300">Dernier achat</p>
//           <p className="mt-1 text-base font-semibold">
//             {derniereDate ?? "—"}
//           </p>
//         </div>
//       </section>

//       {/* Filtres */}
//       <form
//         method="GET"
//         className="mb-6 flex flex-wrap items-end gap-4 bg-slate-800/80 border border-slate-700 rounded-xl p-4"
//       >
//         <div className="flex flex-col">
//           <label htmlFor="statut" className="text-sm text-slate-300 mb-1">
//             Filtrer par statut
//           </label>
//           <select
//             id="statut"
//             name="statut"
//             defaultValue={statutFilter}
//             className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm"
//           >
//             <option value="all">Tous les statuts</option>
//             <option value="ACTIVE">Actif</option>
//             <option value="PENDING">En attente</option>
//             <option value="EXPIRED">Expiré</option>
//             <option value="CANCELLED">Annulé</option>
//           </select>
//         </div>

//         <div className="flex flex-col">
//           <label htmlFor="plan" className="text-sm text-slate-300 mb-1">
//             Rechercher par nom de plan
//           </label>
//           <input
//             id="plan"
//             name="plan"
//             defaultValue={planFilter}
//             placeholder="ex : 1 mois, Premium..."
//             className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm"
//           />
//         </div>

//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
//         >
//           Appliquer les filtres
//         </button>

//         <a
//           href={exportUrl}
//           className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm"
//         >
//           Exporter en CSV
//         </a>
//       </form>

//       {subscriptions.length === 0 ? (
//         <p className="text-slate-300">
//           Aucun abonnement ne correspond aux filtres sélectionnés.
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {subscriptions.map((sub) => {
//             const start =
//               sub.startDate &&
//               new Date(sub.startDate).toLocaleString("fr-CA", {
//                 dateStyle: "short",
//                 timeStyle: "short",
//               });

//             const end =
//               sub.endDate &&
//               new Date(sub.endDate).toLocaleDateString("fr-CA");

//             const montant = sub.plan?.prix?.toString() ?? "—";
//             const nomPlan = sub.plan?.nomPlan ?? "Plan inconnu";

//             let statutLabel = sub.status;
//             if (sub.status === "ACTIVE") statutLabel = "Actif";
//             if (sub.status === "PENDING") statutLabel = "En attente";
//             if (sub.status === "CANCELLED") statutLabel = "Annulé";
//             if (sub.status === "EXPIRED") statutLabel = "Expiré";

//             return (
//               <div
//                 key={sub.id}
//                 className="border border-slate-700 bg-slate-800 rounded-md p-6"
//               >
//                 <div className="flex justify-between items-start gap-4">
//                   <div>
//                     <h2 className="text-xl font-semibold text-emerald-400">
//                       {nomPlan}
//                     </h2>
//                     <p className="text-sm text-slate-300 mt-1">
//                       Identifiant abonnement :{" "}
//                       <span className="font-mono text-xs">{sub.id}</span>
//                     </p>

//                     <div className="mt-3 space-y-1 text-sm">
//                       <p>
//                         <strong>Montant payé :</strong> {montant} $
//                       </p>
//                       <p>
//                         <strong>Date d&apos;achat / renouvellement :</strong>{" "}
//                         {start ?? "N/A"}
//                       </p>
//                       <p>
//                         <strong>Date d&apos;expiration :</strong>{" "}
//                         {end ?? "N/A"}
//                       </p>
//                       <p>
//                         <strong>Statut :</strong> {statutLabel}
//                       </p>
//                       {sub.activationCode && (
//                         <p>
//                           <strong>Code d&apos;activation :</strong>{" "}
//                           <span className="font-mono">
//                             {sub.activationCode.code}
//                           </span>
//                         </p>
//                       )}

//                       {/* 🔹 Infos Stripe (si paiement via Stripe) */}
//                       {sub.stripePaymentIntentId && (
//                         <p className="text-xs text-slate-400 mt-2">
//                           Paiement Stripe :{" "}
//                           <span className="font-mono break-all">
//                             {sub.stripePaymentIntentId}
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="text-right text-xs text-slate-400">
//                     <p>Créé le : {start ?? "N/A"}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </main>
//   );
// }

================================= app/plans/[id]/page.tsx ======================================================================
/

/ // 
// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";

// type PlanDetailsProps = {
//   params: { id: string };
// };

// export default async function PlanDetails({ params }: PlanDetailsProps) {
//   const plan = await prisma.planTarifaire.findUnique({
//     where: { id: params.id },
//   });

//   if (!plan) return notFound();

//   return (
//     <div className="p-10 text-white">
//       <h1 className="text-3xl font-bold mb-4">{plan.nomPlan}</h1>

//       <p className="mt-2">
//         <strong>Prix :</strong> {plan.prix.toString()} $
//       </p>
//       <p className="mt-2">
//         <strong>Durée :</strong> {plan.dureeJours} jours
//       </p>

//       {plan.description && (
//         <p className="mt-4 text-gray-300">{plan.description}</p>
//       )}

//       {/* ✅ FORMULAIRE D'ACHAT */}
//       <form method="POST" action="/api/subscriptions" className="mt-6">
//         {/* planId envoyé à l’API */}
//         <input type="hidden" name="planId" value={plan.id} />

//         <button
//           type="submit"
//           className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
//         >
//           Confirmer achat
//         </button>
//       </form>
//     </div>
//   );
// }


// app/plans/[id]/page.tsx


// =============================================================================================
// ============================= app/profil/page.tsx ================================================================

// 
// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";
// import ProfileFormClient from "./ProfileFormClient";

// export default async function ProfilPage() {
//   const user = await getOrCreateCurrentUser();

//   const abonnements = await prisma.subscription.findMany({
//     where: { userId: user.id },
//     include: {
//       plan: true,
//       activationCode: true,
//     },
//     orderBy: {
//       startDate: "desc",
//     },
//   });

//   const hasSubscriptions = abonnements.length > 0;

//   return (
//     <div className="p-10 text-white space-y-8 p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
//       {/* Infos de base */}
//       <section className="bg-slate-800 border border-gray-700 rounded p-6">
//         <h1 className="text-3xl font-bold mb-4">Profil utilisateur</h1>

//         <p>
//           <strong>Email :</strong> {user.email}
//         </p>
//         <p>
//           <strong>Rôle :</strong> {user.role}
//         </p>
//         <p>
//           <strong>Créé le :</strong>{" "}
//           {new Date(user.createdAt).toLocaleDateString("fr-CA")}
//         </p>
//       </section>

//       {/* 🆕 Formulaire d’édition du profil */}
//       <section className="bg-slate-800 border border-gray-700 rounded p-6">
//         <h2 className="text-2xl font-semibold mb-4">Modifier mon profil</h2>

//         <ProfileFormClient
//           initialDisplayName={user.displayName ?? ""}
//           initialAvatarUrl={user.avatarUrl ?? ""}
//         />
//       </section>

//       {/* Abonnements */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Mes abonnements</h2>

//         {!hasSubscriptions && (
//           <p className="text-gray-400">
//             Vous n&apos;avez aucun abonnement pour le moment.
//           </p>
//         )}

//         {hasSubscriptions && (
//           <div className="space-y-4 mt-4">
//             {abonnements.map((sub) => (
//               <div
//                 key={sub.id}
//                 className="border border-gray-700 bg-slate-800 p-6 rounded-md"
//               >
//                 <h3 className="text-xl font-semibold text-green-400">
//                   {sub.plan?.nomPlan ?? "Plan inconnu"}
//                 </h3>

//                 <p className="mt-2">
//                   <strong>Prix :</strong>{" "}
//                   {sub.plan ? sub.plan.prix.toString() : "—"} $
//                 </p>
//                 <p>
//                   <strong>Durée :</strong> {sub.plan?.dureeJours ?? "—"} jours
//                 </p>

//                 <p className="mt-2">
//                   <strong>Statut :</strong> {sub.status}
//                 </p>

//                 <p>
//                   <strong>Code d&apos;activation :</strong>{" "}
//                   {sub.activationCode?.code ?? "N/A"}
//                 </p>

//                 <p>
//                   <strong>Expire le :</strong>{" "}
//                   {sub.endDate
//                     ? new Date(sub.endDate).toLocaleDateString("fr-CA")
//                     : "N/A"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }
// ====================================================================================================================
// ===================================== app/page.tsx ===============================================================================
// 
// import Link from "next/link";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";
// import { HeaderUserMenu } from "@/components/HeaderUserMenu";

// export default async function HomePage() {
//   let user = null;
//   let activeSubsCount = 0;

//   try {
//     user = await getOrCreateCurrentUser();

//     if (user) {
//       activeSubsCount = await prisma.subscription.count({
//         where: {
//           userId: user.id,
//           status: "ACTIVE",
//         },
//       });
//     }
//   } catch (e) {
//     // on ne casse pas la page si la DB ne répond pas
//     console.error("Erreur chargement utilisateur pour la home :", e);
//   }

//   const isAdmin = user?.role === "ADMIN";

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
//       {/* HEADER */}
//       <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
//         <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="rounded bg-emerald-500 px-2 py-1 text-xs font-bold text-slate-900">
//               VivaVistaTV
//             </span>
//             <span className="text-sm text-slate-300">
//               IPTV sécurisée & instantanée
//             </span>
//           </Link>

//           <SignedIn>
//             <HeaderUserMenu />
//           </SignedIn>

//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500">
//                 Se connecter
//               </button>
//             </SignInButton>
//           </SignedOut>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center">
//         <div className="flex-1">
//           <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
//             <span className="h-2 w-2 rounded-full bg-emerald-400" />
//             Abonnements IPTV 100% numériques
//           </p>

//           <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
//             Gérez vos abonnements IPTV
//             <span className="block text-emerald-400">
//               en quelques clics.
//             </span>
//           </h1>

//           <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
//             Achetez, renouvelez et activez vos abonnements VivaVistaTV
//             instantanément. Codes sécurisés, historique clair et tableau de
//             bord complet pour suivre vos paiements.
//           </p>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <Link
//               href="/plans"
//               className="rounded bg-emerald-600 px-5 py-2.5 text-sm font-semibold shadow hover:bg-emerald-500"
//             >
//               Voir les plans
//             </Link>

//             <SignedIn>
//               <Link
//                 href="/mes-abonnements"
//                 className="rounded border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:border-slate-400 hover:bg-slate-800/60"
//               >
//                 Mes abonnements
//               </Link>
//             </SignedIn>

//           </div>

//           <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
//             <div>✔ Paiement sécurisé via Stripe</div>
//             <div>✔ Codes d&apos;activation générés automatiquement</div>
//             <div>✔ Gestion simple des renouvellements</div>
//           </div>
//         </div>

//         {/* Visuel “fake dashboard” */}
//         <div className="flex-1">
//           <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
//             <div className="mb-3 flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-300">
//                 Aperçu de votre compte
//               </span>
//               <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
//                 Temps réel
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="rounded-xl bg-slate-800/80 p-3">
//                 <p className="text-[11px] text-slate-400">
//                   Abonnements actifs
//                 </p>
//                 <p className="mt-1 text-2xl font-bold text-emerald-400">
//                   {activeSubsCount}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-800/80 p-3">
//                 <p className="text-[11px] text-slate-400">
//                   Paiement sécurisé
//                 </p>
//                 <p className="mt-1 text-xs font-medium text-emerald-300">
//                   Stripe • Cartes VISA / Mastercard
//                 </p>
//               </div>
//             </div>

//             <div className="mt-4 rounded-xl bg-slate-800/60 p-3 text-[11px] text-slate-300">
//               <p className="font-medium text-slate-100">
//                 Comment ça marche ?
//               </p>
//               <ol className="mt-2 list-decimal space-y-1 pl-5">
//                 <li>Choisissez un plan IPTV adapté à vos besoins</li>
//                 <li>Payer en ligne via Stripe (environnement de test)</li>
//                 <li>Recevez votre code d&apos;activation immédiatement</li>
//                 <li>Activez le code directement depuis VivaVistaTV</li>
//               </ol>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* BANDE DE STATS */}
//       <section className="border-t border-slate-800 bg-slate-950/80">
//         <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 py-6 text-xs text-slate-300 md:text-sm">
//           <div>
//             <p className="font-semibold text-white">Back-end prêt pour la prod</p>
//             <p className="text-slate-400">
//               Prisma, Neon, Stripe, Clerk, webhooks, codes d&apos;activation.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-white">Admin complet</p>
//             <p className="text-slate-400">
//               Gestion des plans, abonnements, paiements Stripe.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-white">Historique détaillé</p>
//             <p className="text-slate-400">
//               Suivi de tous les achats et renouvellements.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* BLOC ADMIN */}
//       {isAdmin && (
//         <section className="border-t border-slate-800 bg-amber-500/5">
//           <div className="mx-auto max-w-5xl px-6 py-6">
//             <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
//               Espace administrateur
//             </p>
//             <p className="mt-1 text-sm text-slate-200">
//               Accédez rapidement à la gestion des plans et au tableau des paiements.
//             </p>
//             <div className="mt-4 flex flex-wrap gap-3">
//               <Link
//                 href="/admin/plans"
//                 className="rounded bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-400"
//               >
//                 Gérer les plans IPTV
//               </Link>
//               <Link
//                 href="/admin/paiements"
//                 className="rounded border border-amber-500/60 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10"
//               >
//                 Voir les paiements Stripe
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=================================APP/PAGE.TSX============================================================

// import Link from "next/link";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

// import { prisma } from "@/lib/prisma";
// import { getOrCreateCurrentUser } from "@/lib/auth";
// import HeaderUserMenu from "@/components/HeaderUserMenu";

// export default async function HomePage() {
//   let user = null;
//   let activeSubsCount = 0;

//   try {
//     user = await getOrCreateCurrentUser();

//     if (user) {
//       activeSubsCount = await prisma.subscription.count({
//         where: {
//           userId: user.id,
//           status: "ACTIVE",
//         },
//       });
//     }
//   } catch (e) {
//     console.error("Erreur chargement utilisateur pour la home :", e);
//   }

//   const isAdmin = user?.role === "ADMIN";

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
//       {/* HEADER */}
//       <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
//         <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="rounded bg-emerald-500 px-2 py-1 text-xs font-bold text-slate-900">
//               VivaVistaTV
//             </span>
//             <span className="text-sm text-slate-300">
//               IPTV sécurisée &amp; codes d&apos;activation instantanés
//             </span>
//           </Link>

//           <SignedIn>
//             <HeaderUserMenu />
//           </SignedIn>

//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500">
//                 Se connecter
//               </button>
//             </SignInButton>
//           </SignedOut>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center">
//         <div className="flex-1">
//           <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
//             <span className="h-2 w-2 rounded-full bg-emerald-400" />
//             Abonnements IPTV 100% numériques
//           </p>

//           <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
//             Gérez vos abonnements IPTV
//             <span className="block text-emerald-400">
//               en quelques clics.
//             </span>
//           </h1>

//           <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
//             Achetez, renouvelez et activez vos abonnements VivaVistaTV
//             instantanément. Paiement sécurisé via Stripe, codes d&apos;activation
//             automatiques, historique de tous vos achats.
//           </p>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <Link
//               href="/plans"
//               className="rounded bg-emerald-600 px-5 py-2.5 text-sm font-semibold shadow hover:bg-emerald-500"
//             >
//               Voir les plans
//             </Link>

//             <SignedIn>
//               <Link
//                 href="/mes-abonnements"
//                 className="rounded border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:border-slate-400 hover:bg-slate-800/60"
//               >
//                 Mes abonnements
//               </Link>
//             </SignedIn>
//           </div>

//           <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
//             <div>✔ Paiement sécurisé via Stripe</div>
//             <div>✔ Codes d&apos;activation générés automatiquement</div>
//             <div>✔ Renouvellement simple en un clic</div>
//           </div>
//         </div>

//         {/* Bloc “aperçu compte” */}
//         <div className="flex-1">
//           <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
//             <div className="mb-3 flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-300">
//                 Aperçu de votre compte
//               </span>
//               <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
//                 Temps réel
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="rounded-xl bg-slate-800/80 p-3">
//                 <p className="text-[11px] text-slate-400">
//                   Abonnements actifs
//                 </p>
//                 <p className="mt-1 text-2xl font-bold text-emerald-400">
//                   {activeSubsCount}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-800/80 p-3">
//                 <p className="text-[11px] text-slate-400">
//                   Paiement sécurisé
//                 </p>
//                 <p className="mt-1 text-xs font-medium text-emerald-300">
//                   Stripe • Cartes VISA / Mastercard
//                 </p>
//               </div>
//             </div>

//             <div className="mt-4 rounded-xl bg-slate-800/60 p-3 text-[11px] text-slate-300">
//               <p className="font-medium text-slate-100">
//                 Comment ça marche ?
//               </p>
//               <ol className="mt-2 list-decimal space-y-1 pl-5">
//                 <li>Choisissez un plan IPTV adapté à vos besoins.</li>
//                 <li>Payez en ligne via Stripe (mode test pour le labo).</li>
//                 <li>Recevez votre code d&apos;activation immédiatement.</li>
//                 <li>Activez le code directement depuis VivaVistaTV.</li>
//               </ol>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* BANDE DE STATS */}
//       <section className="border-t border-slate-800 bg-slate-950/80">
//         <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 py-6 text-xs text-slate-300 md:text-sm">
//           <div>
//             <p className="font-semibold text-white">Back-end complet</p>
//             <p className="text-slate-400">
//               Prisma, Neon, Stripe, Clerk, webhooks, codes d&apos;activation.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-white">Interface utilisateur</p>
//             <p className="text-slate-400">
//               Gestion des plans, abonnements, activations, historique.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-white">Espace admin</p>
//             <p className="text-slate-400">
//               Suivi des paiements Stripe et gestion des plans IPTV.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* BLOC ADMIN */}
//       {isAdmin && (
//         <section className="border-t border-slate-800 bg-amber-500/5">
//           <div className="mx-auto max-w-5xl px-6 py-6">
//             <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
//               Espace administrateur
//             </p>
//             <p className="mt-1 text-sm text-slate-200">
//               Accédez rapidement à la gestion des plans et au tableau des paiements.
//             </p>
//             <div className="mt-4 flex flex-wrap gap-3">
//               <Link
//                 href="/admin/plans"
//                 className="rounded bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-400"
//               >
//                 Gérer les plans IPTV
//               </Link>
//               <Link
//                 href="/admin/paiements"
//                 className="rounded border border-amber-500/60 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10"
//               >
//                 Voir les paiements Stripe
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}
//     </main>
//   );
// }

// ====================================================================================================================
// ====================================================================================================================

// export default function HomePage() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
//       <div className="max-w-xl text-center space-y-4">
//         <h1 className="text-3xl md:text-4xl font-bold">VivaVistaTV</h1>
//         <p className="text-sm md:text-base text-slate-300">
//           Plateforme transactionnelle pour acheter des abonnements IPTV
//           numériques et recevoir instantanément votre code d&apos;activation.
//         </p>

//         <SignedOut>
//           <div className="flex gap-4 justify-center mt-4">
//             <Link
//               href="/sign-in"
//               className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
//             >
//               Se connecter
//             </Link>
//             <Link
//               href="/sign-up"
//               className="px-4 py-2 rounded border border-slate-500 text-sm"
//             >
//               Créer un compte
//             </Link>
//           </div>
//         </SignedOut>

//         <SignedIn>
//           <div className="flex items-center justify-center gap-4 mt-4">
//             <span className="text-sm text-slate-300">
//               Vous êtes connecté.
//             </span>
//             <UserButton afterSignOutUrl="/" />
//           </div>
//         </SignedIn>
//       </div>
//     </main>
//   );
// }
// app/page.tsx
// app/page.tsx

// app/page.tsx