
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PlanParams = {
  id: string;
};

type PlanDetailsProps = {
  // ⚠️ Avec Next 16, params est un Promise dans les Server Components dynamiques
  params: Promise<PlanParams>;
};

export default async function PlanDetails({ params }: PlanDetailsProps) {
  // ✅ On "await" params pour récupérer l'id
  const { id } = await params;

  const plan = await prisma.planTarifaire.findUnique({
    where: { id },
  });

  if (!plan) return notFound();

  return (
    <div className="p-10 text-black p-10 text-white bg-gradient-to-r from-blue-900 via-gray-900 to-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{plan.nomPlan}</h1>

      <p className="mt-2">
        <strong>Prix :</strong> {plan.prix.toString()} $
      </p>
      <p className="mt-2">
        <strong>Durée :</strong> {plan.dureeJours} jours
      </p>

      {plan.description && (
        <p className="mt-4 text-gray-300">{plan.description}</p>
      )}

      {/* ✅ FORMULAIRE D'ACHAT */}
      <form method="POST" action="/api/subscriptions" className="mt-6">
        <input type="hidden" name="planId" value={plan.id} />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
        >
          Confirmer lachat
        </button>
      </form>
    </div>
  );
}
