"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const links = [
  { href: "#presentation", label: "Profil" },
  { href: "#experiences", label: "Expériences" },
  { href: "#projets", label: "Projets" },
  { href: "#formations", label: "Formations" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#presentation");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // Active section detection
      const sections = links.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#presentation"
            className="flex items-center gap-2 group"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E8A33D] to-[#E1614F] flex items-center justify-center shadow-lg">
              <Zap size={14} className="text-white fill-white" />
            </span>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0EDE8] group-hover:text-[#E8A33D] transition-colors">
              Eric<span className="text-[#E8A33D]">.</span>dev
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative px-4 py-2 text-sm rounded-lg transition-colors ${
                    active === l.href
                      ? "text-[#F0EDE8]"
                      : "text-[#8B92A9] hover:text-[#F0EDE8]"
                  }`}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white/5 rounded-lg border border-white/8"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Dashboard link */}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#F0EDE8] hover:bg-white/5 transition-colors"
            aria-label={open ? "Fermer menu" : "Ouvrir menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`py-3 px-4 rounded-lg text-sm transition-colors ${
                      active === l.href
                        ? "text-[#F0EDE8] bg-white/5"
                        : "text-[#8B92A9] hover:text-[#F0EDE8] hover:bg-white/3"
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 py-3 px-4 rounded-lg text-sm text-[#E8A33D] border border-[#E8A33D]/20 hover:bg-[#E8A33D]/5 transition-colors"
                >
                  Dashboard
                </a>
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Scroll progress bar */}
      <ScrollProgress />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          background: "linear-gradient(90deg, #E8A33D, #E1614F)",
          scaleX: progress / 100,
        }}
        transition={{ duration: 0 }}
      />
    </div>
  );
}