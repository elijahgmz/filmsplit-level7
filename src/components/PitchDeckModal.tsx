import React, { useState } from "react";
import { Presentation, ChevronLeft, ChevronRight, Download, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface PitchDeckModalProps {
  onClose: () => void;
}

const SLIDES = [
  {
    title: "1. Executive Summary & Vision",
    subtitle: "FilmSplit — Automatic, Permissionless & Immutable Film Revenue Sharing on Stellar Soroban",
    content: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-300">
        <p className="text-sm font-semibold text-white">
          Eliminating "Hollywood Accounting" by automating royalty distributions and milestone escrow funding for creators worldwide.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">Soroban Contracts</span>
            <span>Immutable basis-point splits (10,000 BPS = 100%)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Atomic Distributions</span>
            <span>Instant payouts to 20+ crew members in 1 transaction</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Stellar Anchors</span>
            <span>Local fiat bank/cash payouts via MoneyGram & SEP-24</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2. The Industry Problem",
    subtitle: "Hollywood Accounting, Opacity & Slow International Payroll",
    content: (
      <div className="space-y-3 text-xs leading-relaxed text-slate-300">
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
          <strong className="block text-white mb-1">Opaque Revenue Auditing</strong>
          <span>Independent filmmakers and cast members face accounting opacity from traditional film distributors, leading to trust issues and unpaid backend points.</span>
        </div>
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
          <strong className="block text-white mb-1">Slow International Wire Fees</strong>
          <span>Wiring revenue shares to 20+ global crew members takes weeks and incurs $30+ wire fees per transfer.</span>
        </div>
      </div>
    ),
  },
  {
    title: "3. Technical Architecture & Stellar Stack",
    subtitle: "End-to-End On-Chain Flow on Stellar Testnet",
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-[11px] leading-normal text-indigo-300">
          [Filmmakers] &rarr; [Next.js + Tailwind UI] &rarr; [Stellar Wallets Kit]<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Simulation &amp; Signature<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[FilmSplit Contract: CAK36...YL5I3]<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Atomic Payment<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[SEP-24 Anchors / MoneyGram Cash Out]
        </div>
        <p className="text-[11px] text-slate-400">
          Smart contracts handle `create_project`, `distribute_revenue`, `add_collaborator`, `remove_collaborator`, and `dispute_project`.
        </p>
      </div>
    ),
  },
  {
    title: "4. Traction & 50+ User Proof (Level 5)",
    subtitle: "Validated User Growth & Real Transaction Activity",
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-xl font-extrabold text-indigo-400 block">50 Users</span>
            <span className="text-[11px] text-slate-400">Onboarded & verified crew testnet accounts</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xl font-extrabold text-emerald-400 block">5.0 / 5.0</span>
            <span className="text-[11px] text-slate-400">Usability rating across 50 feedback responses</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          Exported user feedback CSV (`user_feedback_level5.csv`) is linked in the README and available for download in-app.
        </p>
      </div>
    ),
  },
  {
    title: "5. Roadmap & Ecosystem Vision",
    subtitle: "From Testnet MVP to Global Mainnet Standard",
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <strong className="text-indigo-400 block mb-0.5">Q3 2026: Mainnet Deployment & Audit</strong>
          <span>Audit Soroban Rust contracts & launch on Stellar Mainnet with real USDC.</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <strong className="text-amber-400 block mb-0.5">Q4 2026: MoneyGram Native Widget</strong>
          <span>Direct cash-out flow built into the FilmSplit crew dashboard.</span>
        </div>
      </div>
    ),
  },
];

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Presentation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">FilmSplit Level 5 Pitch Deck</h2>
              <p className="text-xs text-slate-400">Presentation & Investor Slide Deck</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Slide Content */}
        <div className="min-h-[220px] mb-8">
          <div className="mb-4">
            <h3 className="text-base font-bold text-amber-400">{slide.title}</h3>
            <p className="text-xs text-slate-400">{slide.subtitle}</p>
          </div>
          {slide.content}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-xs text-slate-500 font-mono">
            Slide {currentSlide + 1} of {SLIDES.length}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 transition-all text-xs font-semibold flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDES.length - 1, prev + 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 disabled:opacity-30 transition-all text-xs font-bold flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
