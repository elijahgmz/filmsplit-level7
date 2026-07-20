import React from "react";
import { Globe, ShieldCheck } from "lucide-react";

interface NetworkSelectorProps {
  network: "mainnet" | "testnet";
  setNetwork: (net: "mainnet" | "testnet") => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ network, setNetwork }) => {
  return (
    <div className="flex items-center space-x-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
      <button
        onClick={() => setNetwork("mainnet")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
          network === "mainnet"
            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Globe className="w-3 h-3" />
        <span>Mainnet</span>
      </button>

      <button
        onClick={() => setNetwork("testnet")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
          network === "testnet"
            ? "bg-amber-500 text-slate-950"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <span>Testnet</span>
      </button>
    </div>
  );
};
