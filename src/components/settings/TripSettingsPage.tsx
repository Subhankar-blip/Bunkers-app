import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { formatINR, formatDateRange, formatDate } from '../../utils/currency';
import {
  Settings,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Download,
  Trash2,
  LogOut,
  Sparkles,
  ShieldAlert,
  Info,
  Save,
} from 'lucide-react';

export const TripSettingsPage: React.FC = () => {
  const {
    currentTrip,
    updateTrip,
    resetDemoData,
    currentUser,
    members,
    photos,
    expenses,
    memberBalances,
    totalTripExpenses,
  } = useTrip();

  const [name, setName] = useState(currentTrip?.name || '');
  const [destination, setDestination] = useState(currentTrip?.destination || '');
  const [startDate, setStartDate] = useState(currentTrip?.startDate || '');
  const [endDate, setEndDate] = useState(currentTrip?.endDate || '');
  const [description, setDescription] = useState(currentTrip?.description || '');

  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentTrip) return null;

  const isAdmin = currentUser.role === 'admin' || currentUser.id === currentTrip.createdBy;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrip({
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTrip.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportSummary = () => {
    const report = `
=========================================
BUNKERS - TRIP SUMMARY REPORT
One Trip. One Story. Every Expense Settled.
=========================================

Trip: ${currentTrip.name}
Destination: ${currentTrip.destination}
Duration: ${formatDateRange(currentTrip.startDate, currentTrip.endDate)}
Invite Code: ${currentTrip.code}
Generated On: ${new Date().toLocaleString()}

MEMBERS (${members.length}):
${members.map((m) => `- ${m.name} (${m.role}) - ${m.email || 'No email'}`).join('\n')}

PHOTOS CATALOG (${photos.length} total):
${members
  .map((m) => {
    const userPhotos = photos.filter((p) => p.uploaderId === m.id);
    return `* ${m.name}'s Album (${userPhotos.length} photos)`;
  })
  .join('\n')}

EXPENSES SUMMARY:
Total Trip Spend: ${formatINR(totalTripExpenses)}
Total Bills Logged: ${expenses.length}

Detailed Bills:
${expenses
  .map(
    (e) =>
      `[${formatDate(e.createdAt)}] ${e.title} - ${formatINR(e.amount)} (Paid by: ${
        members.find((m) => m.id === e.paidBy)?.name || 'Unknown'
      })`
  )
  .join('\n')}

FINAL MEMBER LEDGER BALANCES:
${memberBalances
  .map(
    (b) =>
      `${b.user.name}: Paid ${formatINR(b.totalPaid)} | Share ${formatINR(
        b.totalShare
      )} | Net: ${
        b.netBalance > 0
          ? `+${formatINR(b.netBalance)} (RECEIVE)`
          : b.netBalance < 0
          ? `-${formatINR(Math.abs(b.netBalance))} (OWES)`
          : '₹0 (SETTLED)'
      }`
  )
  .join('\n')}
=========================================
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bunkers_${currentTrip.name.replace(/\s+/g, '_')}_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Trip Settings ⚙️
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage workspace configuration, invite codes, export reports, or reset demo state.
          </p>
        </div>
      </div>

      {/* 2. Invite Code Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              Invite Code & Sharing
            </h3>
            <p className="text-xs text-slate-400">
              Share this code with friends so they can join this trip directly
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            {currentTrip.code}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Invite Link / Code:
            </span>
            <span className="text-sm font-mono font-bold text-white">
              bunkers.app/join?code={currentTrip.code}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Edit Trip Details Form (Admin permission) */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Trip Details & Schedule
            </h3>
            <p className="text-xs text-slate-400">
              Update destination, trip title, and schedule dates
            </p>
          </div>
          {!isAdmin && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Admin Only Edit
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trip Name
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full glass-input rounded-2xl px-4 py-3 text-sm focus:border-emerald-500 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Destination
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs focus:border-emerald-500 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Start Date
              </label>
              <input
                type="date"
                disabled={!isAdmin}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-3 py-2 text-xs focus:border-emerald-500 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                End Date
              </label>
              <input
                type="date"
                disabled={!isAdmin}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full glass-input rounded-2xl px-3 py-2 text-xs focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trip Description
            </label>
            <textarea
              disabled={!isAdmin}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full glass-input rounded-2xl px-4 py-2 text-xs focus:border-emerald-500 disabled:opacity-60"
            />
          </div>

          {isAdmin && (
            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Changes saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Trip Settings</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 4. Export & Download Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              Export Trip Financial Report
            </h3>
            <p className="text-xs text-slate-400">
              Download complete text summary with members, organized photo albums, bills, and balances.
            </p>
          </div>
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (.txt)</span>
          </button>
        </div>
      </div>

      {/* 5. Hackathon Judge: Reset Demo Data */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hackathon Judge Demo Reset
            </h3>
            <p className="text-xs text-slate-400">
              Reset all trips, photos, expenses, and settlements to the pristine Goa 2026 dataset anytime.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all trip data to initial Goa 2026 demo dataset?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
