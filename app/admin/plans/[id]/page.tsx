"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Plan = {
  id: string;
  nomPlan: string;
  prix: number;
  dureeJours: number;
  description?: string | null;
};

export default function EditPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as string;

  const [nomPlan, setNomPlan] = useState("");
  const [prix, setPrix] = useState("");
  const [duree, setDuree] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Charger le plan au montage
  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/plans/${id}`);
        if (!res.ok) {
          throw new Error("Erreur chargement plan");
        }
        const data: Plan = await res.json();
        setNomPlan(data.nomPlan);
        setPrix(String(data.prix));
        setDuree(String(data.dureeJours));
        setDescription(data.description ?? "");
      } catch (e) {
        console.error(e);
        alert("Impossible de charger le plan");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPlan();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(`/api/plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomPlan,
        prix: parseFloat(prix),
        dureeJours: parseInt(duree),
        description,
      }),
    });

    if (res.ok) {
      router.push("/admin/plans");
    } else {
      alert("Erreur lors de la mise à jour du plan");
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-green-600">
        <p>Chargement du plan...</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Modifier le plan IPTV</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Nom du plan"
          className="p-2 w-full text-white bg-slate-800 border border-gray-700 rounded"
          value={nomPlan}
          onChange={(e) => setNomPlan(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Prix"
          className="p-2 w-full text-white bg-slate-800 border border-gray-700 rounded"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <input
          type="number"
          placeholder="Durée (en jours)"
          className="p-2 w-full text-white bg-slate-800 border border-gray-700 rounded"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="p-2 w-full text-white bg-slate-800 border border-gray-700 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-600 hover:bg-green-500 rounded"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
