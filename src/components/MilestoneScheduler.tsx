import React, { useState } from "react";
import { Lock, Unlock, CheckCircle2, ShieldCheck, Sparkles, Clock } from "lucide-react";

export interface Milestone {
  id: number;
  name: string;
  percentage: number; // e.g. 25%
  trancheXlm: number;
  status: "completed" | "active" | "locked";
  approvedBy: string;
}

const INITIAL_MILESTONES: Milestone[] = [
  { id: 1, name: "Pre-Production & Script Sign-off", percentage: 25, trancheXlm: 1250, status: "completed", approvedBy: "Executive Producer & Director" },
  { id: 2, name: "Principal Photography Wrap", percentage: 35, trancheXlm: 1750, status: "active", approvedBy: "Producer Multi-Sig" },
  { id: 3, name: "Post-Production & Picture Lock", percentage: 25, trancheXlm: 1250, status: "locked", approvedBy: "Lead Editor & Producer" },
  { id: 4, name: "Distribution Rights Delivery", percentage: 15, trancheXlm: 750, status: "locked", approvedBy: "Distribution Partner" },
];

export const MilestoneScheduler: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  const handleReleaseTranche = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) return { ...m, status: "completed" };
        if (m.id === id + 1 && m.status === "locked") return { ...m, status: "active" };
        return m;
      })
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 mb-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Production Escrow Tranche Release Scheduler</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 uppercase">
                Level 5 Escrow System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Investor capital locked in Soroban contract and released upon verified milestone completions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              m.status === "completed"
                ? "bg-emerald-950/20 border-emerald-500/30"
                : m.status === "active"
                ? "glass-panel-gold border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/40 border-slate-800 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Tranche #{m.id} • {m.percentage}%
                </span>
                {m.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : m.status === "active" ? (
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              <h4 className="text-sm font-bold text-white mb-2">{m.name}</h4>
              <p className="text-lg font-extrabold text-amber-400 font-mono mb-1">{m.trancheXlm} XLM</p>
              <p className="text-[11px] text-slate-400 italic">Signed: {m.approvedBy}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60">
              {m.status === "completed" ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Tranche Released</span>
                </span>
              ) : m.status === "active" ? (
                <button
                  onClick={() => handleReleaseTranche(m.id)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Sign & Release Tranche</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-medium">Locked until Tranche #{m.id - 1}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
