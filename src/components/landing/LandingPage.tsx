import React from 'react';
import {
  Camera,
  Receipt,
  CreditCard,
  Users,
  ArrowRight,
  Sparkles,
  PlaneTakeoff,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Zap,
  Heart,
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenCreateTrip: () => void;
  onOpenJoinTrip: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenCreateTrip,
  onOpenJoinTrip,
}) => {
  const { currentTrip, members, totalPhotosCount, totalTripExpenses } = useTrip();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-teal-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Landing Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <span className="text-2xl">⛺</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                BUNKERS
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Hackathon Edition
                </span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                One Trip. One Story. Every Expense Settled.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenJoinTrip}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              Join a Trip
            </button>
            <button
              onClick={onEnterApp}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all transform hover:-translate-y-0.5"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 shadow-xl">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Collaborative Group Trip Management Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Your Trip. Your Memories.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Your Expenses. One Place.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Capture every moment, track every group expense, and settle up effortlessly with your friends. 
          No more lost photos or complicated math after the vacation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto">
          <button
            onClick={onOpenCreateTrip}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all transform hover:-translate-y-1"
          >
            <PlaneTakeoff className="w-5 h-5" />
            <span>Create a Trip</span>
          </button>
          <button
            onClick={onOpenJoinTrip}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600"
          >
            <span>Join with Code</span>
          </button>
        </div>

        {/* Live Demo Teaser Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl max-w-5xl mx-auto text-left relative overflow-hidden group">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                bunkers.app/trip/goa-2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo Active
              </span>
              <button
                onClick={onEnterApp}
                className="text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl transition-colors flex items-center gap-1"
              >
                Launch App <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Mockup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mock Header Card */}
            <div className="md:col-span-3 bg-gradient-to-r from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Active Demo Workspace
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  GOA 2026 🌴
                  <span className="text-xs font-normal text-slate-400">
                    12 Oct – 16 Oct • 4 Friends • 5 Days
                  </span>
                </h3>
              </div>
              <div className="flex items-center -space-x-2">
                {members.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                  />
                ))}
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700 ml-2">
                  4 Crew
                </span>
              </div>
            </div>

            {/* Mock Photo Card (Strictly organized preview) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    Memories By Uploader
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {totalPhotosCount} Photos
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">📸 Rahul's Photos</span>
                    <span className="text-emerald-400 font-bold">4 photos</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">📸 Priya's Photos</span>
                    <span className="text-emerald-400 font-bold">3 photos</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Strict uploader cards with badges & avatars. Never anonymous.
              </p>
            </div>

            {/* Mock Expense Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    Total Expenses
                  </span>
                  <span className="text-xs font-extrabold text-amber-400">
                    ₹{totalTripExpenses.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span>🏨 Beach Villa Stay</span>
                    <span className="font-bold text-slate-200">₹8,000</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span>🍔 Seafood Dinner</span>
                    <span className="font-bold text-slate-200">₹2,400</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Automatic Equal & Custom Split calculations with zero manual math.
              </p>
            </div>

            {/* Mock Settle / PAY Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    Instant Settle Up
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    1-Click PAY
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30">
                  <p className="text-xs text-slate-300">
                    Priya owes Rahul <strong className="text-emerald-400">₹1,000</strong>
                  </p>
                  <button
                    onClick={onEnterApp}
                    className="w-full mt-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    PAY ₹1,000
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Min-cash-flow algorithm simplifies debt into fewest transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Engineered For Frictionless Trips
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything your travel crew needs, in one polished app.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">📸 Shared Memories</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Everyone's photos, organized by who captured them." Distinct uploader sections, high-res lightbox viewer, and instant download.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 hover:bg-slate-900/90 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">💰 Smart Bill Splitting</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Track who paid, who owes, and how much." Equal split, custom split shares, 8 rich categories, and Indian Rupee (₹) formatting.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">🤝 Easy Settlement & PAY</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              "See exactly who needs to pay whom." Greedy min-cash-flow algorithm, instant simulated payments, and celebratory confetti.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">👥 One Shared Trip Space</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Keep your entire group organized in one place." Instant invite codes, member roles, dynamic persona switcher, and activity logs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛺</span>
            <span className="text-sm font-bold text-white">BUNKERS</span>
            <span className="text-xs text-slate-500">— One Trip. One Story. Every Expense Settled.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Open Goa 2026 Demo
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-xs text-slate-500">Built for Hackathon Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
