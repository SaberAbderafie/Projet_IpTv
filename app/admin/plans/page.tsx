"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Plan = {
  id: string;
  nomPlan: string;
  prix: number | string; // Prisma peut renvoyer un string pour Decimal
  dureeJours: number;
  description?: string | null;
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPlans() {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/plans");

      if (!res.ok) {
        throw new Error("Erreur de chargement des plans");
      }

      const data: Plan[] = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // 👉 PAS de /api/me ici, on charge juste les plans
    loadPlans();
  }, []);

  return (
    <div className="p-8 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="font-bold mb-4 text-white py-4  text-5xl  border-8 border-t-orange-400 border-r-orange-400 text-center rounded-2xl ">
        Gestion des Plans IPTV
      </h1>

      <div className="mb-6">
        {/* Stripe */}
        <Link
          href="/admin/paiements"
          className="px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded text-sm"
        >
          Voir les paiements Stripe
        </Link>
        <span> </span>
        <Link
          href="/admin/plans/new"
          className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded"
        >
          ➕ Ajouter un plan
        </Link>
        <span> </span>
        <Link
          href="/admin/subscriptions"
          className="px-4 py-3 bg-emerald-500 hover:bg-emerald-900 rounded text-sm"
        >
          Voir les abonnements
        </Link>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="space-y-4">
        {loading && <p className="text-gray-400">Chargement des plans...</p>}

        {!loading && plans.length === 0 && !error && (
          <p className="text-gray-400">Aucun plan pour le moment...</p>
        )}

        {!loading &&
          !error &&
          plans.length > 0 &&
          plans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 border border-gray-600 rounded bg-slate-800"
            >
              <h2 className="text-xl font-semibold">{plan.nomPlan}</h2>
              <p>Prix : {plan.prix} $</p>
              <p>Durée : {plan.dureeJours} jours</p>
              {plan.description && (
                <p className="text-sm text-gray-400">{plan.description}</p>
              )}

              <div className="mt-4 flex gap-3">
                <a
                  href={`/admin/plans/${plan.id}`}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded"
                >
                  Modifier
                </a>
                <a
                  href={`/admin/plans/${plan.id}/delete`}
                  className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded"
                >
                  Supprimer
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
