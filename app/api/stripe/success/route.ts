
import { NextRequest, NextResponse } from "next/server";

// ⚠️ IMPORTANT : ce handler NE touche plus à la base de données.
// Toute la logique de création d'abonnement se fait maintenant
// dans le webhook Stripe (/api/stripe/webhook).

export async function GET(req: NextRequest) {
  // On lit le session_id renvoyé par Stripe (utile pour debug)
  const sessionId = req.nextUrl.searchParams.get("session_id");

  // Si jamais Stripe ne renvoie pas de session_id → on repart sur /plans
  if (!sessionId) {
    const urlErreur = new URL("/plans?error=no-session", req.nextUrl);
    return NextResponse.redirect(urlErreur, 303);
  }

  // Sinon on redirige simplement vers la page "Mes abonnements"
  const urlOk = new URL("/mes-abonnements?success=stripe", req.nextUrl);
  return NextResponse.redirect(urlOk, 303);
}
