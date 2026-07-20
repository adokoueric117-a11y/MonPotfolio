"use client";

import { useActionState, useState, useEffect } from "react";
import { AddExperienceAction } from "@/actions/experienceAction";
import { type ActionState } from "@/actions/presentationAction";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { Experiences } from "@/generated/prisma/client";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function ExperienceForm({
  editData,
  onCancelEdit,
}: {
  editData?: Experiences | null;
  onCancelEdit?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(AddExperienceAction, initialState);
  
  // Custom API handler state for updating
  const [customPending, setCustomPending] = useState(false);
  const [customFeedback, setCustomFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const isEditing = !!editData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isEditing) return; // Let default action handle creation
    e.preventDefault();

    setCustomPending(true);
    setCustomFeedback(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.append("model", "experiences");
      formData.append("id", String(editData.id));

      const res = await fetch("/api/update", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCustomFeedback({
        success: data.success,
        message: data.message || (data.success ? "Expérience mise à jour" : "Erreur lors de la mise à jour"),
      });

      if (data.success) {
        router.refresh();
        if (onCancelEdit) onCancelEdit();
      }
    } catch (err) {
      console.error(err);
      setCustomFeedback({
        success: false,
        message: "Une erreur réseau est survenue",
      });
    } finally {
      setCustomPending(false);
    }
  };

  const pending = isPending || customPending;
  const feedback = customFeedback || (state.message ? { success: state.success, message: state.message } : null);

  return (
    <form onSubmit={handleSubmit} action={isEditing ? undefined : formAction} className="space-y-5">
      {/* Titre */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <FileText size={12} className="text-[#E8A33D]" />
          Titre du poste / Entreprise
        </label>
        <input
          type="text"
          name="titre"
          key={editData?.id ? `titre-${editData.id}` : "titre-new"}
          className="input-dark"
          placeholder="Ex: Développeur Frontend chez XYZ"
          defaultValue={editData?.Titre || ""}
          required
        />
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <ImageIcon size={12} className="text-[#E8A33D]" />
          Illustration (optionnel)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="input-dark text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-white/10 file:text-[#F0EDE8] file:cursor-pointer hover:file:bg-white/15 file:transition-colors"
        />
        {editData?.imageUrl && (
          <p className="text-xs text-[#8B92A9]">
            Image actuelle : <a href={editData.imageUrl} target="_blank" rel="noreferrer" className="text-[#E8A33D] hover:underline">Voir l&apos;image</a>
          </p>
        )}
        <p className="text-xs text-[#8B92A9]/60">JPG, PNG, WEBP — max 5Mo</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary flex-1 justify-center"
        >
          {pending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {isEditing ? "Enregistrement…" : "Ajout en cours…"}
            </>
          ) : (
            isEditing ? "Enregistrer les modifications" : "Ajouter l'expérience"
          )}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-ghost"
          >
            Annuler
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm border ${
            feedback.success
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {feedback.success ? (
            <CheckCircle size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          {feedback.message}
        </div>
      )}
    </form>
  );
}
