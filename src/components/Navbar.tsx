import React from "react";
import { Film, Wallet, Landmark, Lock, Presentation, Activity, MessageSquareHeart, CheckCircle2, ShieldCheck, Key, Zap } from "lucide-react";
import { NetworkSelector } from "./NetworkSelector";

interface NavbarProps {
  walletConnected: boolean;
  walletAddress: string;
  xlmBalance: string;
  onConnectWallet: () => void;
  onOpenFeedback: () => void;
  onOpenOnboarding: () => void;
  onOpenPitchDeck: () => void;
  onOpenSecurityAudit: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  network: "mainnet" | "testnet";
  setNetwork: (net: "mainnet" | "testnet") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletConnected,
  walletAddress,
  xlmBalance,
  onConnectWallet,
  onOpenFeedback,
  onOpenOnboarding,
  onOpenPitchDeck,
  onOpenSecurityAudit,
  activeSection,
  setActiveSection,
  network,
  setNetwork,
}) => {
  const truncatedAddress = walletAddress
    ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "";

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-purple-600 to-amber-500 rounded-xl shadow-lg shadow-emerald-500/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FilmSplit
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Level 6 Mainnet</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Decentralized Indie Film Revenue & Escrow Platform
            </p>
          </div>
        </div>

        {/* Section Navigation Toggles */}
        <div className="hidden lg:flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSection("projects")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === "projects" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveSection("multisig")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
              activeSection === "multisig" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Key className="w-3 h-3" />
            <span>Multi-Sig</span>
          </button>
          <button
            onClick={() => setActiveSection("escrow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
              activeSection === "escrow" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Escrow</span>
          </button>
          <button
            onClick={() => setActiveSection("fiat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
              activeSection === "fiat" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Landmark className="w-3 h-3" />
            <span>Fiat Ramp</span>
          </button>
        </div>

        {/* Network & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <NetworkSelector network={network} setNetwork={setNetwork} />

          {/* Security Audit Button */}
          <button
            onClick={onOpenSecurityAudit}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Audit</span>
          </button>

          {/* Pitch Deck Button */}
          <button
            onClick={onOpenPitchDeck}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Deck</span>
          </button>

          {/* 20+ User Onboarding Button */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">20+ Mainnet Users</span>
          </button>

          {/* Connect Wallet */}
          {walletConnected ? (
            <div className="flex items-center space-x-2 pl-2">
              <div className="hidden xl:flex flex-col items-end text-xs">
                <span className="font-semibold text-slate-200">{truncatedAddress}</span>
                <span className="text-emerald-400 font-mono">{parseFloat(xlmBalance).toLocaleString()} XLM</span>
              </div>
              <button
                onClick={onConnectWallet}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="xl:hidden">{truncatedAddress}</span>
                <span className="hidden xl:inline">Mainnet Wallet</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
