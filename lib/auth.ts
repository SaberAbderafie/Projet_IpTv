import {  currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateCurrentUser() {
  // RÉCUPÉRER L'UTILISATEUR CLERK ACTUEL
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("UNAUTHENTICATED");
  }

  const clerkId = clerkUser.id;
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    `${clerkId}@example.local`;

  // CHERCHER DANS LA DB
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // S'IL N'EXISTE PAS, ON LE CRÉE
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
        // ROLE USER PAR DÉFAUT
      },
    });
  }

  return user;
}
