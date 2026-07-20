import React, { useState } from "react";
import { Zap, ShieldCheck, CheckCircle2, Sparkles, DollarSign } from "lucide-react";

export const FeeSponsorshipWidget: React.FC = () => {
  const [sponsorshipActive, setSponsorshipActive] = useState(true);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl mb-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Stellar Fee Sponsorship (Gasless FeeBump Transactions)</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 uppercase">
                Level 6 Gasless Feature
              </span>
            </div>
            <p className="text-xs text-slate-400">
              FilmSplit protocol sponsors transaction fees for crew members receiving royalty payouts
            </p>
          </div>
        </div>

        <button
          onClick={() => setSponsorshipActive(!sponsorshipActive)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            sponsorshipActive
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {sponsorshipActive ? "Sponsorship Enabled" : "Sponsorship Disabled"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fee Sponsor Account</span>
          <span className="text-xs font-mono text-emerald-400 font-bold">GBSP...SPONSOR_VAULT</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Sponsored Transactions</span>
          <span className="text-sm font-extrabold text-white">1,420 Txns (0 XLM Crew Cost)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">FeeBump Envelope Status</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active & Ready</span>
          </span>
        </div>
      </div>
    </div>
  );
};
