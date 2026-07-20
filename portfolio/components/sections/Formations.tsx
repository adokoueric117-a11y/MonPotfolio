"use client";

import { motion, type Variants } from "framer-motion";
import { GraduationCap, Clock } from "lucide-react";
import type { Formations } from "@/generated/prisma/client";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FormationsSection({ data }: { data: Formations[] }) {
  return (
    <section id="formations" className="py-28 relative overflow-hidden">
      {/* Orb */}
      <div className="orb orb-red absolute left-1/2 -top-20 w-[600px] h-[400px] opacity-15" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Éducation</p>
          <h2 className="font-display text-4xl md:text-5xl">
            Mes <span className="gradient-text">Formations</span>
          </h2>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <GraduationCap size={40} className="mx-auto mb-4 text-[#8B92A9] opacity-40" />
            <p className="text-[#8B92A9] font-mono text-sm">
              — aucune formation ajoutée pour le moment —
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-4"
          >
            {data.map((f, i) => (
              <motion.div
                key={f.id}
                variants={rowVariants}
                whileHover={{ x: 4 }}
                className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 group transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A33D]/20 to-[#E1614F]/10 border border-[#E8A33D]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap size={18} className="text-[#E8A33D]" />
                  </div>

                  <div>
                    <h3 className="font-display text-xl text-[#F0EDE8] group-hover:text-[#E8A33D] transition-colors mb-1">
                      {f.nom}
                    </h3>
                    <p className="text-sm text-[#8B92A9]">{f.etablissement}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:ml-auto">
                  <Clock size={13} className="text-[#8B92A9]" />
                  <span className="font-mono text-xs text-[#8B92A9] bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                    {f.duree}
                  </span>
                  {/* Index */}
                  <span className="font-mono text-xs text-[#E8A33D]/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}