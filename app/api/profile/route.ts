// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getOrCreateCurrentUser();

    // On renvoie seulement les infos utiles au profil
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      displayName: user.displayName ?? "",
      avatarUrl: user.avatarUrl ?? "",
    });
  } catch (err) {
    console.error("Erreur GET /api/profile :", err);
    return NextResponse.json(
      { error: "Impossible de charger le profil" },
      { status: 500 }
    );
  }
}

type ProfileBody = {
  displayName?: string;
  avatarUrl?: string | null;
};

export async function PATCH(req: Request) {
  try {
    const user = await getOrCreateCurrentUser();

    const body = (await req.json()) as ProfileBody;
    const { displayName, avatarUrl } = body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        // on n’oblige pas à remplir, on met à jour seulement si fourni
        ...(displayName !== undefined && { displayName }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt,
        displayName: updated.displayName ?? "",
        avatarUrl: updated.avatarUrl ?? "",
      },
    });
  } catch (err) {
    console.error("Erreur PATCH /api/profile :", err);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le profil" },
      { status: 500 }
    );
  }
}
