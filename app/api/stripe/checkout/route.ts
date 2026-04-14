import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateCurrentUser();

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { error: "planId manquant dans l'URL." },
        { status: 400 }
      );
    }

    const plan = await prisma.planTarifaire.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan introuvable." },
        { status: 404 }
      );
    }

    const amount = Number(plan.prix) * 100;

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: plan.id,
      },
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: Math.round(amount),
            product_data: {
              name: plan.nomPlan,
              description: plan.description ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/plans?error=stripe-cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Impossible de créer la session Stripe." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Erreur /api/stripe/checkout :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe." },
      { status: 500 }
    );
  }
}
