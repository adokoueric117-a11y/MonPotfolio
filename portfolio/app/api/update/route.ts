import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
  if (!isSameOrigin(req)) return NextResponse.json({ success: false, message: "Origine de la requête invalide" }, { status: 403 });
  try {
    const formData = await req.formData();
    const model = formData.get("model")?.toString();
    const idStr = formData.get("id")?.toString();

    if (!model || !idStr) {
      return NextResponse.json(
        { success: false, message: "Modèle ou ID manquant" },
        { status: 400 }
      );
    }

    const id = Number(idStr);
    if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ success: false, message: "ID invalide" }, { status: 400 });
    const image = formData.get("image") as File | null;
    let imageUrl: string | undefined;

    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("portfolio_img")
        .upload(fileName, image);
      if (error) {
        return NextResponse.json(
          { success: false, message: "Erreur lors du téléchargement de l'image" },
          { status: 500 }
        );
      }
      const { data: publicUrlData } = supabase.storage
        .from("portfolio_img")
        .getPublicUrl(data.path);
      imageUrl = publicUrlData.publicUrl;
    }

    if (model === "experiences") {
      const titre = formData.get("titre")?.toString();
      if (!titre) {
        return NextResponse.json({ success: false, message: "Titre manquant" }, { status: 400 });
      }

      const updateData: any = { Titre: titre };
      if (imageUrl) updateData.imageUrl = imageUrl;

      await prisma.experiences.update({
        where: { id },
        data: updateData,
      });
    } else if (model === "projets") {
      const titre = formData.get("titre")?.toString();
      const description = formData.get("description")?.toString();
      if (!titre || !description) {
        return NextResponse.json(
          { success: false, message: "Titre ou description manquant" },
          { status: 400 }
        );
      }

      const updateData: any = { titre, description };
      if (imageUrl) updateData.imageUrl = imageUrl;

      await prisma.projets.update({
        where: { id },
        data: updateData,
      });
    } else if (model === "formations") {
      const nom = formData.get("nom")?.toString();
      const duree = formData.get("duree")?.toString();
      const etablissement = formData.get("etablissement")?.toString();
      if (!nom || !duree || !etablissement) {
        return NextResponse.json(
          { success: false, message: "Champs requis manquants" },
          { status: 400 }
        );
      }

      await prisma.formations.update({
        where: { id },
        data: { nom, duree, etablissement },
      });
    } else if (model === "presentation") {
      const nom = formData.get("nom")?.toString();
      const prenom = formData.get("prenom")?.toString();
      const profession = formData.get("profession")?.toString();
      if (!nom || !prenom || !profession) {
        return NextResponse.json(
          { success: false, message: "Champs requis manquants" },
          { status: 400 }
        );
      }

      const updateData: any = { nom, prenom, profession };
      if (imageUrl) updateData.imageUrl = imageUrl;

      await prisma.presentation.update({
        where: { id },
        data: updateData,
      });
    } else {
      return NextResponse.json({ success: false, message: "Modèle invalide" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Modifié avec succès" });
  } catch (error: any) {
    console.error("Update API error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}
