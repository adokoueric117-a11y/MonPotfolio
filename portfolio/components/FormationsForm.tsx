"use client";

import { useActionState, useState } from "react";
import { AddFormationAction } from "@/actions/formationAction";
import { type ActionState } from "@/actions/presentationAction";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { Formations } from "@/generated/prisma/client";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function FormationsForm({
  editData,
  onCancelEdit,
}: {
  editData?: Formations | null;
  onCancelEdit?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(AddFormationAction, initialState);
  
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
      formData.append("model", "formations");
      formData.append("id", String(editData.id));

      const res = await fetch("/api/update", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCustomFeedback({
        success: data.success,
        message: data.message || (data.success ? "Formation mise à jour" : "Erreur lors de la mise à jour"),
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
      {/* Nom de la formation */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <GraduationCap size={12} className="text-[#E8A33D]" />
          Nom de la formation
        </label>
        <input
          type="text"
          name="nom"
          key={editData?.id ? `nom-${editData.id}` : "nom-new"}
          className="input-dark"
          placeholder="Ex: Licence en Informatique"
          defaultValue={editData?.nom || ""}
          required
        />
      </div>

      {/* Établissement */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <Building2 size={12} className="text-[#E8A33D]" />
          Établissement
        </label>
        <input
          type="text"
          name="etablissement"
          key={editData?.id ? `etablissement-${editData.id}` : "etablissement-new"}
          className="input-dark"
          placeholder="Ex: Université de Lomé"
          defaultValue={editData?.etablissement || ""}
          required
        />
      </div>

      {/* Durée */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <Clock size={12} className="text-[#E8A33D]" />
          Durée / Période
        </label>
        <input
          type="text"
          name="duree"
          key={editData?.id ? `duree-${editData.id}` : "duree-new"}
          className="input-dark"
          placeholder="Ex: 2020 – 2023"
          defaultValue={editData?.duree || ""}
          required
        />
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
            isEditing ? "Enregistrer les modifications" : "Ajouter la formation"
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
