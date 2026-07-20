import { loginAction } from "@/actions/authAction";
import { isAdmin } from "@/lib/auth";
import { LockKeyhole, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Connexion({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  if (await isAdmin()) redirect("/dashboard");
  const { erreur } = await searchParams;

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <section className="w-full max-w-md glass-card rounded-2xl p-7 sm:p-9 border border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A33D] to-[#E1614F] flex items-center justify-center"><Zap size={19} className="text-white fill-white" /></div>
          <div><p className="font-mono text-xs text-[#8B92A9] tracking-widest uppercase">Espace privé</p><h1 className="font-display text-2xl">Connexion admin</h1></div>
        </div>
        <form action={loginAction} className="space-y-5">
          <div className="space-y-2"><label htmlFor="name" className="text-xs font-mono text-[#8B92A9] uppercase tracking-wide">Identifiant</label><input id="name" name="name" type="text" autoComplete="username" required maxLength={128} className="input-dark" /></div>
          <div className="space-y-2"><label htmlFor="password" className="text-xs font-mono text-[#8B92A9] uppercase tracking-wide">Mot de passe</label><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={512} className="input-dark" /></div>
          {erreur && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">Identifiants invalides.</p>}
          <button type="submit" className="btn-primary w-full justify-center"><LockKeyhole size={16} /> Se connecter</button>
        </form>
      </section>
    </main>
  );
}
