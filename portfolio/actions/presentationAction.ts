"use server"

import { prisma } from "@/lib/db";
import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

//Action pour la presentation
 export type ActionState = {
    success: boolean;
    message: string
 }

 export async function PresentationAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
   await requireAdmin();
   
   const nom = formData.get('nom')?.toString().trim() as string
   const prenom = formData.get('prenom')?.toString().trim() as string
   const profession = formData.get('profession')?.toString().trim() as string
   const image = formData.get('image') as File

       if (!nom || !prenom || !profession) {
        return{
            success: false,
            message: "Les champs nom prénom et profession sont obligatoires"
        }
    }

   let imageUrl: string | undefined
   if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`
    const {data, error} = await getSupabase().storage
    .from('portfolio_img')
    .upload(fileName, image)
    if(error){
      return{
         success: false,
         message: "erreur lors du téléchargement de l'image"
      }
    }
    const {data: publicUrlData} = getSupabase().storage
   .from('portfolio_img')
.getPublicUrl(data.path)   
    imageUrl = publicUrlData.publicUrl
}

   try{
      await prisma.presentation.create({
         data:{
            nom: nom,
            prenom: prenom,
            profession: profession,
            imageUrl: imageUrl
         }
      })
      revalidatePath('/')
      return{
         success: true,
         message: "presentation créee"
      }
   }catch{
      console.log()
      return{
         success: false,
         message: "Erreur lors de la création de la présentation"
      }
   }

 }