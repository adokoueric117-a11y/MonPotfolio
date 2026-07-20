"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import type { Experiences } from "@/generated/prisma/client";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExperiencesSection({ data }: { data: Experiences[] }) {
  return (
    <section id="experiences" className="py-28 relative overflow-hidden">
      {/* Subtle orb */}
      <div className="orb orb-blue absolute -left-40 top-1/2 w-[500px] h-[500px] opacity-20" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Parcours</p>
          <h2 className="font-display text-4xl md:text-5xl">
            Mes{" "}
            <span className="gradient-text">Expériences</span>
          </h2>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <Briefcase size={40} className="mx-auto mb-4 text-[#8B92A9] opacity-40" />
            <p className="text-[#8B92A9] font-mono text-sm">
              — aucune expérience ajoutée pour le moment —
            </p>
          </motion.div>
        ) : (
          <motion.ol
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative pl-8"
          >
            {/* Timeline line */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#E8A33D]/50 via-[#E1614F]/30 to-transparent" />

            {data.map((exp, i) => (
              <motion.li
                key={exp.id}
                variants={itemVariants}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline dot */}
                <span className="absolute -left-[37px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#E8A33D] shadow-[0_0_10px_rgba(232,163,61,0.6)] border-2 border-[#080C14]" />

                <div className="glass-card rounded-2xl p-6 hover:border-[#E8A33D]/20 transition-all duration-300 group">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={13} className="text-[#E8A33D]" />
                    <span className="font-mono text-xs text-[#8B92A9]">
                      {new Date(exp.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="ml-auto text-xs font-mono text-[#E8A33D] opacity-0 group-hover:opacity-100 transition-opacity">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl mb-4 text-[#F0EDE8]">
                    {exp.Titre}
                  </h3>

                  {/* Image */}
                  {exp.imageUrl && (
                    <div className="relative w-full max-w-lg h-52 rounded-xl overflow-hidden border border-white/5">
                      <Image
                        src={exp.imageUrl}
                        alt={exp.Titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080C14]/40 to-transparent" />
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        )}
      </div>
    </section>
  );
}