"use server"
//Action pour ajouter un projet

import { getSupabase } from "@/lib/supabase";
import { ActionState } from "./presentationAction";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function AddProjectAction(prevState:ActionState, formData: FormData): Promise<ActionState> {
    await requireAdmin();

    const titre = formData.get('titre')?.toString().trim() as string
    const description = formData.get('description')?.toString().trim()
    const image = formData.get('image') as File
        if (!titre || !description) {
        return{
            success: false,
            message: "Le champ titre et description sont obligatoires"
        }
    }

    let imageUrl: string | undefined

    if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`
    const {data,error} = await getSupabase().storage
    .from('portfolio_img')
    .upload(fileName, image)
    if (error) {
        return{
            success: false,
            message: "Erreur lors du chargement de l'image"
        }
    }
    const {data: publicUrlData} = getSupabase().storage
    .from('portfolio_img')
    .getPublicUrl(data.path)
    imageUrl = publicUrlData.publicUrl
    

    }
    try{
        await prisma.projets.create({
            data: {
                titre: titre,
                description: description,
                imageUrl: imageUrl
            }
        })

        revalidatePath('/')

        return{
            success: true,
            message: "Experience crée avec succès"
        }
        
    }catch(error){
        console.error(error)
        return{
            success: false,
            message: "Erreur lors de l'ahout d'expérience"
        }
    }
    

}