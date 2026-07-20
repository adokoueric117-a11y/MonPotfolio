"use server"
//Action pour ajouter une formation

import { ActionState } from "./presentationAction";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function AddFormationAction(prevState:ActionState, formData: FormData): Promise<ActionState> {
    await requireAdmin();

    const nom = formData.get('nom')?.toString().trim() as string
    const duree = formData.get('duree')?.toString().trim() as string
    const etablissement = formData.get('etablissement')?.toString().trim() as string

    //validation des données
    if (!nom || !duree || !etablissement) {
        return{
            success: false,
            message: "Les champs nom durée et établissement sont obligatoires"
        }
    }

    try{
        await prisma.formations.create({
            data: {
                nom: nom,
                duree: duree,
                etablissement: etablissement
            }
        })

        revalidatePath('/')
        return {
            success: true,
            message: "Formation ajoutée avec succès"
        }
    }catch(error){
        console.error(error)
        return{
            success: false,
            message: "Erreur lors de l'ajout de la formation"
        }

    }



}