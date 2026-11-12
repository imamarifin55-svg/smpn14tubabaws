import React from 'react';
import { ArrowRight, Sparkles, MapPin, Clock, ShieldCheck, GraduationCap, Award } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

interface HeroProps {
  onOpenPPDB: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPPDB, onNavigate }) => {
  const { schoolInfo } = useSchoolData();
  return (
    <section id="beranda" className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Institutional Value & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Metadata Trust Kicker (Anti-pill discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 tracking-wide uppercase mb-4">
              <span className="text-blue-900 font-bold">NPSN {schoolInfo.npsn}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold">{schoolInfo.accreditation}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Dinas Pendidikan Kab. Tulang Bawang Barat</span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] text-balance mb-5">
              Mendidik Generasi Berilmu, Berakhlak Mulia &amp; Berbudaya <span className="text-blue-900">{schoolInfo.mottoValues?.split(' ')[0] || 'Nenemo'}</span>
            </h1>

            {/* Body Prose */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Selamat datang di portal resmi <strong>{schoolInfo.name}</strong>. 
              Kami berkomitmen menyelenggarakan pendidikan menengah pertama yang bermutu tinggi, memupuk 
              kreativitas, sains, serta melestarikan kearifan lokal <em>{schoolInfo.mottoLocal}</em> di Provinsi Lampung.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenPPDB}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 active:scale-[0.99] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Portal PPDB 2026/2027</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
              
              <button
                onClick={() => onNavigate('galeri')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <span>Lihat Kegiatan Sekolah</span>
              </button>

              <button
                onClick={() => onNavigate('profil')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium text-blue-900 hover:underline cursor-pointer"
              >
                <span>Profil &amp; Dewan Guru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0" />
                <span>Kurikulum Merdeka Mandiri</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Sekolah Ramah Anak</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Fasilitas Lab Komputer &amp; IPA</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity School Campus Photography */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 group">
              <img
                src="/src/assets/images/hero_smpn14_building_1792594018035.jpg"
                alt="Kampus SMP Negeri 14 Tulang Bawang Barat"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Measured contrast scrim overlay for typography legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kampus Asri &amp; Modern</span>
                </div>
                <h3 className="text-xl font-bold leading-snug">
                  Gedung Terpadu SMPN 14 Tubaba
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Dilengkapi ruang belajar sejuk, laboratorium sains terpadu, perpustakaan digital, serta lapangan serbaguna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Utility Ribbon below the hero */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="flex items-start gap-3 pt-2 md:pt-0">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Jam Pelajaran</span>
                <span className="font-semibold text-slate-100">07.15 - 15.00 WIB</span>
                <span className="block text-xs text-slate-400 mt-0.5">Senin s.d. Jumat</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-6">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Lokasi Kampus</span>
                <span className="font-semibold text-slate-100">Tulang Bawang Barat</span>
                <span className="block text-xs text-slate-400 mt-0.5">Provinsi Lampung, 34693</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-6">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Falsafah Budaya</span>
                <span className="font-semibold text-slate-100">Nenemo &amp; Ragem Sai Mangi Wawai</span>
                <span className="block text-xs text-slate-400 mt-0.5">Nemen, Nedes, Nerimo</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-6">
              <GraduationCap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Pusat Informasi</span>
                <span className="font-semibold text-slate-100">{schoolInfo.whatsapp}</span>
                <span className="block text-xs text-slate-400 mt-0.5">Layanan TU &amp; Konsultasi Wali</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
