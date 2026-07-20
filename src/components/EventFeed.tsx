import React from "react";
import { Radio, ExternalLink, ShieldCheck, Activity } from "lucide-react";

export interface SorobanEventLog {
  id: string;
  ledger: number;
  topic: string;
  value: string;
  timestamp: string;
}

interface EventFeedProps {
  events: SorobanEventLog[];
  isPolling: boolean;
}

export const EventFeed: React.FC<EventFeedProps> = ({ events, isPolling }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Radio className="w-5 h-5 text-indigo-400" />
            {isPolling && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <h3 className="text-base font-bold text-white">Soroban RPC On-Chain Live Activity</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Polling Ledger Events</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          <p>Listening for Soroban RPC ledger events (`prj_cre`, `rev_dist`, `col_add`, `prj_dsp`)...</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-[10px] font-bold uppercase border border-indigo-500/20">
                  {evt.topic}
                </span>
                <div>
                  <p className="text-slate-200 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                    {evt.value}
                  </p>
                  <p className="text-[10px] text-slate-500">Ledger #{evt.ledger} • {evt.timestamp}</p>
                </div>
              </div>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${evt.id.split('-')[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
