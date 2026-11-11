import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  Search,
  CheckCircle2,
  Printer,
  Calendar,
  Shield,
  HelpCircle,
  Clock,
  MapPin,
  Upload,
  AlertCircle
} from 'lucide-react';
import { PPDBApplicant } from '../data/schoolData';
import { useSchoolData } from '../context/SchoolDataContext';

export const PPDBPortal: React.FC = () => {
  const { applicants, addApplicant, schoolInfo } = useSchoolData();
  const [activeTab, setActiveTab] = useState<'info' | 'daftar' | 'status' | 'pendaftar'>('info');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nisn: '',
    nik: '',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2013-05-10',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    previousSchool: '',
    track: 'Zonasi' as 'Zonasi' | 'Prestasi' | 'Afirmasi' | 'Pindah Tugas',
    parentName: '',
    parentPhone: '',
    address: '',
    notes: ''
  });

  const [formSubmittedApplicant, setFormSubmittedApplicant] = useState<PPDBApplicant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedApplicant, setSearchedApplicant] = useState<PPDBApplicant | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.nisn || !formData.previousSchool || !formData.parentPhone) {
      alert('Mohon lengkapi data wajib yang bertanda bintang (*).');
      return;
    }

    const regSuffix = String(Math.floor(1000 + Math.random() * 9000));
    const newRegNumber = `PPDB-2026-SMPN14-${regSuffix}`;

    const newApplicant: PPDBApplicant = {
      registrationNumber: newRegNumber,
      fullName: formData.fullName,
      nisn: formData.nisn,
      nik: formData.nik || '181201' + Math.floor(1000000000 + Math.random() * 9000000000),
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      gender: formData.gender,
      previousSchool: formData.previousSchool,
      track: formData.track,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      address: formData.address,
      submissionDate: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      status: 'Terverifikasi',
      notes: 'Pendaftaran berkas online telah diterima sistem PPDB SMPN 14. Silakan simpan dan cetak kartu bukti pendaftaran.'
    };

    addApplicant(newApplicant);
    setFormSubmittedApplicant(newApplicant);
  };

  // Search Handler
  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchAttempted(true);
    const cleanQuery = searchQuery.trim().toLowerCase();
    const found = applicants.find(
      (app) =>
        app.nisn.toLowerCase() === cleanQuery ||
        app.registrationNumber.toLowerCase() === cleanQuery ||
        app.fullName.toLowerCase().includes(cleanQuery)
    );
    setSearchedApplicant(found || null);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const tracks = [
    {
      name: 'Jalur Zonasi (50%)',
      desc: 'Diperuntukkan bagi calon murid yang berdomisili di dalam wilayah zonasi radius terdekat SMPN 14 Tulang Bawang Barat berdasarkan alamat Kartu Keluarga.',
      req: 'Fotokopi KK minimal 1 tahun dan Akta Kelahiran'
    },
    {
      name: 'Jalur Prestasi (30%)',
      desc: 'Bagi siswa dengan capaian akademik rapor SD/MI peringkat tinggi atau piagam kejuaraan OSN, O2SN, FLS2N, MTQ tingkat kecamatan hingga nasional.',
      req: 'Sertifikat/Piagam Kejuaraan & Surat Keterangan Peringkat Rapor'
    },
    {
      name: 'Jalur Afirmasi (15%)',
      desc: 'Dikhususkan bagi calon peserta didik dari keluarga prasejahtera atau penyandang disabilitas ringan yang memiliki kartu bantuan sosial resmi pemerintah.',
      req: 'Kartu Indonesia Pintar (KIP), PKH, atau KKS aktif'
    },
    {
      name: 'Jalur Perpindahan Tugas (5%)',
      desc: 'Bagi calon siswa yang orang tua/walinya mengalami perpindahan tugas dinas (TNI/Polri/ASN/BUMN/Swasta) ke wilayah Tubaba.',
      req: 'Surat Keputusan Penugasan / Mutasi dari instansi terkait'
    }
  ];

  return (
    <section id="ppdb" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>Penerimaan Peserta Didik Baru</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Ajaran 2026/2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Portal Integrasi PPDB Online SMPN 14
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Layanan resmi pendaftaran murid baru yang transparan, akuntabel, dan bebas pungutan biaya (gratis). 
            Daftarkan putra-putri Anda, lengkapi berkas secara daring, dan pantau status verifikasi secara langsung.
          </p>
        </div>

        {/* Portal Interactive Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200/80">
          <button
            onClick={() => {
              setActiveTab('info');
              setFormSubmittedApplicant(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Alur &amp; Syarat Jalur</span>
          </button>

          <button
            onClick={() => setActiveTab('daftar')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'daftar'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Formulir Pendaftaran Online</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Cek Status &amp; Cetak Bukti</span>
          </button>

          <button
            onClick={() => setActiveTab('pendaftar')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'pendaftar'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Data Pendaftar ({applicants.length})</span>
          </button>
        </div>

        {/* TAB 1: INFORMASI JALUR & ALUR PENDAFTARAN */}
        {activeTab === 'info' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Timeline Bar */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-900" />
                <span>Jadwal &amp; Agenda Resmi PPDB TA 2026/2027</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                <div className="border-l-2 md:border-l-0 md:border-t-2 border-blue-900 pl-4 md:pl-0 md:pt-4">
                  <span className="text-xs font-bold text-blue-900 font-mono">Tahap 1</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Pendaftaran Daring</h4>
                  <p className="text-xs text-slate-500 mt-1">10 - 24 Oktober 2026</p>
                  <p className="text-xs text-slate-600 mt-1">Pengisian formulir mandiri melalui website ini.</p>
                </div>

                <div className="border-l-2 md:border-l-0 md:border-t-2 border-slate-300 pl-4 md:pl-0 md:pt-4">
                  <span className="text-xs font-bold text-slate-500 font-mono">Tahap 2</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Verifikasi Berkas</h4>
                  <p className="text-xs text-slate-500 mt-1">25 - 28 Oktober 2026</p>
                  <p className="text-xs text-slate-600 mt-1">Pemeriksaan keabsahan dokumen oleh panitia PPDB.</p>
                </div>

                <div className="border-l-2 md:border-l-0 md:border-t-2 border-slate-300 pl-4 md:pl-0 md:pt-4">
                  <span className="text-xs font-bold text-slate-500 font-mono">Tahap 3</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Pengumuman Kelulusan</h4>
                  <p className="text-xs text-slate-500 mt-1">30 Oktober 2026</p>
                  <p className="text-xs text-slate-600 mt-1">Diumumkan online dan papan pengumuman sekolah.</p>
                </div>

                <div className="border-l-2 md:border-l-0 md:border-t-2 border-slate-300 pl-4 md:pl-0 md:pt-4">
                  <span className="text-xs font-bold text-slate-500 font-mono">Tahap 4</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Daftar Ulang Siswa</h4>
                  <p className="text-xs text-slate-500 mt-1">02 - 05 November 2026</p>
                  <p className="text-xs text-slate-600 mt-1">Pengukuran seragam &amp; persiapan MPLS.</p>
                </div>
              </div>
            </div>

            {/* 4 Jalur Pendaftaran Cards */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>4 Jalur Pendaftaran Resmi (Permendikbudristek)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tracks.map((track) => (
                  <div
                    key={track.name}
                    className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-base font-bold text-blue-900">{track.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Syarat Kunci:</span> {track.req}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to Open Form */}
            <div className="p-6 bg-blue-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold">Siap Mendaftarkan Putra-Putri Anda?</h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Pengisian formulir hanya memerlukan waktu sekitar 5 menit. Tidak dipungut biaya apa pun.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('daftar')}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Mulai Isi Formulir &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULIR PENDAFTARAN SISWA BARU */}
        {activeTab === 'daftar' && (
          <div className="animate-in fade-in duration-200">
            {formSubmittedApplicant ? (
              /* Success / Result View with Printable Proof */
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-10 shadow-lg max-w-3xl mx-auto">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Pendaftaran Berhasil Dikirim!
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Data calon peserta didik telah tersimpan di sistem PPDB SMPN 14 Tulang Bawang Barat.
                  </p>
                </div>

                {/* Printable Registration Card Element */}
                <div
                  id="printable-ppdb-card"
                  className="bg-slate-50 p-6 sm:p-8 rounded-2xl border-2 border-slate-200 my-6 text-slate-900"
                >
                  <div className="border-b-2 border-slate-800 pb-4 mb-4 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Tanda Bukti Registrasi PPDB 2026/2027
                    </div>
                    <div className="text-base sm:text-lg font-extrabold text-blue-900">
                      SMP NEGERI 14 TULANG BAWANG BARAT
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      NPSN: {schoolInfo.npsn} · {schoolInfo.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Nomor Registrasi:</span>
                      <span className="text-base font-bold font-mono text-blue-900">
                        {formSubmittedApplicant.registrationNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status Awal:</span>
                      <span className="font-semibold text-emerald-700">
                        {formSubmittedApplicant.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nama Lengkap Siswa:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {formSubmittedApplicant.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">NISN / NIK:</span>
                      <span className="font-mono font-medium">
                        {formSubmittedApplicant.nisn} / {formSubmittedApplicant.nik}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Asal Sekolah Dasar:</span>
                      <span className="font-medium text-slate-800">
                        {formSubmittedApplicant.previousSchool}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Jalur Pendaftaran:</span>
                      <span className="font-semibold text-blue-900">
                        Jalur {formSubmittedApplicant.track}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nama Orang Tua/Wali:</span>
                      <span className="font-medium">{formSubmittedApplicant.parentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nomor WhatsApp Aktif:</span>
                      <span className="font-mono font-medium">{formSubmittedApplicant.parentPhone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Alamat Domisili:</span>
                      <span className="font-medium">{formSubmittedApplicant.address}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap justify-between items-center gap-2">
                    <span>Waktu Submit: {formSubmittedApplicant.submissionDate}</span>
                    <span className="font-mono text-slate-400">Scan Verifikasi TU: VALID</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handlePrintCard}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak Kartu Tanda Peserta (Print)</span>
                  </button>

                  <button
                    onClick={() => {
                      setFormSubmittedApplicant(null);
                      setFormData({
                        fullName: '',
                        nisn: '',
                        nik: '',
                        birthPlace: 'Tulang Bawang Barat',
                        birthDate: '2013-05-10',
                        gender: 'Laki-laki',
                        previousSchool: '',
                        track: 'Zonasi',
                        parentName: '',
                        parentPhone: '',
                        address: '',
                        notes: ''
                      });
                      setSelectedFileNames([]);
                    }}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Daftar Siswa Lainnya
                  </button>
                </div>
              </div>
            ) : (
              /* Actual Form */
              <form
                onSubmit={handleFormSubmit}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-8"
              >
                {/* Notice */}
                <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-blue-950">
                  <AlertCircle className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Perhatian:</span> Pastikan data NISN (Nomor Induk Siswa Nasional) 
                    dan data orang tua sesuai dengan Kartu Keluarga dan data Dapodik SD asal Anda.
                  </div>
                </div>

                {/* Section A: Identitas Calon Siswa */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-mono">
                      1
                    </span>
                    <span>Data Pribadi Calon Siswa Baru</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Contoh: Muhammad Rizky Pratama"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        NISN (10 Digit) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={formData.nisn}
                        onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                        placeholder="Contoh: 0129384721"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        NIK Siswa (Nomor Induk Kependudukan)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        placeholder="16 Digit NIK sesuai KK"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tempat Lahir
                      </label>
                      <input
                        type="text"
                        value={formData.birthPlace}
                        onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jenis Kelamin *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value as 'Laki-laki' | 'Perempuan' })
                        }
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Asal Sekolah Dasar (SD/MI) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        placeholder="Contoh: SD Negeri 1 Panaragan Jaya"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Jalur Pendaftaran */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-mono">
                      2
                    </span>
                    <span>Pilihan Jalur Masuk</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['Zonasi', 'Prestasi', 'Afirmasi', 'Pindah Tugas'] as const).map((trackOption) => (
                      <label
                        key={trackOption}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                          formData.track === trackOption
                            ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="track"
                          className="sr-only"
                          checked={formData.track === trackOption}
                          onChange={() => setFormData({ ...formData, track: trackOption })}
                        />
                        <span className="text-xs block">Jalur {trackOption}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section C: Data Orang Tua / Wali */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-mono">
                      3
                    </span>
                    <span>Data Orang Tua / Wali &amp; Kontak</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Ayah / Ibu / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Nama lengkap penanggung jawab"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor WhatsApp / HP Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        placeholder="Contoh: 081273948210"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Domisili Lengkap (RT/RW/Tiyuh/Kecamatan di Tubaba) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Contoh: Jl. Diponegoro RT 03/RW 01, Tiyuh Karta, Kec. Tulang Bawang Barat"
                        className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Section D: Upload Berkas Simulasi */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-mono">
                      4
                    </span>
                    <span>Kelengkapan Berkas Digital (Opsional / Dapat disusul)</span>
                  </h3>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-white hover:bg-slate-50 transition-colors">
                    <Upload className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      Pilih atau Seret Foto KK, Akta Kelahiran, atau Ijazah SD (PDF / JPG)
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Ukuran maksimal per dokumen 5MB</p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        if (e.target.files) {
                          const names = Array.from(e.target.files).map((f) => f.name);
                          setSelectedFileNames(names);
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      Pilih Dokumen Berkas
                    </label>

                    {selectedFileNames.length > 0 && (
                      <div className="mt-3 text-xs text-emerald-700 font-medium">
                        {selectedFileNames.length} berkas terlampir: {selectedFileNames.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Dengan menekan tombol submit, data pendaftaran akan diproses ke loket PPDB SMPN 14 Tubaba.
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Kirim Formulir Pendaftaran</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CEK STATUS PENDAFTARAN & CETAK BUKTI */}
        {activeTab === 'status' && (
          <div className="animate-in fade-in duration-200 max-w-2xl mx-auto space-y-8">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 text-center">
              <Search className="w-10 h-10 text-blue-900 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">
                Pengecekan Status Berkas &amp; Cetak Kartu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Masukkan Nomor Registrasi PPDB (Contoh: PPDB-2026-SMPN14-0012) atau 10 Digit NISN calon siswa.
              </p>

              <form onSubmit={handleSearchStatus} className="mt-6 flex gap-2">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan Nomor Registrasi / NISN..."
                  className="flex-1 text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-900 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-blue-800 transition-colors cursor-pointer shrink-0"
                >
                  Cek Status
                </button>
              </form>

              {/* Sample Quick Searches */}
              <div className="mt-3 text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-1.5">
                <span>Coba contoh:</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('PPDB-2026-SMPN14-0012')}
                  className="text-blue-900 underline hover:text-blue-700 font-mono"
                >
                  PPDB-2026-SMPN14-0012
                </button>
                <span>atau</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('0128472910')}
                  className="text-blue-900 underline hover:text-blue-700 font-mono"
                >
                  0128472910
                </button>
              </div>
            </div>

            {/* Search Result */}
            {searchAttempted && searchedApplicant && (
              <div
                id="printable-ppdb-card"
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono text-slate-500 block">
                      {searchedApplicant.registrationNumber}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {searchedApplicant.fullName}
                    </h4>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        searchedApplicant.status === 'Lolos Seleksi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchedApplicant.status === 'Terverifikasi'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {searchedApplicant.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">NISN Siswa:</span>
                    <span className="font-mono font-medium text-slate-800">{searchedApplicant.nisn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Jalur Masuk:</span>
                    <span className="font-semibold text-blue-900">Jalur {searchedApplicant.track}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Asal Sekolah:</span>
                    <span className="font-medium text-slate-800">{searchedApplicant.previousSchool}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tanggal Registrasi:</span>
                    <span className="font-medium text-slate-800">{searchedApplicant.submissionDate}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Catatan Panitia PPDB:</span>
                  <p className="text-slate-600 leading-relaxed">{searchedApplicant.notes}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handlePrintCard}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak Kartu Tanda Bukti</span>
                  </button>
                </div>
              </div>
            )}

            {searchAttempted && !searchedApplicant && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Data Pendaftar Tidak Ditemukan</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pastikan Nomor Registrasi atau NISN yang Anda ketikkan sudah benar sesuai tanda bukti.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DATA PENDAFTAR TERKINI (TRANSPARANSI) */}
        {activeTab === 'pendaftar' && (
          <div className="animate-in fade-in duration-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                Daftar antrean dan hasil verifikasi berkas pendaftar baru terupdate secara real-time.
              </span>
              <span className="text-xs font-semibold text-blue-900">
                Total: {applicants.length} Calon Siswa
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3.5 px-4 font-mono">No. Registrasi</th>
                    <th className="py-3.5 px-4">Nama Lengkap</th>
                    <th className="py-3.5 px-4 font-mono">NISN</th>
                    <th className="py-3.5 px-4">Asal Sekolah</th>
                    <th className="py-3.5 px-4">Jalur</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((app) => (
                    <tr key={app.registrationNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-blue-900">
                        {app.registrationNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{app.fullName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{app.nisn}</td>
                      <td className="py-3 px-4 text-slate-700">{app.previousSchool}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">Jalur {app.track}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                            app.status === 'Lolos Seleksi'
                              ? 'bg-emerald-50 text-emerald-700'
                              : app.status === 'Terverifikasi'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
