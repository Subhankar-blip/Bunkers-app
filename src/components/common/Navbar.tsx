import React, { useState, useRef, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import {
  Compass,
  Camera,
  Receipt,
  Scale,
  CreditCard,
  Users,
  Settings,
  Bell,
  Plus,
  LogIn,
  ChevronDown,
  Sparkles,
  Home,
  Check,
  PlaneTakeoff,
  Menu,
  X,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/currency';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateTrip: () => void;
  onOpenJoinTrip: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateTrip,
  onOpenJoinTrip,
  onGoHome,
}) => {
  const {
    trips,
    currentTrip,
    setCurrentTripId,
    members,
    currentUser,
    setCurrentUser,
    activities,
  } = useTrip();

  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tripRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tripRef.current && !tripRef.current.contains(e.target as Node)) {
        setTripDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'memories', label: 'Memories', icon: Camera, badge: 'Organized' },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'balances', label: 'Balances', icon: Scale },
    { id: 'settle', label: 'Settle Up', icon: CreditCard, highlight: true },
    { id: 'crew', label: 'Crew', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Trip Switcher */}
          <div className="flex items-center gap-4">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 group focus:outline-none"
              title="Return to Landing Page"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                <span className="text-xl leading-none">⛺</span>
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  BUNKERS
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium block -mt-1 tracking-wide">
                  Group Trip Companion
                </span>
              </div>
            </button>

            {/* Trip Selector Dropdown */}
            {currentTrip && (
              <div className="relative hidden sm:block" ref={tripRef}>
                <button
                  onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="max-w-[120px] truncate">{currentTrip.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {tripDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                    <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Your Active Trips
                    </div>
                    {trips.map((trip) => (
                      <button
                        key={trip.id}
                        onClick={() => {
                          setCurrentTripId(trip.id);
                          setTripDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          trip.id === currentTrip.id
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <PlaneTakeoff className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{trip.name}</span>
                        </div>
                        {trip.id === currentTrip.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-800 my-1.5" />
                    <button
                      onClick={() => {
                        onOpenCreateTrip();
                        setTripDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Trip
                    </button>
                    <button
                      onClick={() => {
                        onOpenJoinTrip();
                        setTripDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Join via Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Notifications & Active User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Activity Feed"
              >
                <Bell className="w-4 h-4" />
                {activities.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                {activities.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Live Trip Activity
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {activities.length} events
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {activities.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        No recent activity recorded yet.
                      </p>
                    ) : (
                      activities.slice(0, 8).map((act) => (
                        <div
                          key={act.id}
                          className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-xs"
                        >
                          <img
                            src={act.userAvatar}
                            alt={act.userName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 font-medium leading-snug">
                              {act.description}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {formatRelativeTime(act.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active User Persona Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/40 ring-2 ring-emerald-500/20"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded uppercase font-semibold">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">Active Persona</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1.5">
                    <p className="text-xs font-bold text-white">Switch Active Member</p>
                    <p className="text-[11px] text-slate-400">
                      Test actions & balances from any member perspective
                    </p>
                  </div>
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUser(member);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                        member.id === currentUser.id
                          ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                        <div className="text-left">
                          <div>{member.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {member.role}
                          </div>
                        </div>
                      </div>
                      {member.id === currentUser.id && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="border-t border-slate-800 my-2 pt-2 flex gap-2">
              <button
                onClick={() => {
                  onOpenCreateTrip();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                New Trip
              </button>
              <button
                onClick={() => {
                  onOpenJoinTrip();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                Join Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
