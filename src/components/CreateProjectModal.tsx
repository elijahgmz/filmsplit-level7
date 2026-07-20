import React, { useState } from "react";
import { Film, Plus, Trash2, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";

interface CollaboratorInput {
  address: string;
  role: string;
  sharePercent: number;
}

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (projectId: string, title: string, collaborators: { address: string; shareBps: number }[], escrowTarget: number) => Promise<void>;
  loading: boolean;
}

const ROLES = [
  "Director",
  "Producer",
  "Executive Producer",
  "Cinematographer (DP)",
  "Film Editor",
  "Sound Designer / Composer",
  "Screenwriter",
  "Lead Cast",
  "Investor / Backer",
  "Distribution Partner",
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  onSubmit,
  loading,
}) => {
  const [projectId, setProjectId] = useState(`film-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState("");
  const [escrowTarget, setEscrowTarget] = useState("5000");
  const [collaborators, setCollaborators] = useState<CollaboratorInput[]>([
    { address: "GAXCXDDP44VRDTL2PJI22WJU6H4CMRMI2CHRJGPJ3S3L4R323ETDOCAL", role: "Director", sharePercent: 50 },
    { address: "GB6JWKOECLWV2N4OHDEN2ZLPQZYJA47FSWNXKRMYQXTJSK2L7HPBYXZR", role: "Producer", sharePercent: 50 },
  ]);
  const [error, setError] = useState<string | null>(null);

  const totalPercent = collaborators.reduce((acc, curr) => acc + (curr.sharePercent || 0), 0);

  const handleAddRow = () => {
    setCollaborators([...collaborators, { address: "", role: "Film Editor", sharePercent: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (collaborators.length <= 2) return;
    const updated = [...collaborators];
    updated.splice(index, 1);
    setCollaborators(updated);
  };

  const handleChangeRow = (index: number, field: keyof CollaboratorInput, val: any) => {
    const updated = [...collaborators];
    if (field === "sharePercent") {
      updated[index].sharePercent = parseFloat(val) || 0;
    } else {
      (updated[index] as any)[field] = val;
    }
    setCollaborators(updated);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!projectId.trim() || !title.trim()) {
      setError("Please fill in the project title and project ID.");
      return;
    }

    if (Math.abs(totalPercent - 100) > 0.01) {
      setError(`Collaborator shares must sum to exactly 100% (Currently ${totalPercent.toFixed(1)}%).`);
      return;
    }

    for (let i = 0; i < collaborators.length; i++) {
      const c = collaborators[i];
      if (!c.address.startsWith("G") || c.address.length !== 56) {
        setError(`Invalid Stellar address for ${c.role || "collaborator"} #${i + 1}. Must be a valid 56-char public key.`);
        return;
      }
      if (c.sharePercent <= 0) {
        setError(`Share percentage for ${c.role || "collaborator"} #${i + 1} must be greater than 0%.`);
        return;
      }
    }

    const formattedCollabs = collaborators.map((c) => ({
      address: c.address.trim(),
      shareBps: Math.round(c.sharePercent * 100), // Convert % -> Basis Points (e.g. 50% -> 5000 bps)
    }));

    try {
      await onSubmit(projectId.trim(), title.trim(), formattedCollabs, parseFloat(escrowTarget) || 0);
    } catch (err: any) {
      setError(err.message || "Failed to create project on-chain.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Film Revenue Split</h2>
              <p className="text-xs text-slate-400">Register new project and lock crew basis points on Soroban</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Neon Horizon (2026)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Project ID (On-Chain Key)
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono text-indigo-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Production Funding Target (XLM)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={escrowTarget}
              onChange={(e) => setEscrowTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          {/* Collaborators Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Crew & Collaborator Splits
              </label>
              <div
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  Math.abs(totalPercent - 100) < 0.01
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}
              >
                Total: {totalPercent.toFixed(1)}% / 100%
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {collaborators.map((c, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <select
                    value={c.role}
                    onChange={(e) => handleChangeRow(idx, "role", e.target.value)}
                    className="w-full sm:w-40 px-3 py-2 rounded-lg glass-input text-xs"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-slate-900 text-white">
                        {r}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Stellar Public Key (G...)"
                    value={c.address}
                    onChange={(e) => handleChangeRow(idx, "address", e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 rounded-lg glass-input text-xs font-mono"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="%"
                      value={c.sharePercent}
                      onChange={(e) => handleChangeRow(idx, "sharePercent", e.target.value)}
                      className="w-20 px-3 py-2 rounded-lg glass-input text-xs text-right font-bold text-amber-400"
                    />
                    <span className="text-xs text-slate-400">%</span>

                    {collaborators.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-300 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Crew Member</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || Math.abs(totalPercent - 100) > 0.01}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center space-x-2 transition-all"
            >
              {loading ? (
                <span>Registering on Soroban...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register Film Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
