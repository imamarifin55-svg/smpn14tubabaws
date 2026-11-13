/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { SchoolProfile } from './components/SchoolProfile';
import { TeacherDirectory } from './components/TeacherDirectory';
import { StudentDirectory } from './components/StudentDirectory';
import { ActivityGallery } from './components/ActivityGallery';
import { KegiatanPagiSection } from './components/KegiatanPagiSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ExtracurricularAndFacilities } from './components/ExtracurricularAndFacilities';
import { PPDBPortal } from './components/PPDBPortal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

function SchoolAppContent() {
  const [activeTab, setActiveTab] = useState<string>('beranda');

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPPDB = () => {
    scrollToSection('ppdb');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-900 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPPDB={handleOpenPPDB}
      />

      <main>
        {/* Hero Section with High-Fidelity School Imagery & Ribbon */}
        <Hero
          onOpenPPDB={handleOpenPPDB}
          onNavigate={scrollToSection}
        />

        {/* 4-Column KPI Stats Strip with Tabular Numerals */}
        <StatsBar />

        {/* Sambutan Kepala Sekolah, Visi Misi & Filosofi Nenemo Tubaba */}
        <SchoolProfile />

        {/* Direktori Dewan Guru & Staf Pendidik */}
        <TeacherDirectory />

        {/* Direktori Peserta Didik Aktif (Samping Profil & Guru) */}
        <StudentDirectory />

        {/* Galeri Kegiatan Sekolah (Upacara, Pramuka, Lab Sains, Seni Tari Lampung) */}
        <ActivityGallery />

        {/* Submenu Kegiatan Pagi: Program Pembiasaan & Literasi Siswa */}
        <KegiatanPagiSection />

        {/* Pengumuman Akademik & Surat Edaran Resmi */}
        <AnnouncementsSection />

        {/* Ekstrakurikuler & Fasilitas Kampus */}
        <ExtracurricularAndFacilities />

        {/* Portal Integrasi Pendaftaran Siswa Baru (PPDB Online 2026/2027) */}
        <PPDBPortal />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Admin Panel Modal for modifying information directly */}
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <SchoolDataProvider>
      <SchoolAppContent />
    </SchoolDataProvider>
  );
}
