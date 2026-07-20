import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ExperiencesSection from "@/components/sections/Experiences";
import ProjetsSection from "@/components/sections/Projets";
import FormationsSection from "@/components/sections/Formations";
import ProjectContactForm from "@/components/ProjectContactForm";
import { GitBranch, Link2, Mail, MapPin, Zap } from "lucide-react";

export default async function Page() {
  const [presentation, experiences, projets, formations] = await Promise.all([
    prisma.presentation.findFirst(),
    prisma.experiences.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.projets.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.formations.findMany(),
  ]);

  return (
    <main>
      <Navbar />
      <Hero data={presentation} />
      <ExperiencesSection data={experiences} />
      <ProjetsSection data={projets} />
      <FormationsSection data={formations} />
      <ProjectContactForm />

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="relative py-16 border-t border-white/5 overflow-hidden">
        {/* Subtle orb */}
        <div className="orb orb-orange absolute left-1/2 -translate-x-1/2 -top-20 w-[400px] h-[200px] opacity-10" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8A33D] to-[#E1614F] flex items-center justify-center shadow-lg">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0EDE8]">
                  Eric<span className="text-[#E8A33D]">.</span>dev
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={10} className="text-[#8B92A9]" />
                  <p className="text-xs text-[#8B92A9]">Lomé, Togo</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 hover:border-[#E8A33D]/30 hover:bg-[#E8A33D]/5 flex items-center justify-center text-[#8B92A9] hover:text-[#E8A33D] transition-all duration-300"
                aria-label="GitHub"
              >
                <GitBranch size={17} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 hover:border-[#4A9EFF]/30 hover:bg-[#4A9EFF]/5 flex items-center justify-center text-[#8B92A9] hover:text-[#4A9EFF] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Link2 size={17} />
              </a>
              <a
                href="mailto:eric@example.com"
                className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 hover:border-[#E1614F]/30 hover:bg-[#E1614F]/5 flex items-center justify-center text-[#8B92A9] hover:text-[#E1614F] transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>

            {/* Copyright */}
            <p className="font-mono text-xs text-[#8B92A9]">
              © {new Date().getFullYear()} Eric Adokou
            </p>
          </div>

          {/* Dawn line at very bottom */}
          <div className="mt-10 h-px dawn-line opacity-30" />
        </div>
      </footer>
    </main>
  );
}