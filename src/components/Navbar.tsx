import React, { useState } from 'react';
import { Menu, X, GraduationCap, Phone, FileText, Settings } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPPDB: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPPDB
}) => {
  const { schoolInfo, setIsAdminOpen } = useSchoolData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil & Guru' },
    { id: 'peserta-didik', label: 'Peserta Didik' },
    { id: 'galeri', label: 'Galeri Kegiatan' },
    { id: 'pengumuman', label: 'Pengumuman & Berita' },
    { id: 'ppdb', label: 'PPDB Online' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar Announcement & Admin Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400">PENGUMUMAN PPDB:</span>
            <span>Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:inline">NPSN: {schoolInfo.npsn}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden md:inline">Kab. Tulang Bawang Barat</span>
            <span aria-hidden="true" className="hidden md:inline">·</span>
            <span className="hidden lg:flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              {schoolInfo.phone}
            </span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-950 hover:bg-blue-800 text-amber-400 font-semibold border border-blue-800/80 transition-colors cursor-pointer text-[11px]"
              title="Buka panel admin untuk memperbaiki atau mengubah informasi sekolah"
            >
              <Settings className="w-3 h-3" />
              <span>Kelola Data (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single Brand Wordmark Element */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shadow-xs ring-1 ring-blue-800/20 group-hover:bg-blue-800 transition-colors overflow-hidden">
              {schoolInfo.logoUrl ? (
                <img
                  src={schoolInfo.logoUrl}
                  alt={schoolInfo.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <GraduationCap className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                {schoolInfo.shortName || schoolInfo.name}
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Unggul, Berkarakter &amp; Berbudaya {schoolInfo.mottoValues ? schoolInfo.mottoValues.split(' ')[0] : 'Nenemo'}
              </span>
            </div>
          </button>

          {/* Zone 2: Single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  activeTab === item.id
                    ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onOpenPPDB();
                handleNavClick('ppdb');
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs hover:shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Daftar Siswa Baru</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenPPDB();
                handleNavClick('ppdb');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Pendaftaran Siswa Baru (PPDB)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-blue-900" />
              <span>Kelola Data Sekolah (Mode Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
