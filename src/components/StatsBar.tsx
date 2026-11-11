import React from 'react';
import { Users, GraduationCap, School, Trophy } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

export const StatsBar: React.FC = () => {
  const icons = [
    <Users className="w-5 h-5 text-blue-900" key="users" />,
    <GraduationCap className="w-5 h-5 text-blue-900" key="teachers" />,
    <School className="w-5 h-5 text-blue-900" key="rooms" />,
    <Trophy className="w-5 h-5 text-amber-600" key="grad" />
  ];

  return (
    <section className="bg-slate-50 border-y border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {SCHOOL_INFO.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-slate-100">{icons[idx]}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Dapodik 2026
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {stat.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
