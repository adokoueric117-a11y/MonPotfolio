"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronDown, Folder } from "lucide-react";
import type { Presentation } from "@/generated/prisma/client";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ data }: { data: Presentation | null }) {
  return (
    <section
      id="presentation"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden"
    >
      {/* Background orbs */}
      <div className="orb orb-blue absolute -top-40 -left-40 w-[700px] h-[700px] opacity-50" />
      <div className="orb orb-orange absolute top-1/4 -right-60 w-[600px] h-[600px] opacity-40" />
      <div className="orb orb-red absolute bottom-0 left-1/3 w-[500px] h-[500px] opacity-30" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="grid md:grid-cols-[1fr_380px] gap-16 items-center">
          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <span className="badge-available text-xs">
                Disponible pour projets
              </span>
            </motion.div>

            {/* Sub-label */}
            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="section-label mb-4"
            >
              Les codeurs de l&apos;aube — Lomé, Togo
            </motion.p>

            {/* Headline */}
            {data ? (
              <>
                <motion.h1
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-5xl md:text-7xl leading-[1.05] mb-4 tracking-tight"
                >
                  {data.prenom}
                  <br />
                  <span className="gradient-text">{data.nom}</span>
                </motion.h1>
                <motion.p
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-lg md:text-xl text-[#8B92A9] max-w-md mb-10 leading-relaxed"
                >
                  {data.profession}
                </motion.p>
              </>
            ) : (
              <>
                <motion.h1
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-5xl md:text-7xl leading-[1.05] mb-4 tracking-tight"
                >
                  Ton nom
                  <br />
                  <span className="gradient-text">ici</span>
                </motion.h1>
                <motion.p
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-lg text-[#8B92A9] max-w-md mb-10"
                >
                  Ajoute ta présentation via le dashboard pour qu&apos;elle
                  apparaisse ici.
                </motion.p>
              </>
            )}

            {/* CTAs */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <a href="#projets" className="btn-primary">
                Voir mes projets
                <ArrowUpRight size={16} />
              </a>
              <a href="#experiences" className="btn-ghost">
                <Folder size={16} />
                Expériences
              </a>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-16 flex items-center gap-8"
            >
              <div>
                <p className="font-display text-3xl font-semibold text-[#F0EDE8]">
                  3+
                </p>
                <p className="text-xs text-[#8B92A9] font-mono tracking-wide mt-0.5">
                  Années d&apos;exp.
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="font-display text-3xl font-semibold text-[#F0EDE8]">
                  20+
                </p>
                <p className="text-xs text-[#8B92A9] font-mono tracking-wide mt-0.5">
                  Projets livrés
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="font-display text-3xl font-semibold text-[#F0EDE8]">
                  100%
                </p>
                <p className="text-xs text-[#8B92A9] font-mono tracking-wide mt-0.5">
                  Clients satisfaits
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — photo */}
          {data?.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden md:flex justify-center"
            >
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E8A33D]/20 to-[#E1614F]/10 blur-3xl scale-110" />
              <div className="relative w-80 h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 dawn-line opacity-30 blur-2xl" />
                <Image
                  src={data.imageUrl}
                  alt={`Photo de ${data.prenom} ${data.nom}`}
                  fill
                  sizes="(max-width: 768px) 0px, 320px"
                  className="object-cover relative z-10"
                  priority
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#080C14]/60 to-transparent z-20" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl border border-white/8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4AFF80] shadow-[0_0_6px_#4AFF80]" />
                  <span className="text-xs font-mono text-[#F0EDE8]">
                    Open to work
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8B92A9]"
      >
        <span className="font-mono text-xs tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      {/* Bottom dawn line */}
      <div className="absolute bottom-0 left-0 right-0 h-px dawn-line opacity-40" />
    </section>
  );
}