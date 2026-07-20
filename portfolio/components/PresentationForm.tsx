"use client";

import { type ActionState, PresentationAction } from "@/actions/presentationAction";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { Presentation } from "@/generated/prisma/client";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function PresentationForm({
  initialData,
}: {
  initialData?: Presentation | null;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(PresentationAction, initialState);
  
  // Custom API handler state for updating
  const [customPending, setCustomPending] = useState(false);
  const [customFeedback, setCustomFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!isEditing) return; // Let default action handle it
    e.preventDefault();

    setCustomPending(true);
    setCustomFeedback(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.append("model", "presentation");
      formData.append("id", String(initialData.id));

      const res = await fetch("/api/update", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCustomFeedback({
        success: data.success,
        message: data.message || (data.success ? "Profil mis à jour" : "Erreur lors de la mise à jour"),
      });

      if (data.success) {
        router.refresh();
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
      {/* Nom */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <User size={12} className="text-[#E8A33D]" />
          Nom
        </label>
        <input
          type="text"
          name="nom"
          className="input-dark"
          placeholder="Ex: Adokou"
          defaultValue={initialData?.nom || ""}
          required
        />
      </div>

      {/* Prénom */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <User size={12} className="text-[#E8A33D]" />
          Prénom
        </label>
        <input
          type="text"
          name="prenom"
          className="input-dark"
          placeholder="Ex: Eric"
          defaultValue={initialData?.prenom || ""}
          required
        />
      </div>

      {/* Profession */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <Briefcase size={12} className="text-[#E8A33D]" />
          Profession / Titre
        </label>
        <input
          type="text"
          name="profession"
          className="input-dark"
          placeholder="Ex: Développeur Full Stack"
          defaultValue={initialData?.profession || ""}
          required
        />
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] tracking-wide uppercase">
          <ImageIcon size={12} className="text-[#E8A33D]" />
          Photo de profil
        </label>
        <div className="relative">
          <input
            type="file"
            name="image"
            accept="image/*"
            className="input-dark text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-white/10 file:text-[#F0EDE8] file:cursor-pointer hover:file:bg-white/15 file:transition-colors"
          />
        </div>
        {initialData?.imageUrl && (
          <p className="text-xs text-[#8B92A9]">
            Photo actuelle : <a href={initialData.imageUrl} target="_blank" rel="noreferrer" className="text-[#E8A33D] hover:underline">Voir l&apos;image</a>
          </p>
        )}
        <p className="text-xs text-[#8B92A9]/60">JPG, PNG, WEBP — max 5Mo</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center mt-2"
      >
        {pending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            {isEditing ? "Enregistrement…" : "Création en cours…"}
          </>
        ) : (
          isEditing ? "Modifier le profil" : "Créer le profil"
        )}
      </button>

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