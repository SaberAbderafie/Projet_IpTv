// app/profil/ProfileFormClient.tsx
"use client";

import { useState } from "react";

type ProfileFormClientProps = {
  initialDisplayName: string;
  initialAvatarUrl: string;
};

type PatchResponse = {
  success?: boolean;
  error?: string;
};

export default function ProfileFormClient({
  initialDisplayName,
  initialAvatarUrl,
}: ProfileFormClientProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      const data = (await res.json()) as PatchResponse;

      if (!res.ok || !data.success) {
        setError(data.error ?? "Erreur lors de la mise à jour du profil.");
        return;
      }

      setMessage("Profil mis à jour avec succès.");
    } catch (err) {
      console.error(err);
      setError("Erreur réseau lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1 text-sm font-medium">
          Nom d&apos;affichage
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className="w-full p-2 rounded bg-slate-900 border border-gray-700"
          placeholder="Ex : Saber IPTV Lover"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">
          URL de l&apos;avatar (optionnel)
        </label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          className="w-full p-2 rounded bg-slate-900 border border-gray-700"
          placeholder="https://exemple.com/mon-avatar.png"
        />
        {avatarUrl && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-gray-400">Prévisualisation :</span>
            {/* simple <img> de preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-green-400">{message}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </form>
  );
}
