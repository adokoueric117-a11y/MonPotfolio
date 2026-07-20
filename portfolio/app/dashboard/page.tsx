import { prisma } from "@/lib/db";
import { Zap } from "lucide-react";
import DashboardTabs from "@/components/DashboardTabs";
import { requireAdmin } from "@/lib/auth";

export default async function Dashboard() {
  await requireAdmin();
  const [presentation, experiences, projets, formations] = await Promise.all([
    prisma.presentation.findFirst(),
    prisma.experiences.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.projets.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.formations.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F0EDE8]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8A33D] to-[#E1614F] flex items-center justify-center">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <div>
              <p className="font-mono text-xs text-[#8B92A9] tracking-widest uppercase">
                Dashboard
              </p>
              <h1 className="font-display text-lg leading-tight">
                Portfolio Admin
              </h1>
            </div>
          </div>

          <a
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-[#8B92A9] hover:text-[#E8A33D] transition-colors border border-white/8 hover:border-[#E8A33D]/30 px-4 py-2 rounded-lg"
          >
            ← Voir le portfolio
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <DashboardTabs
          initialPresentation={presentation}
          initialExperiences={experiences}
          initialProjets={projets}
          initialFormations={formations}
        />
      </main>
    </div>
  );
}
