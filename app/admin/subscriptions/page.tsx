// app/admin/subscriptions/page.tsx
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminSubscriptionsPage() {
  // 1) Vérifier que l'utilisateur est connecté + récupérer son rôle
  const user = await getOrCreateCurrentUser();

  // 2) Si ce n'est pas un admin → on renvoie à l'accueil
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  // 3) Charger toutes les subscriptions avec les infos user + plan
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: true,
      plan: true,
      activationCode: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return (
    <div className="p-10 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="font-bold mb-4 text-white py-4  text-5xl  border-8 border-t-orange-400 border-r-orange-400 text-center rounded-2xl">Abonnements </h1>
      <div className="flex flex-col items-start  md:items-end gap-1 text-xs text-slate-400 mb-4">
          <span>Connecté en tant qu&apos;administrateur</span>
          <Link
            href="/admin/plans"
            className="mt-1 inline-flex items-center rounded-md border border-slate-700 px-3 py-1 text-xs font-medium hover:border-orange-300 transition"
          >
            Gestion des Plans IPTV
          </Link>
        </div>
      {subscriptions.length === 0 ? (
        <p className="text-gray-400">Aucun abonnement pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-slate-700">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Utilisateur
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Email
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Plan
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Statut
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Code d&apos;activation
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Début
                </th>
                <th className="px-3 py-2 text-left border-b border-slate-700">
                  Expire le
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="odd:bg-slate-900 even:bg-slate-800">
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.user?.email?.split("@")[0] ?? "N/A"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.user?.email ?? "N/A"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.plan?.nomPlan ?? "Plan inconnu"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.status}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.activationCode?.code ?? "—"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString("fr-CA")
                      : "—"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-700">
                    {sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString("fr-CA")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
