"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";

export default function NewPlanPage() {
  const router = useRouter();

  const [nomPlan, setNomPlan] = useState("");
  const [prix, setPrix] = useState("");
  const [duree, setDuree] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/plans", {
      method: "POST",
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
      alert("Erreur lors de l'ajout du plan");
    }
  }

  return (
    <div className="p-8 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="font-bold mb-4 text-white py-4  text-5xl  border-8 border-t-orange-400 border-r-orange-400 text-center rounded-2xl ">Ajouter un nouveau plan IPTV</h1>
      <div className="flex flex-col items-start  md:items-end gap-1 text-xs text-slate-400 mb-4">
          <span>Connecté en tant qu&apos;administrateur</span>
          <Link
            href="/admin/plans"
            className="mt-1 inline-flex items-center rounded-md border border-slate-700 px-3 py-1 text-xs font-medium hover:border-orange-300 transition"
          >
            Gestion des Plans IPTV
          </Link>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom du plan"
          className="p-2 w-full bg-slate-800 border border-gray-700 rounded"
          value={nomPlan}
          onChange={(e) => setNomPlan(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Prix"
          className="p-2 w-full bg-slate-800 border border-gray-700 rounded"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <input
          type="number"
          placeholder="Durée (en jours)"
          className="p-2 w-full bg-slate-800 border border-gray-700 rounded"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="p-2 w-full bg-slate-800 border border-gray-700 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
        >
          Ajouter le plan
        </button>
      </form>
    </div>
  );
}
