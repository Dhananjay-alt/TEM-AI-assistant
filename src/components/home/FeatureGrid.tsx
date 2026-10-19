import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Atom,
  Eye,
  Award,
  Compass,
  HelpCircle,
  ArrowUpRight,
  Network,
  BookOpen,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";

export function FeatureGrid() {
  const features = [
    {
      num: "01",
      title: "ASK CARTER",
      subtitle: "Textbook-Grounded AI Assistant",
      description:
        "Directly query David B. Williams & C. Barry Carter's classic TEM textbook. Strict grounded answers, pedagogical step-by-step Tutor mode, and zero hallucinated citations.",
      href: "/ask",
      accent: "hover:border-[#FF5722]",
      badge: "CARTER RAG",
      badgeColor: "bg-[#FF5722] text-white",
      icon: <MessageSquare className="w-5 h-5 text-[#FF5722]" />,
    },
    {
      num: "02",
      title: "TEM LAB",
      subtitle: "Interactive Scientific Simulations",
      description:
        "Relativistic electron de Broglie wavelength calculator, SAED single-crystal & polycrystalline ring diffraction generator, and interactive BF/DF ray diagrams.",
      href: "/simulator",
      accent: "hover:border-[#00D2FF]",
      badge: "RELATIVISTIC PHYSICS",
      badgeColor: "bg-[#00D2FF] text-foreground",
      icon: <Atom className="w-5 h-5 text-[#0284C7]" />,
    },
    {
      num: "03",
      title: "IMAGE ANALYSIS",
      subtitle: "Micrograph Particle & Vision Lab",
      description:
        "Upload TEM micrographs or test Au nanoparticles and Si lattice fringes. Connected-component particle size distribution histograms and AI vision with strict Observed vs Interpreted separation.",
      href: "/image-analysis",
      accent: "hover:border-[#10B981]",
      badge: "COMPUTER VISION",
      badgeColor: "bg-[#10B981] text-white",
      icon: <Eye className="w-5 h-5 text-[#10B981]" />,
    },
    {
      num: "04",
      title: "EXAM MODE",
      subtitle: "Materials Science Exam Prep",
      description:
        "Test yourself against university marking rubrics: 2-mark concise definitions, 5-mark derivations (R*d = lambda*L), 10-mark contrast comparisons, and oral Viva Voce traps.",
      href: "/exam",
      accent: "hover:border-[#F59E0B]",
      badge: "RUBRICS & VIVA",
      badgeColor: "bg-[#F59E0B] text-foreground",
      icon: <Award className="w-5 h-5 text-[#D97706]" />,
    },
    {
      num: "05",
      title: "TECHNIQUE GUIDE",
      subtitle: "Choose the Right TEM Method",
      description:
        "Interactive decision tree: match your materials problem (defects, composition, lattice fringes, or morphology) to BF, DF, HRTEM, SAED, STEM-HAADF, EDS, or EELS.",
      href: "/technique-guide",
      accent: "hover:border-[#8B5CF6]",
      badge: "DECISION MATRIX",
      badgeColor: "bg-[#8B5CF6] text-white",
      icon: <Compass className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      num: "06",
      title: "TROUBLESHOOT",
      subtitle: "Diagnose Experimental Problems",
      description:
        "Sitting at the microscope facing poor contrast, hydrocarbon contamination, sample drift, or astigmatism? Step-by-step laboratory corrective procedures grounded in Carter.",
      href: "/troubleshooter",
      accent: "hover:border-[#EF4444]",
      badge: "COLUMN DIAGNOSTICS",
      badgeColor: "bg-[#EF4444] text-white",
      icon: <HelpCircle className="w-5 h-5 text-[#EF4444]" />,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="border-b-[3px] border-[#0F172A] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase text-[#FF5722] tracking-widest flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 bg-[#FF5722]"></span>
              LABORATORY MODULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-foreground uppercase">
              NOT A CHATBOT. A COMPLETE TEM WORKSTATION.
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-600 max-w-sm">
            Designed with the tactile clarity of physical laboratory instruments and the analytical rigor of Williams & Carter.
          </p>
        </div>

        {/* The 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link key={f.num} href={f.href} className="group block h-full">
              <BrutalCard
                variant="default"
                shadowSize="md"
                className={`h-full flex flex-col justify-between transition-all duration-150 ${f.accent} group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-neo-lg bg-white`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-slate-400 group-hover:text-foreground transition-colors">
                      {f.num} /
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase border border-border ${f.badgeColor}`}
                    >
                      {f.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {f.icon}
                      <h3 className="text-xl font-black font-sans tracking-tight text-foreground uppercase">
                        {f.title}
                      </h3>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-700">
                      {f.subtitle}
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t-2 border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-foreground group-hover:text-[#FF5722] transition-colors">
                  <span>ENTER MODULE</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </BrutalCard>
            </Link>
          ))}
        </div>

        {/* Secondary Modules: Knowledge Map & Carter Reader */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Link href="/knowledge-map" className="group block">
            <div className="brutal-border bg-[#F4EFE6] p-5 brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 brutal-border bg-foreground text-background flex items-center justify-center">
                  <Network className="w-5 h-5 text-[#00D2FF]" />
                </div>
                <div>
                  <div className="font-sans font-black text-sm uppercase text-foreground">
                    INTERACTIVE CONCEPT MAP
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    Explore relationships between reciprocal space, Ewald sphere & contrast
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-foreground" />
            </div>
          </Link>

          <Link href="/learn" className="group block">
            <div className="brutal-border bg-[#F4EFE6] p-5 brutal-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 brutal-border bg-foreground text-background flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#FF5722]" />
                </div>
                <div>
                  <div className="font-sans font-black text-sm uppercase text-foreground">
                    CARTER TEXTBOOK READER
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    Browse all chapters, formulas, ray diagrams & grounded excerpts
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-foreground" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
