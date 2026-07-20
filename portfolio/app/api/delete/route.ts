import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
  if (!isSameOrigin(req)) return NextResponse.json({ success: false, message: "Origine de la requête invalide" }, { status: 403 });
  try {
    const { model, id } = await req.json();
    if (!model || !id) {
      return NextResponse.json(
        { success: false, message: "Modèle ou ID manquant" },
        { status: 400 }
      );
    }

    const targetId = Number(id);
    if (!Number.isSafeInteger(targetId) || targetId < 1) return NextResponse.json({ success: false, message: "ID invalide" }, { status: 400 });

    if (model === "experiences") {
      await prisma.experiences.delete({ where: { id: targetId } });
    } else if (model === "projets") {
      await prisma.projets.delete({ where: { id: targetId } });
    } else if (model === "formations") {
      await prisma.formations.delete({ where: { id: targetId } });
    } else if (model === "presentation") {
      await prisma.presentation.delete({ where: { id: targetId } });
    } else {
      return NextResponse.json(
        { success: false, message: "Modèle invalide" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Supprimé avec succès" });
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
