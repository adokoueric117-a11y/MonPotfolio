"use client";

import { FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function ProjectContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const project = String(formData.get("project") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const message = `Bonjour, je m'appelle ${name}.\n\nJe souhaite démarrer le projet : ${project}.\n\nDescription : ${description}`;

    window.open(`https://wa.me/22871757964?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="relative border-t border-white/5 py-20 overflow-hidden">
      <div className="orb orb-blue absolute right-0 top-0 w-80 h-80 opacity-20" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-9">
          <p className="section-label mb-3">Nouveau projet</p>
          <h2 className="font-display text-3xl sm:text-4xl">Une idée à concrétiser ?</h2>
          <p className="mt-3 text-[#8B92A9]">Décrivez votre besoin et démarrez la discussion directement sur WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2"><label htmlFor="name" className="text-sm text-[#F0EDE8]">Votre nom</label><input id="name" name="name" required maxLength={100} className="input-dark" placeholder="Votre nom complet" /></div>
            <div className="space-y-2"><label htmlFor="project" className="text-sm text-[#F0EDE8]">Nom du projet</label><input id="project" name="project" required maxLength={150} className="input-dark" placeholder="Ex. Application de réservation" /></div>
          </div>
          <div className="space-y-2"><label htmlFor="description" className="text-sm text-[#F0EDE8]">Description</label><textarea id="description" name="description" required maxLength={1500} rows={5} className="input-dark resize-y" placeholder="Objectifs, fonctionnalités souhaitées, délai…" /></div>
          <button type="submit" className="btn-primary w-full sm:w-auto"><MessageCircle size={17} /> Démarrer sur WhatsApp <Send size={15} /></button>
        </form>
      </div>
    </section>
  );
}
