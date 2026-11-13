import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, GraduationCap, Phone, FileText, Settings, ChevronDown, Camera, Sun, Users, Compass, LogIn } from 'lucide-react';
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
  const { schoolInfo, setIsAdminOpen, isAdminAuthenticated } = useSchoolData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileSubmenus, setMobileSubmenus] = useState<Record<string, boolean>>({
    'peserta-didik-menu': true,
    'galeri-kegiatan': true
  });
  const navRef = useRef<HTMLElement>(null);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil & Guru' },
    {
      id: 'peserta-didik-menu',
      label: 'Peserta Didik',
      children: [
        {
          id: 'peserta-didik',
          label: 'Data Peserta Didik',
          desc: 'Direktori & rekapitulasi siswa aktif',
          icon: Users
        },
        {
          id: 'ekstrakurikuler',
          label: 'Ekstrakurikuler',
          desc: 'Pramuka, seni tari, PMR, olahraga & sains',
          icon: Compass
        }
      ]
    },
    {
      id: 'galeri-kegiatan',
      label: 'Galeri Kegiatan',
      children: [
        {
          id: 'galeri',
          label: 'Galeri Foto',
          desc: 'Dokumentasi kegiatan & prestasi siswa',
          icon: Camera
        },
        {
          id: 'kegiatan-pagi',
          label: 'Kegiatan Pagi',
          desc: 'Pembiasaan pagi, literasi & senam siswa',
          icon: Sun
        }
      ]
    },
    { id: 'pengumuman', label: 'Pengumuman & Berita' },
    { id: 'ppdb', label: 'PPDB Online' },
    { id: 'kontak', label: 'Kontak' }
  ];

  // Close desktop dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setOpenDropdownId(null);
    if (id === 'ekstrakurikuler') {
      window.dispatchEvent(new CustomEvent('select-ekskul-tab'));
    }
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
            <span className="font-semibold text-amber-400">
              {schoolInfo.topBarLabel || 'PENGUMUMAN PPDB:'}
            </span>
            <span>
              {schoolInfo.topBarText || 'Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring'}
            </span>
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
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-blue-950 hover:bg-blue-800 text-amber-400 font-semibold border border-blue-800/80 transition-colors cursor-pointer text-[11px] whitespace-nowrap"
              title={isAdminAuthenticated ? 'Buka Menu Pengelola Website' : 'Masuk sebagai Administrator'}
            >
              {isAdminAuthenticated ? (
                <>
                  <Settings className="w-3 h-3" />
                  <span>Menu Pengelola</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single Brand Wordmark Element */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3.5 text-left group whitespace-nowrap shrink-0 focus:outline-hidden cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 overflow-hidden bg-transparent">
              {schoolInfo.logoUrl ? (
                <img
                  src={schoolInfo.logoUrl}
                  alt={schoolInfo.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <GraduationCap className="w-10 h-10 text-blue-900" />
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
          <nav ref={navRef} className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              if (item.children) {
                const isGroupActive = item.children.some((c) => c.id === activeTab);
                const isOpen = openDropdownId === item.id;
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdownId(item.id)}
                    onMouseLeave={() => setOpenDropdownId(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId((prev) => (prev === item.id ? null : item.id))}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors py-2 cursor-pointer ${
                        isGroupActive || isOpen
                          ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-blue-900' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        role="menu"
                        aria-label={`Submenu ${item.label}`}
                        className="absolute left-0 top-full pt-1.5 z-50 w-68"
                      >
                        <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 overflow-hidden">
                          {item.children.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = activeTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                role="menuitem"
                                onClick={() => handleNavClick(sub.id)}
                                className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                                  isSubActive
                                    ? 'bg-blue-50/90 text-blue-900'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                <SubIcon
                                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                                    isSubActive ? 'text-blue-900' : 'text-amber-600'
                                  }`}
                                />
                                <div className="min-w-0">
                                  <span className="block text-sm font-semibold leading-tight whitespace-nowrap">
                                    {sub.label}
                                  </span>
                                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    {sub.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                    activeTab === item.id
                      ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
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
          {navItems.map((item) => {
            if (item.children) {
              const isGroupActive = item.children.some((c) => c.id === activeTab);
              const isExpanded = !!mobileSubmenus[item.id];
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSubmenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isGroupActive
                        ? 'bg-blue-50/70 text-blue-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-180 text-blue-900' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="pl-4 space-y-1 border-l border-slate-200 ml-3">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleNavClick(sub.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                              activeTab === sub.id
                                ? 'bg-blue-50 text-blue-900 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
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
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {isAdminAuthenticated ? (
                <>
                  <Settings className="w-4 h-4 text-blue-900" />
                  <span>Menu Pengelola Website</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-blue-900" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
