import React from 'react';
import { useTrip } from '../../context/TripContext';
import { UserCheck, Sparkles } from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { members, currentUser, setCurrentUser, currentUserBalance } = useTrip();

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Hackathon Demo Switcher
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Testing as: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">
            Switch Persona:
          </span>
          {members.map((member) => {
            const isActive = member.id === currentUser.id;
            return (
              <button
                key={member.id}
                onClick={() => setCurrentUser(member)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
                title={`Switch active user to ${member.name}`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-4 h-4 rounded-full object-cover border border-white/20"
                />
                <span>{member.name}</span>
                {isActive && <UserCheck className="w-3 h-3 text-emerald-200" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
