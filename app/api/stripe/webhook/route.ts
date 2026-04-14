
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

//  Ancien config pages/ : Next 16 le garde encore mais affiche un warning.
// On peut le laisser pour Stripe (raw body).
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// Utilise une vraie apiVersion Stripe ou laisse vide
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

// Lecture du raw body pour vérifier la signature Stripe
async function readRawBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();

  if (!reader) return Buffer.from("");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("❌ Pas de stripe-signature ou de STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Erreur validation webhook:", err);
    return NextResponse.json({ error: "Webhook invalide." }, { status: 400 });
  }

  console.log("📩 Webhook Stripe reçu:", event.type);

  //  Paiement réussi → création de l’abonnement en PENDING + code AVAILABLE
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const planId = session.metadata?.planId;
    const userId = session.metadata?.userId;
    const paymentIntentId = session.payment_intent as string | null;

    if (!planId || !userId) {
      console.error("❌ planId ou userId manquant dans metadata");
      return NextResponse.json({ received: true }); // on ne renvoie pas d'erreur à Stripe
    }

    console.log("🎉 Paiement réussi pour user:", userId, "plan:", planId);

    const plan = await prisma.planTarifaire.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      console.error("❌ Plan introuvable dans la DB:", planId);
      return NextResponse.json({ received: true });
    }

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: "PENDING", // sera activé plus tard via /api/activation
        startDate: null,
        endDate: null,
        stripePaymentIntentId: paymentIntentId ?? undefined,
        stripeSessionId: session.id,
        activationCode: {
          create: {
            code,
            status: "AVAILABLE",
            assignedAt: null,
          },
        },
      },
      include: {
        activationCode: true,
      },
    });

    console.log("✔ Abonnement créé:", subscription.id);
    console.log("✔ Code d’activation:", subscription.activationCode?.code);
  }

  // 🟥 Paiement échoué
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.error("❌ Paiement échoué:", intent.id);
  }

  return NextResponse.json({ received: true });
}
