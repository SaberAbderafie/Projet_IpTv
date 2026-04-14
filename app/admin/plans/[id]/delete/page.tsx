"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function DeletePlanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Retour à la liste
      router.push("/admin/plans");
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Erreur inconnue";

      setError(message);
      setLoading(false);
    }
  }

  function handleCancel() {
    router.push("/admin/plans");
  }

  return (
    <div className="p-8 text-white p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Supprimer ce plan ?</h1>
      <p className="mb-4">
        Es-tu sûr de vouloir supprimer ce plan IPTV ? Cette action est
        irréversible.
      </p>

      {error && <p className="mb-4 text-red-400">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 text-white bg-red-700 hover:bg-red-600 rounded disabled:opacity-50"
        >
          {loading ? "Suppression..." : "Oui, supprimer"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500 rounded"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
