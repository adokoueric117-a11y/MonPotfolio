"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";
import type { Projets } from "@/generated/prisma/client";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProjetsSection({ data }: { data: Projets[] }) {
  return (
    <section
      id="projets"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080C14 0%, #0A0F1C 50%, #080C14 100%)" }}
    >
      {/* Orb */}
      <div className="orb orb-orange absolute right-0 top-1/3 w-[500px] h-[500px] opacity-20" />

      {/* Separator */}
      <div className="absolute top-0 left-0 right-0 h-px dawn-line opacity-30" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Réalisations</p>
          <h2 className="font-display text-4xl md:text-5xl">
            Mes <span className="gradient-text">Projets</span>
          </h2>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <Layers size={40} className="mx-auto mb-4 text-[#8B92A9] opacity-40" />
            <p className="text-[#8B92A9] font-mono text-sm">
              — aucun projet ajouté pour le moment —
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-2 gap-6"
          >
            {data.map((p, i) => (
              <motion.article
                key={p.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                {p.imageUrl ? (
                  <div className="relative w-full h-52 overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.titre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                    {/* Index badge */}
                    <span className="absolute top-4 left-4 font-mono text-xs text-[#8B92A9] bg-[#080C14]/70 px-2 py-1 rounded-md border border-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ) : (
                  /* Placeholder when no image */
                  <div className="w-full h-40 bg-gradient-to-br from-[#111827] to-[#0A0F1C] flex items-center justify-center border-b border-white/5">
                    <Layers size={32} className="text-[#8B92A9] opacity-30" />
                    <span className="absolute top-4 left-4 font-mono text-xs text-[#8B92A9]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-xl text-[#F0EDE8] group-hover:text-[#E8A33D] transition-colors">
                      {p.titre}
                    </h3>
                    <ExternalLink
                      size={16}
                      className="text-[#8B92A9] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-sm text-[#8B92A9] leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px dawn-line opacity-20" />
    </section>
  );
}