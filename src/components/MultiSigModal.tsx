import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Key, Users, Sparkles, AlertCircle } from "lucide-react";

interface Signer {
  role: string;
  address: string;
  signed: boolean;
}

export const MultiSigModal: React.FC = () => {
  const [signers, setSigners] = useState<Signer[]>([
    { role: "Director (Marcus Vance)", address: "GAXCXDDP...ETDOCAL", signed: true },
    { role: "Producer (Elena Rostova)", address: "GB6JWKOE...BYXZR", signed: true },
    { role: "Executive Investor (Aria Sterling)", address: "GAFTC3HK...3GK6", signed: false },
  ]);

  const [threshold] = useState("2 of 3 Signatures");

  const handleSign = (index: number) => {
    setSigners((prev) =>
      prev.map((s, i) => (i === index ? { ...s, signed: !s.signed } : s))
    );
  };

  const currentSignatureCount = signers.filter((s) => s.signed).length;
  const isQuorumReached = currentSignatureCount >= 2;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl mb-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Multi-Signature Governance Approval System</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 uppercase">
                Level 6 Black Belt
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Requires multi-party consensus (2-of-3 threshold) before releasing escrow capital or unfreezing disputed projects
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
          <span>Quorum: {threshold}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {signers.map((s, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              s.signed
                ? "bg-purple-950/20 border-purple-500/40"
                : "bg-slate-900/50 border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Signer #{index + 1}</span>
                {s.signed ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center space-x-1 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Signed</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                    Pending
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{s.role}</h4>
              <p className="text-[11px] font-mono text-slate-400">{s.address}</p>
            </div>

            <button
              onClick={() => handleSign(index)}
              className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                s.signed
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20"
              }`}
            >
              {s.signed ? "Revoke Signature" : "Sign Authorization"}
            </button>
          </div>
        ))}
      </div>

      {/* Quorum Status Bar */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        isQuorumReached
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-amber-500/10 border-amber-500/30 text-amber-300"
      }`}>
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">
            {isQuorumReached
              ? `Multi-Sig Quorum Reached (${currentSignatureCount}/3 Signatures)! Escrow Tranche Release Authorized.`
              : `Awaiting Quorum (${currentSignatureCount}/3 Signatures). 1 more signature required.`}
          </span>
        </div>
      </div>
    </div>
  );
};
