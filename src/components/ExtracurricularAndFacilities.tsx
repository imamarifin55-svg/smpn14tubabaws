import React, { useState } from 'react';
import {
  Compass,
  Trophy,
  Activity,
  HeartHandshake,
  BookOpen,
  Microscope,
  Building,
  DoorOpen,
  Calendar,
  UserCheck
} from 'lucide-react';
import { SCHOOL_EXTRAS, SCHOOL_FACILITIES } from '../data/schoolData';

export const ExtracurricularAndFacilities: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'ekskul' | 'fasilitas'>('ekskul');

  const facilityIcons: Record<string, React.ReactNode> = {
    DoorOpen: <DoorOpen className="w-5 h-5 text-blue-900" />,
    Microscope: <Microscope className="w-5 h-5 text-blue-900" />,
    BookOpen: <BookOpen className="w-5 h-5 text-blue-900" />,
    Trophy: <Trophy className="w-5 h-5 text-amber-600" />,
    Building2: <Building className="w-5 h-5 text-emerald-700" />,
    HeartHandshake: <HeartHandshake className="w-5 h-5 text-rose-600" />
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Pengembangan Minat &amp; Sarana</span>
              <span aria-hidden="true">·</span>
              <span>Karakter Holistik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ekstrakurikuler &amp; Fasilitas Pembelajaran
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Mewadahi talenta kepemimpinan, seni, olahraga, dan spiritualitas siswa melalui program 
              ekstrakurikuler aktif yang ditunjang sarana prasarana representatif.
            </p>
          </div>

          {/* Interactive Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSection('ekskul')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSection === 'ekskul'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ekstrakurikuler ({SCHOOL_EXTRAS.length})
            </button>
            <button
              onClick={() => setActiveSection('fasilitas')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSection === 'fasilitas'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fasilitas Kampus ({SCHOOL_FACILITIES.length})
            </button>
          </div>
        </div>

        {/* Ekstrakurikuler Grid */}
        {activeSection === 'ekskul' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {SCHOOL_EXTRAS.map((extra) => (
              <div
                key={extra.name}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                    <span className="font-semibold text-blue-900">{extra.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {extra.schedule}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {extra.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {extra.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span><strong>Pembina:</strong> {extra.coach}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fasilitas Grid */}
        {activeSection === 'fasilitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {SCHOOL_FACILITIES.map((facility) => (
              <div
                key={facility.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-4">
                  {facilityIcons[facility.icon] || <Building className="w-5 h-5 text-blue-900" />}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {facility.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {facility.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
