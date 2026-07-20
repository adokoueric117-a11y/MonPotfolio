"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Building2,
  Loader2,
} from "lucide-react";
import PresentationForm from "@/components/PresentationForm";
import ExperienceForm from "@/components/ExperienceForm";
import ProjetsForm from "@/components/ProjetsForm";
import FormationsForm from "@/components/FormationsForm";
import type { Presentation, Experiences, Projets, Formations } from "@/generated/prisma/client";

const tabs = [
  {
    id: "presentation",
    label: "Présentation",
    icon: User,
    description: "Profil & photo de couverture",
  },
  {
    id: "experience",
    label: "Expérience",
    icon: Briefcase,
    description: "Ajouter une expérience pro",
  },
  {
    id: "projet",
    label: "Projet",
    icon: Layers,
    description: "Showcase d'un projet",
  },
  {
    id: "formation",
    label: "Formation",
    icon: GraduationCap,
    description: "Diplôme ou certification",
  },
];

export default function DashboardTabs({
  initialPresentation,
  initialExperiences,
  initialProjets,
  initialFormations,
}: {
  initialPresentation: Presentation | null;
  initialExperiences: Experiences[];
  initialProjets: Projets[];
  initialFormations: Formations[];
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("presentation");
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#E8A33D]" />
      </div>
    );
  }

  const current = tabs.find((t) => t.id === active)!;
  const CurrentIcon = current.icon;

  const handleDelete = async (model: string, id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, id }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      setDeletingId(null);
    }
  };

  const getForm = (id: string) => {
    switch (id) {
      case "presentation":
        return <PresentationForm initialData={initialPresentation} />;
      case "experience":
        return (
          <ExperienceForm
            editData={editingItem?.type === "experience" ? editingItem.data : null}
            onCancelEdit={() => setEditingItem(null)}
          />
        );
      case "projet":
        return (
          <ProjetsForm
            editData={editingItem?.type === "projet" ? editingItem.data : null}
            onCancelEdit={() => setEditingItem(null)}
          />
        );
      case "formation":
        return (
          <FormationsForm
            editData={editingItem?.type === "formation" ? editingItem.data : null}
            onCancelEdit={() => setEditingItem(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-8">
      {/* Sidebar */}
      <aside>
        <p className="text-xs font-mono text-[#8B92A9] uppercase tracking-widest mb-4 px-2">
          Sections
        </p>
        <nav className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActive(tab.id);
                  setEditingItem(null); // Clear editing state when changing tabs
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-white/6 border border-white/10 text-[#F0EDE8]"
                    : "text-[#8B92A9] hover:text-[#F0EDE8] hover:bg-white/4 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-[#E8A33D] to-[#E1614F] rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-[#E8A33D]/20 to-[#E1614F]/10 border border-[#E8A33D]/20"
                      : "bg-white/5 border border-white/5 group-hover:bg-white/8"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[#E8A33D]" : "text-[#8B92A9]"} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{tab.label}</p>
                  <p className="text-xs text-[#8B92A9] truncate mt-0.5">{tab.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Hint */}
        <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/2">
          <p className="text-xs text-[#8B92A9] leading-relaxed">
            💡 Chaque formulaire enregistre les données directement dans ta base
            de données Supabase via Prisma.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active + (editingItem ? "-editing" : "-create")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Panel header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <CurrentIcon size={18} className="text-[#E8A33D]" />
                <h2 className="font-display text-2xl">
                  {editingItem ? `Modifier : ${editingItem.data.Titre || editingItem.data.titre || editingItem.data.nom}` : current.label}
                </h2>
              </div>
              <p className="text-sm text-[#8B92A9]">
                {editingItem ? "Modifiez les informations ci-dessous et enregistrez" : current.description}
              </p>
            </div>

            {/* Form card */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              {getForm(active)}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Existing items list */}
        {active !== "presentation" && (
          <div className="space-y-4">
            <h3 className="font-display text-xl border-b border-white/5 pb-2 text-[#F0EDE8]">
              Éléments existants
            </h3>

            {/* Experiences list */}
            {active === "experience" && (
              <div className="space-y-3">
                {initialExperiences.length === 0 ? (
                  <p className="text-[#8B92A9] text-sm font-mono">— Aucune expérience enregistrée —</p>
                ) : (
                  initialExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {exp.imageUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 border border-white/10">
                            <img src={exp.imageUrl} alt={exp.Titre} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-[#F0EDE8]">{exp.Titre}</h4>
                          <div className="flex items-center gap-1 text-xs text-[#8B92A9] mt-1">
                            <Calendar size={11} />
                            <span>
                              {new Date(exp.createdAt).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem({ type: "experience", data: exp })}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#E8A33D]/20 text-[#8B92A9] hover:text-[#E8A33D] transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete("experiences", exp.id)}
                          disabled={deletingId === exp.id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8B92A9] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === exp.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Projets list */}
            {active === "projet" && (
              <div className="space-y-3">
                {initialProjets.length === 0 ? (
                  <p className="text-[#8B92A9] text-sm font-mono">— Aucun projet enregistré —</p>
                ) : (
                  initialProjets.map((p) => (
                    <div
                      key={p.id}
                      className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {p.imageUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 border border-white/10">
                            <img src={p.imageUrl} alt={p.titre} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-[#F0EDE8]">{p.titre}</h4>
                          <p className="text-xs text-[#8B92A9] line-clamp-1 mt-1">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem({ type: "projet", data: p })}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#E8A33D]/20 text-[#8B92A9] hover:text-[#E8A33D] transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete("projets", p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8B92A9] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === p.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Formations list */}
            {active === "formation" && (
              <div className="space-y-3">
                {initialFormations.length === 0 ? (
                  <p className="text-[#8B92A9] text-sm font-mono">— Aucune formation enregistrée —</p>
                ) : (
                  initialFormations.map((f) => (
                    <div
                      key={f.id}
                      className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <GraduationCap size={18} className="text-[#E8A33D]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#F0EDE8]">{f.nom}</h4>
                          <div className="flex items-center gap-3 text-xs text-[#8B92A9] mt-1">
                            <span className="flex items-center gap-1">
                              <Building2 size={11} />
                              {f.etablissement}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {f.duree}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem({ type: "formation", data: f })}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#E8A33D]/20 text-[#8B92A9] hover:text-[#E8A33D] transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete("formations", f.id)}
                          disabled={deletingId === f.id}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#8B92A9] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === f.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
