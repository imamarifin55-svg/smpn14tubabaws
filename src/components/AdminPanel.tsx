import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  Settings,
  School,
  GraduationCap,
  Bell,
  Camera,
  UserCheck,
  Users,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  Search,
  Check,
  RefreshCw,
  ImageIcon,
  Paperclip,
  Database,
  ExternalLink,
  Cloud,
  Edit3,
  Building2,
  Target,
  Quote,
  BookOpen,
  Sun,
  Compass,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import {
  Teacher,
  ActivityPhoto,
  Announcement,
  Student,
  MorningActivity,
  ExtracurricularItem
} from '../data/schoolData';
import { compressImage } from '../utils/imageCompressor';

export const AdminPanel: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    importTeachers,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    importStudents,
    extracurriculars,
    addExtracurricular,
    updateExtracurricular,
    deleteExtracurricular,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    activities,
    addActivity,
    deleteActivity,
    morningActivities,
    addMorningActivity,
    updateMorningActivity,
    deleteMorningActivity,
    applicants,
    updateApplicantStatus,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    isFirebaseAdmin,
    firebaseUser,
    cloudAuthError,
    clearCloudAuthError,
    loginAdmin,
    loginWithGoogleAdmin,
    logoutAdmin,
    adminInitialTab,
    resetToDefault,
    syncAllToCloud,
    isFirebaseConnected,
    syncStatus
  } = useSchoolData();

  const [activeTab, setActiveTab] = useState<'profil' | 'sambutan-visi' | 'guru' | 'peserta-didik' | 'ekstrakurikuler' | 'pengumuman' | 'galeri' | 'kegiatan-pagi' | 'ppdb'>('profil');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);

  // Edit modal states for individual records
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingMorning, setEditingMorning] = useState<MorningActivity | null>(null);
  const [editingEkskul, setEditingEkskul] = useState<ExtracurricularItem | null>(null);

  useEffect(() => {
    if (adminInitialTab) {
      setActiveTab(adminInitialTab);
    }
  }, [adminInitialTab, isAdminOpen]);

  // Form states for Profil, Kampus, Sambutan Kepala Sekolah, & Visi Misi
  const [profileForm, setProfileForm] = useState({
    name: schoolInfo.name,
    shortName: schoolInfo.shortName || 'SMPN 14 Tubaba',
    headmaster: schoolInfo.headmaster,
    headmasterNip: schoolInfo.headmasterNip || '19680315 199303 1 004',
    headmasterEducation: schoolInfo.headmasterEducation || 'Magister Manajemen Pendidikan (UNILA)',
    headmasterPhotoUrl: schoolInfo.headmasterPhotoUrl || '',
    headmasterQuote: schoolInfo.headmasterQuote || '',
    vision: schoolInfo.vision || '',
    missions: schoolInfo.missions && schoolInfo.missions.length > 0 ? schoolInfo.missions : [''],
    npsn: schoolInfo.npsn,
    accreditation: schoolInfo.accreditation,
    decreeNumber: schoolInfo.decreeNumber || '420/188/II.01/TUBABA/2016',
    mottoLocal: schoolInfo.mottoLocal || 'Ragem Sai Mangi Wawai',
    mottoValues: schoolInfo.mottoValues || 'Nenemo (Nemen, Nedes, Nerimo)',
    heroHeadline: schoolInfo.heroHeadline || 'Mendidik Generasi Berilmu, Berakhlak Mulia & Berbudaya',
    heroHighlight: schoolInfo.heroHighlight ?? 'Nenemo',
    heroDescription: schoolInfo.heroDescription || '',
    topBarLabel: schoolInfo.topBarLabel || 'PENGUMUMAN PPDB:',
    topBarText: schoolInfo.topBarText || 'Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring',
    address: schoolInfo.address,
    phone: schoolInfo.phone,
    whatsapp: schoolInfo.whatsapp,
    email: schoolInfo.email,
    workingHours: schoolInfo.workingHours,
    logoUrl: schoolInfo.logoUrl || '',
    campusImageUrl: schoolInfo.campusImageUrl || '',
    campusTitle: schoolInfo.campusTitle || 'Gedung Terpadu SMPN 14 Tubaba',
    campusDescription: schoolInfo.campusDescription || ''
  });

  // Keep profileForm in sync when schoolInfo changes
  useEffect(() => {
    setProfileForm({
      name: schoolInfo.name,
      shortName: schoolInfo.shortName || 'SMPN 14 Tubaba',
      headmaster: schoolInfo.headmaster,
      headmasterNip: schoolInfo.headmasterNip || '19680315 199303 1 004',
      headmasterEducation: schoolInfo.headmasterEducation || 'Magister Manajemen Pendidikan (UNILA)',
      headmasterPhotoUrl: schoolInfo.headmasterPhotoUrl || '',
      headmasterQuote: schoolInfo.headmasterQuote || '',
      vision: schoolInfo.vision || '',
      missions: schoolInfo.missions && schoolInfo.missions.length > 0 ? schoolInfo.missions : [''],
      npsn: schoolInfo.npsn,
      accreditation: schoolInfo.accreditation,
      decreeNumber: schoolInfo.decreeNumber || '420/188/II.01/TUBABA/2016',
      mottoLocal: schoolInfo.mottoLocal || 'Ragem Sai Mangi Wawai',
      mottoValues: schoolInfo.mottoValues || 'Nenemo (Nemen, Nedes, Nerimo)',
      heroHeadline: schoolInfo.heroHeadline || 'Mendidik Generasi Berilmu, Berakhlak Mulia & Berbudaya',
      heroHighlight: schoolInfo.heroHighlight ?? 'Nenemo',
      heroDescription: schoolInfo.heroDescription || '',
      topBarLabel: schoolInfo.topBarLabel || 'PENGUMUMAN PPDB:',
      topBarText: schoolInfo.topBarText || 'Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring',
      address: schoolInfo.address,
      phone: schoolInfo.phone,
      whatsapp: schoolInfo.whatsapp,
      email: schoolInfo.email,
      workingHours: schoolInfo.workingHours,
      logoUrl: schoolInfo.logoUrl || '',
      campusImageUrl: schoolInfo.campusImageUrl || '',
      campusTitle: schoolInfo.campusTitle || 'Gedung Terpadu SMPN 14 Tubaba',
      campusDescription: schoolInfo.campusDescription || ''
    });
  }, [schoolInfo]);

  // Image upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const campusImageInputRef = useRef<HTMLInputElement>(null);
  const headmasterPhotoInputRef = useRef<HTMLInputElement>(null);

  // Form states for New Teacher
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    nip: '',
    role: '',
    subject: '',
    category: 'guru' as Teacher['category'],
    education: '',
    bio: ''
  });

  // State for Teacher Excel Import
  const [teacherImportStatus, setTeacherImportStatus] = useState<{
    total: number;
    preview: Teacher[];
  } | null>(null);
  const teacherFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Single Student Add
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    nis: '',
    fullName: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    grade: 'VII' as 'VII' | 'VIII' | 'IX',
    rombel: 'VII-A',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2013-05-14',
    address: '',
    parentName: '',
    parentPhone: ''
  });

  // State for Student Excel Import
  const [studentImportStatus, setStudentImportStatus] = useState<{
    total: number;
    preview: Student[];
  } | null>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search inside Admin Students Tab
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<'all' | 'VII' | 'VIII' | 'IX'>('all');

  // Form states for New Announcement (with file upload attachment)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'Berita' as Announcement['category'],
    summary: '',
    content: '',
    imageUrl: '',
    documentName: 'Surat_Edaran_2026.pdf',
    documentUrl: ''
  });
  const announcementFileInputRef = useRef<HTMLInputElement>(null);
  const announcementImageInputRef = useRef<HTMLInputElement>(null);

  // Form states for New Activity (with photo image upload)
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'akademik' as ActivityPhoto['category'],
    categoryLabel: 'Sains & Lab',
    location: 'Kampus SMPN 14 Tubaba',
    caption: '',
    image: ''
  });
  const activityImageInputRef = useRef<HTMLInputElement>(null);

  // Form states for New Morning Activity (Kegiatan Pagi)
  const [newMorning, setNewMorning] = useState({
    day: 'Setiap Pagi' as MorningActivity['day'],
    time: '07.00 – 07.30 WIB',
    title: '',
    coordinator: 'Tim Guru Piket & Pembina OSIS',
    location: 'Lapangan Utama SMPN 14',
    description: '',
    imageUrl: ''
  });
  const morningImageInputRef = useRef<HTMLInputElement>(null);

  // Form states for New Extracurricular (Ekstrakurikuler)
  const [newEkskul, setNewEkskul] = useState({
    name: '',
    category: 'Wajib & Kepemimpinan',
    schedule: '',
    coach: '',
    desc: ''
  });

  if (!isAdminOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() !== 'administrator' || loginPassword !== 'administrator') {
      setLoginError('Username atau password tidak sesuai. Silakan periksa kembali.');
      return;
    }

    setLoginError(null);
    clearCloudAuthError();

    // If Firebase Google Admin is already verified, sign in directly
    if (isFirebaseAdmin) {
      loginAdmin(loginUsername, loginPassword);
      setLoginUsername('');
      setLoginPassword('');
      setShowLoginPassword(false);
      return;
    }

    // Connect directly to Firebase Auth + Cloud Firestore in one step
    setIsGoogleLoginLoading(true);
    const ok = await loginWithGoogleAdmin();
    setIsGoogleLoginLoading(false);

    if (ok) {
      setLoginUsername('');
      setLoginPassword('');
      setShowLoginPassword(false);
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 border border-blue-700/80 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">Masuk Menu Pengelola</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {schoolInfo.shortName || schoolInfo.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginError(null);
                clearCloudAuthError();
                setLoginPassword('');
                setIsAdminOpen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup form login"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Masuk dengan akun pengelola untuk langsung terhubung ke pengaturan website dan sinkronisasi Firebase Cloud Firestore.
            </p>

            {loginError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{loginError}</span>
              </div>
            )}

            {cloudAuthError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{cloudAuthError}</span>
                </div>
                {loginUsername.trim() === 'administrator' && loginPassword === 'administrator' && (
                  <button
                    type="button"
                    onClick={() => {
                      loginAdmin(loginUsername, loginPassword);
                      setLoginError(null);
                      setLoginUsername('');
                      setLoginPassword('');
                      setShowLoginPassword(false);
                    }}
                    className="text-[11px] font-semibold text-blue-900 hover:underline cursor-pointer"
                  >
                    Tetap masuk dalam mode lokal (offline perangkat) →
                  </button>
                )}
              </div>
            )}

            <div>
              <label htmlFor="admin-login-username" className="font-semibold text-slate-700 block mb-1.5">
                Username
              </label>
              <input
                id="admin-login-username"
                type="text"
                required
                autoFocus
                autoComplete="username"
                placeholder="Masukkan username pengelola"
                value={loginUsername}
                onChange={(e) => {
                  setLoginUsername(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="admin-login-password" className="font-semibold text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password pengelola"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label={showLoginPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  clearCloudAuthError();
                  setLoginPassword('');
                  setIsAdminOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isGoogleLoginLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{isGoogleLoginLoading ? 'Menghubungkan Firebase...' : 'Masuk & Hubungkan'}</span>
              </button>
            </div>

            {/* Direct Firebase Auth Google Admin Login */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-[11px] text-center text-slate-500 font-medium">
                atau masuk langsung dengan Akun Google Admin
              </div>
              <button
                type="button"
                disabled={isGoogleLoginLoading}
                onClick={async () => {
                  setLoginError(null);
                  setIsGoogleLoginLoading(true);
                  const ok = await loginWithGoogleAdmin();
                  setIsGoogleLoginLoading(false);
                  if (ok) {
                    setLoginUsername('');
                    setLoginPassword('');
                    setShowLoginPassword(false);
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isGoogleLoginLoading ? 'Memverifikasi Google...' : 'Masuk dengan Akun Google Admin'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // 1. Logo, School/Campus Photo & Headmaster Photo upload handlers with canvas compression & instant cloud persistence
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, SVG, WebP).');
      e.target.value = '';
      return;
    }

    try {
      const base64 = await compressImage(file, 400, 400, 0.85, 160000);
      const nextForm = { ...profileForm, logoUrl: base64 };
      setProfileForm(nextForm);
      const cleanMissions = nextForm.missions.map((m) => m.trim()).filter(Boolean);
      await updateSchoolInfo({
        ...schoolInfo,
        ...nextForm,
        missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
      });
      showSuccess('Logo sekolah berhasil diunggah & langsung tampil di website!');
    } catch {
      alert('Gagal memproses foto logo.');
    } finally {
      e.target.value = '';
    }
  };

  const handleCampusImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file foto gambar (JPG, PNG, WebP).');
      e.target.value = '';
      return;
    }

    try {
      const base64 = await compressImage(file, 1000, 700, 0.8, 220000);
      const nextForm = { ...profileForm, campusImageUrl: base64 };
      setProfileForm(nextForm);
      const cleanMissions = nextForm.missions.map((m) => m.trim()).filter(Boolean);
      await updateSchoolInfo({
        ...schoolInfo,
        ...nextForm,
        missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
      });
      showSuccess('Foto sekolah berhasil diunggah & langsung mengganti foto Gedung Terpadu di Beranda!');
    } catch {
      alert('Gagal memproses foto sekolah.');
    } finally {
      e.target.value = '';
    }
  };

  const handleHeadmasterPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file foto gambar (JPG, PNG, WebP).');
      e.target.value = '';
      return;
    }

    try {
      const base64 = await compressImage(file, 600, 750, 0.82, 180000);
      const nextForm = { ...profileForm, headmasterPhotoUrl: base64 };
      setProfileForm(nextForm);
      const cleanMissions = nextForm.missions.map((m) => m.trim()).filter(Boolean);
      await updateSchoolInfo({
        ...schoolInfo,
        ...nextForm,
        missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
      });
      showSuccess('Foto Kepala Sekolah berhasil diunggah & langsung diterapkan!');
    } catch {
      alert('Gagal memproses foto Kepala Sekolah.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMissions = profileForm.missions.map((m) => m.trim()).filter(Boolean);
    await updateSchoolInfo({
      ...schoolInfo,
      ...profileForm,
      missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
    });
    showSuccess('Profil, logo, dan foto kampus berhasil disimpan ke website & cloud!');
  };

  const handleSaveSambutanVisi = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMissions = profileForm.missions.map((m) => m.trim()).filter(Boolean);
    await updateSchoolInfo({
      ...schoolInfo,
      ...profileForm,
      missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
    });
    showSuccess('Sambutan Kepala Sekolah, Foto, serta Visi & Misi berhasil disimpan!');
  };

  // 2. Teacher Add & Excel Template/Import
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.subject) return;

    const teacherToAdd: Teacher = {
      id: 'teacher-' + Date.now(),
      name: newTeacher.name,
      nip: newTeacher.nip || '-',
      role: newTeacher.role || 'Guru Mata Pelajaran',
      subject: newTeacher.subject,
      category: newTeacher.category,
      education: newTeacher.education || 'S1 Pendidikan',
      initials: newTeacher.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      bio: newTeacher.bio || 'Mendidik dengan hati dan keteladanan di SMPN 14 Tubaba.',
      colorScheme: 'from-blue-700 to-indigo-900'
    };

    await addTeacher(teacherToAdd);
    setNewTeacher({
      name: '',
      nip: '',
      role: '',
      subject: '',
      category: 'guru',
      education: '',
      bio: ''
    });
    showSuccess('Data guru baru berhasil ditambahkan!');
  };

  // Teacher Excel Template Download (.xlsx ONLY)
  const handleDownloadTeacherTemplate = () => {
    const headers = [
      'NAMA_LENGKAP',
      'NIP',
      'MATA_PELAJARAN',
      'JABATAN_PERAN',
      'KATEGORI',
      'PENDIDIKAN_TERAKHIR',
      'CATATAN_BIO'
    ];

    const sampleRows = [
      [
        'Drs. H. Sukamto, M.Pd.',
        '19680315 199303 1 004',
        'Manajemen Pendidikan & Pembina Upacara',
        'Kepala Sekolah',
        'pimpinan',
        'S2 Magister Pendidikan (FKIP Universitas Lampung)',
        'Berpengalaman di dunia pendidikan dasar & menengah'
      ],
      [
        'Dra. Hj. Nuraini, M.Pd.',
        '19710512 199802 2 002',
        'Bahasa Indonesia',
        'Wakil Kepala Sekolah Bidang Kurikulum',
        'pimpinan',
        'S2 Pendidikan Bahasa Indonesia (UNILA)',
        'Penggerak Kurikulum Merdeka'
      ],
      [
        'Budi Santoso, S.Pd.',
        '19890412 201402 1 005',
        'Ilmu Pengetahuan Alam (IPA)',
        'Guru Mata Pelajaran',
        'guru',
        'S1 Pendidikan Fisika (ITERA)',
        'Pembina Klub Sains Sekolah'
      ]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    // Set column widths
    ws['!cols'] = [
      { wch: 28 },
      { wch: 24 },
      { wch: 30 },
      { wch: 25 },
      { wch: 14 },
      { wch: 35 },
      { wch: 40 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Dewan Guru');
    XLSX.writeFile(wb, 'Template_Data_Guru_SMPN14_Tubaba.xlsx');
    showSuccess('Template Excel Guru (.xlsx) berhasil diunduh!');
  };

  // Teacher Excel Upload (.xlsx / .xls)
  const handleTeacherExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawJson || rawJson.length <= 1) {
          alert('File Excel kosong atau hanya berisi baris header.');
          return;
        }

        const parsed: Teacher[] = [];
        // Skip row 0 (headers)
        for (let i = 1; i < rawJson.length; i++) {
          const row = rawJson[i];
          if (!row || !row[0] || !row[2]) continue;

          const name = String(row[0]).trim();
          const nip = row[1] ? String(row[1]).trim() : '-';
          const subject = String(row[2]).trim();
          const role = row[3] ? String(row[3]).trim() : 'Guru Mata Pelajaran';
          const catRaw = row[4] ? String(row[4]).toLowerCase().trim() : 'guru';
          const category: Teacher['category'] =
            catRaw.includes('pimpinan')
              ? 'pimpinan'
              : catRaw.includes('bk') || catRaw.includes('konseling')
              ? 'bk'
              : catRaw.includes('tendik') || catRaw.includes('tu') || catRaw.includes('pustaka')
              ? 'tendik'
              : 'guru';
          const education = row[5] ? String(row[5]).trim() : 'S1 Pendidikan';
          const bio = row[6] ? String(row[6]).trim() : 'Mendidik dengan penuh dedikasi di SMPN 14 Tubaba.';

          const initials = name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          parsed.push({
            id: 'teacher-' + (Date.now() + i),
            name,
            nip,
            role,
            subject,
            category,
            education,
            initials,
            bio,
            colorScheme: 'from-blue-700 to-indigo-900'
          });
        }

        if (parsed.length === 0) {
          alert('Tidak ada data guru yang valid ditemukan dalam sheet Excel.');
          return;
        }

        setTeacherImportStatus({
          total: parsed.length,
          preview: parsed
        });
      } catch (err) {
        alert('Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .xls.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApplyTeacherImport = async () => {
    if (!teacherImportStatus || teacherImportStatus.preview.length === 0) return;
    await importTeachers(teacherImportStatus.preview);
    showSuccess(`Berhasil mengimpor ${teacherImportStatus.preview.length} data guru ke sistem!`);
    setTeacherImportStatus(null);
    if (teacherFileInputRef.current) {
      teacherFileInputRef.current.value = '';
    }
  };

  // 3. Student Add & Excel Template/Import (.xlsx ONLY)
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.nisn) {
      alert('Nama lengkap dan NISN wajib diisi.');
      return;
    }

    const studentToAdd: Student = {
      id: 'std-' + Date.now(),
      nisn: newStudent.nisn.trim(),
      nis: newStudent.nis.trim() || '2414' + Math.floor(10 + Math.random() * 90),
      fullName: newStudent.fullName.trim(),
      gender: newStudent.gender,
      grade: newStudent.grade,
      rombel: newStudent.rombel || `${newStudent.grade}-A`,
      birthPlace: newStudent.birthPlace || 'Tulang Bawang Barat',
      birthDate: newStudent.birthDate || '2013-01-01',
      address: newStudent.address || 'Kab. Tulang Bawang Barat',
      parentName: newStudent.parentName || '-',
      parentPhone: newStudent.parentPhone || '-',
      status: 'Aktif'
    };

    await addStudent(studentToAdd);
    setNewStudent({
      nisn: '',
      nis: '',
      fullName: '',
      gender: 'Laki-laki',
      grade: 'VII',
      rombel: 'VII-A',
      birthPlace: 'Tulang Bawang Barat',
      birthDate: '2013-05-14',
      address: '',
      parentName: '',
      parentPhone: ''
    });
    showSuccess(`Peserta didik ${studentToAdd.fullName} berhasil ditambahkan!`);
  };

  // Student Excel Template Download (.xlsx ONLY)
  const handleDownloadStudentTemplate = () => {
    const headers = [
      'NISN',
      'NIS',
      'NAMA_LENGKAP',
      'JENIS_KELAMIN',
      'TINGKAT',
      'ROMBEL',
      'TEMPAT_LAHIR',
      'TANGGAL_LAHIR',
      'ALAMAT',
      'NAMA_ORANG_TUA',
      'NO_HP_ORTU'
    ];

    const sampleRows = [
      [
        '0129384725',
        '241411',
        'Ahmad Farhan Maulana',
        'Laki-laki',
        'VII',
        'VII-A',
        'Tulang Bawang Barat',
        '2013-06-12',
        'Tiyuh Panaragan RT 02/RW 01',
        'Maulana Yusuf',
        '081277889900'
      ],
      [
        '0128472918',
        '241412',
        'Zaskia Amelia Putri',
        'Perempuan',
        'VII',
        'VII-B',
        'Daya Murni',
        '2013-09-20',
        'Tiyuh Daya Murni Blok C',
        'Suparman',
        '085266778899'
      ],
      [
        '0117462999',
        '231415',
        'Bayu Wicaksono',
        'Laki-laki',
        'VIII',
        'VIII-A',
        'Menggala',
        '2012-03-15',
        'Kagungan Ratu RT 01',
        'Bambang S',
        '082211223344'
      ]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    ws['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 26 },
      { wch: 14 },
      { wch: 10 },
      { wch: 10 },
      { wch: 22 },
      { wch: 14 },
      { wch: 32 },
      { wch: 22 },
      { wch: 16 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Peserta Didik');
    XLSX.writeFile(wb, 'Template_Data_Peserta_Didik_SMPN14_Tubaba.xlsx');
    showSuccess('Template Excel Peserta Didik (.xlsx) berhasil diunduh!');
  };

  // Student Excel Upload (.xlsx / .xls)
  const handleStudentExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawJson || rawJson.length <= 1) {
          alert('File Excel kosong atau hanya berisi baris judul header.');
          return;
        }

        const parsed: Student[] = [];
        for (let i = 1; i < rawJson.length; i++) {
          const row = rawJson[i];
          if (!row || !row[0] || !row[2]) continue;

          const nisn = String(row[0]).trim();
          const nis = row[1] ? String(row[1]).trim() : '2414' + Math.floor(10 + Math.random() * 90);
          const fullName = String(row[2]).trim();

          const genderRaw = row[3] ? String(row[3]).trim().toLowerCase() : 'laki-laki';
          const gender: 'Laki-laki' | 'Perempuan' =
            genderRaw.startsWith('p') || genderRaw.includes('perempuan') ? 'Perempuan' : 'Laki-laki';

          const gradeRaw = row[4] ? String(row[4]).trim().toUpperCase() : 'VII';
          const grade: 'VII' | 'VIII' | 'IX' =
            gradeRaw.includes('9') || gradeRaw.includes('IX')
              ? 'IX'
              : gradeRaw.includes('8') || gradeRaw.includes('VIII')
              ? 'VIII'
              : 'VII';

          const rombel = row[5] ? String(row[5]).trim() : `${grade}-A`;
          const birthPlace = row[6] ? String(row[6]).trim() : 'Tulang Bawang Barat';
          const birthDate = row[7] ? String(row[7]).trim() : '2013-01-01';
          const address = row[8] ? String(row[8]).trim() : 'Kab. Tulang Bawang Barat';
          const parentName = row[9] ? String(row[9]).trim() : '-';
          const parentPhone = row[10] ? String(row[10]).trim() : '-';

          parsed.push({
            id: 'std-' + (Date.now() + i),
            nisn,
            nis,
            fullName,
            gender,
            grade,
            rombel,
            birthPlace,
            birthDate,
            address,
            parentName,
            parentPhone,
            status: 'Aktif'
          });
        }

        if (parsed.length === 0) {
          alert('Tidak ada data peserta didik yang valid ditemukan dalam file Excel.');
          return;
        }

        setStudentImportStatus({
          total: parsed.length,
          preview: parsed
        });
      } catch (err) {
        alert('Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .xls.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApplyStudentImport = async () => {
    if (!studentImportStatus || studentImportStatus.preview.length === 0) return;
    await importStudents(studentImportStatus.preview);
    showSuccess(`Berhasil mengimpor ${studentImportStatus.preview.length} data peserta didik!`);
    setStudentImportStatus(null);
    if (studentFileInputRef.current) {
      studentFileInputRef.current.value = '';
    }
  };

  // 4. Announcement Add, Photo Cover Upload & Document Upload
  const handleAnnouncementImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    try {
      const base64 = await compressImage(file, 900, 600, 0.82);
      setNewAnnouncement((prev) => ({
        ...prev,
        imageUrl: base64
      }));
      showSuccess(`Foto warta "${file.name}" berhasil diunggah & dioptimalkan!`);
    } catch (err) {
      alert('Gagal memproses gambar berita.');
    }
  };

  const handleAnnouncementFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 400 * 1024) {
      alert('Ukuran lampiran maksimal 400KB untuk menjaga efisiensi database cloud.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewAnnouncement((prev) => ({
        ...prev,
        documentName: file.name,
        documentUrl: base64
      }));
      showSuccess(`Berkas ${file.name} berhasil diunggah sebagai lampiran!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const annToAdd: Announcement = {
      id: 'ann-' + Date.now(),
      title: newAnnouncement.title,
      category: newAnnouncement.category,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      dateIso: new Date().toISOString().split('T')[0],
      summary: newAnnouncement.summary || newAnnouncement.title,
      content: newAnnouncement.content,
      imageUrl: newAnnouncement.imageUrl || undefined,
      documentName: newAnnouncement.documentName || 'Surat_Edaran_2026.pdf',
      documentUrl: newAnnouncement.documentUrl || undefined,
      important: false
    };

    await addAnnouncement(annToAdd);
    setNewAnnouncement({
      title: '',
      category: 'Berita',
      summary: '',
      content: '',
      imageUrl: '',
      documentName: 'Surat_Edaran_2026.pdf',
      documentUrl: ''
    });
    if (announcementFileInputRef.current) {
      announcementFileInputRef.current.value = '';
    }
    if (announcementImageInputRef.current) {
      announcementImageInputRef.current.value = '';
    }
    showSuccess('Pengumuman / Berita resmi beserta foto dan lampiran berhasil dipublikasikan!');
  };

  // 5. Activity Add & Photo Upload
  const handleActivityImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file foto gambar (JPG, PNG, WebP).');
      return;
    }

    try {
      const base64 = await compressImage(file, 1000, 750, 0.82);
      setNewActivity((prev) => ({
        ...prev,
        image: base64
      }));
      showSuccess(`Foto ${file.name} berhasil diunggah & dioptimalkan!`);
    } catch (err) {
      alert('Gagal memproses foto kegiatan.');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title) return;

    const actToAdd: ActivityPhoto = {
      id: 'act-' + Date.now(),
      title: newActivity.title,
      category: newActivity.category,
      categoryLabel: newActivity.categoryLabel,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      location: newActivity.location,
      image: newActivity.image || '/src/assets/images/activity_ceremony_1792594019651.jpg',
      caption: newActivity.caption || newActivity.title
    };

    await addActivity(actToAdd);
    setNewActivity({
      title: '',
      category: 'akademik',
      categoryLabel: 'Sains & Lab',
      location: 'Kampus SMPN 14 Tubaba',
      caption: '',
      image: ''
    });
    if (activityImageInputRef.current) {
      activityImageInputRef.current.value = '';
    }
    showSuccess('Dokumentasi foto kegiatan baru berhasil ditambahkan ke galeri!');
  };

  // 6. Morning Activity (Kegiatan Pagi) Add & Photo Upload
  const handleMorningImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file foto gambar (JPG, PNG, WebP).');
      e.target.value = '';
      return;
    }

    try {
      const base64 = await compressImage(file, 960, 720, 0.8, 200000);
      setNewMorning((prev) => ({ ...prev, imageUrl: base64 }));
      showSuccess(`Foto kegiatan pagi ${file.name} siap ditambahkan!`);
    } catch {
      alert('Gagal memproses foto kegiatan pagi.');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddMorningActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMorning.title.trim()) return;

    const item: MorningActivity = {
      id: 'pagi-' + Date.now(),
      day: newMorning.day,
      time: newMorning.time || '07.00 – 07.30 WIB',
      title: newMorning.title.trim(),
      coordinator: newMorning.coordinator.trim() || 'Tim Guru Piket',
      location: newMorning.location.trim() || 'Lingkungan SMPN 14 Tubaba',
      description: newMorning.description.trim() || newMorning.title.trim(),
      imageUrl: newMorning.imageUrl || '/src/assets/images/activity_ceremony_1792594019651.jpg'
    };

    await addMorningActivity(item);
    setNewMorning({
      day: 'Setiap Pagi',
      time: '07.00 – 07.30 WIB',
      title: '',
      coordinator: 'Tim Guru Piket & Pembina OSIS',
      location: 'Lapangan Utama SMPN 14',
      description: '',
      imageUrl: ''
    });
    if (morningImageInputRef.current) {
      morningImageInputRef.current.value = '';
    }
    showSuccess('Program Kegiatan Pagi baru berhasil ditambahkan & disinkronkan!');
  };

  // 7. Extracurricular Add
  const handleAddEkskul = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEkskul.name.trim()) return;

    const item: ExtracurricularItem = {
      id: 'ekskul-' + Date.now(),
      name: newEkskul.name.trim(),
      category: newEkskul.category.trim() || 'Pengembangan Diri',
      schedule: newEkskul.schedule.trim() || 'Jadwal menyusul',
      coach: newEkskul.coach.trim() || 'Tim Pembina Ekstrakurikuler',
      desc: newEkskul.desc.trim() || newEkskul.name.trim()
    };

    await addExtracurricular(item);
    setNewEkskul({
      name: '',
      category: 'Wajib & Kepemimpinan',
      schedule: '',
      coach: '',
      desc: ''
    });
    showSuccess('Program Ekstrakurikuler baru berhasil ditambahkan & disinkronkan!');
  };

  // Filtered students inside admin table
  const filteredAdminStudents = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.includes(studentSearch) ||
      s.rombel.toLowerCase().includes(studentSearch.toLowerCase());
    const matchGrade = studentGradeFilter === 'all' || s.grade === studentGradeFilter;
    return matchSearch && matchGrade;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-800 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                <span>Panel Pengelola Data Sekolah</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-amber-300 border border-blue-800 font-mono">
                  SMPN 14 TUBABA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sesi Pengelola:{' '}
                <span className="text-amber-400 font-mono">
                  {isFirebaseAdmin && firebaseUser?.email ? firebaseUser.email : 'administrator'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFirebaseAdmin ? (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Firebase Auth Terverifikasi</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={isGoogleLoginLoading}
                onClick={async () => {
                  setIsGoogleLoginLoading(true);
                  const ok = await loginWithGoogleAdmin();
                  setIsGoogleLoginLoading(false);
                  if (ok) {
                    showSuccess('Firebase Auth Admin berhasil terhubung!');
                  }
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                title="Hubungkan Akun Google Admin agar penulisan Firestore diizinkan oleh aturan keamanan"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isGoogleLoginLoading ? 'Memverifikasi...' : 'Hubungkan Google Admin'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (confirm('Kembalikan seluruh data ke pengaturan awal (default)?')) {
                  resetToDefault();
                  showSuccess('Data telah dikembalikan ke pengaturan default.');
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset ke data bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Keluar dari sesi pengelola"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Sidebar + Main Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Vertical Navigation Sidebar */}
          <aside className="w-56 sm:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 p-3 sm:p-4 text-slate-300">
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Menu Pengelola
              </div>

              <button
                onClick={() => setActiveTab('profil')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'profil'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <School className="w-4 h-4 shrink-0" />
                <span className="truncate">Profil, Logo &amp; Kampus</span>
              </button>

              <button
                onClick={() => setActiveTab('sambutan-visi')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'sambutan-visi'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Quote className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="truncate">Sambutan &amp; Visi Misi</span>
              </button>

              <button
                onClick={() => setActiveTab('guru')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'guru'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span className="truncate">Dewan Guru</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {teachers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('peserta-didik')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'peserta-didik'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Users className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate font-semibold">Peserta Didik</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono font-bold">
                  {students.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ekstrakurikuler')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'ekstrakurikuler'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Compass className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate">Ekstrakurikuler</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {extracurriculars.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('pengumuman')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'pengumuman'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span className="truncate">Pengumuman &amp; Berita</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('galeri')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'galeri'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="truncate">Galeri Foto</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {activities.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('kegiatan-pagi')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'kegiatan-pagi'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Sun className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="truncate">Kegiatan Pagi</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {morningActivities.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ppdb')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'ppdb'
                    ? 'bg-blue-900 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">Verifikasi PPDB</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                  {applicants.length}
                </span>
              </button>
            </div>

            {/* Sidebar Footer: Firebase Realtime Status & Link */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <Database className="w-3.5 h-3.5" />
                    <span>Firebase Realtime</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800/80">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Database Firestore online &amp; realtime aktif.
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0264495138/firestore/databases/ai-studio-smpn14tulangbawa-ad2f4c9b-a0c5-4060-9a23-715dbdbcc1f8/data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-blue-900/90 hover:bg-blue-800 text-white rounded-lg text-[10px] font-semibold transition-colors"
                  >
                    <span>Buka Firebase Console</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                  <button
                    onClick={async () => {
                      setIsCloudSyncing(true);
                      const ok = await syncAllToCloud();
                      setIsCloudSyncing(false);
                      if (ok) {
                        showSuccess('Seluruh data website berhasil disinkronkan ke Firebase Firestore!');
                      }
                    }}
                    disabled={isCloudSyncing}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span>{isCloudSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data ke Cloud'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>Format Excel (.xlsx) Murni</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
            {/* Firebase Auth Security Verification Banner */}
            {!isFirebaseAdmin && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">
                      Verifikasi Firebase Auth Diperlukan untuk Simpan ke Cloud
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {cloudAuthError ||
                        'Aturan keamanan Firestore aktif (hanya admin terverifikasi yang dapat menulis data). Hubungkan akun Google Admin (imamarifin55@admin.smp.belajar.id) agar perubahan tersimpan permanen ke server cloud.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isGoogleLoginLoading}
                  onClick={async () => {
                    setIsGoogleLoginLoading(true);
                    const ok = await loginWithGoogleAdmin();
                    setIsGoogleLoginLoading(false);
                    if (ok) {
                      showSuccess('Akun Google Admin terverifikasi! Siap sinkronisasi ke Firestore.');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isGoogleLoginLoading ? 'Memverifikasi...' : 'Hubungkan Google Admin'}</span>
                </button>
              </div>
            )}

            {/* TAB: PROFIL SEKOLAH, LOGO & UNGGAH FOTO KAMPUS */}
            {activeTab === 'profil' && (
              <form onSubmit={handleSaveProfile} className="max-w-3xl space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pengaturan Identitas, Logo &amp; Foto Kampus</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unggah logo resmi, foto gedung kampus SMPN 14 Tubaba, dan perbarui profil sekolah.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sambutan-visi')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-semibold cursor-pointer self-start sm:self-auto"
                  >
                    <Quote className="w-3.5 h-3.5 text-amber-600" />
                    <span>Edit Sambutan Kepsek &amp; Visi Misi</span>
                  </button>
                </div>

                {/* Fitur Unggah Logo Sekolah */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Logo Resmi SMPN 14 Tulang Bawang Barat</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Logo Preview Container (Clean & Transparent without blue background) */}
                    <div className="w-28 h-28 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 p-1 relative">
                      {profileForm.logoUrl ? (
                        <img
                          src={profileForm.logoUrl}
                          alt="Logo Sekolah"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <School className="w-9 h-9 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] block">Belum ada logo</span>
                        </div>
                      )}
                    </div>

                    {/* Logo Upload Actions */}
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <p className="text-xs font-semibold text-slate-800">
                        Pilih file logo sekolah (Format: PNG transparan, JPG, WebP, SVG)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Logo tampil besar dan jernih tanpa latar belakang biru pada Header Navigasi dan Footer website.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label
                          htmlFor="school-logo-input"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Pilih Foto Logo</span>
                        </label>
                        <input
                          ref={logoInputRef}
                          type="file"
                          id="school-logo-input"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />

                        {profileForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => ({ ...prev, logoUrl: '' }));
                              if (logoInputRef.current) logoInputRef.current.value = '';
                              showSuccess('Logo dihapus. Klik Simpan Perubahan untuk menerapkan.');
                            }}
                            className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            Hapus Logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitur Upload Foto Sekolah (Mengganti Foto Gedung Terpadu) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Upload Foto Sekolah (Mengganti Foto Gedung Terpadu)</span>
                    </h4>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      Otomatis tersimpan ke Beranda
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* School Photo Live Preview with Gedung Terpadu overlay */}
                    <div className="relative w-full sm:w-64 h-40 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={profileForm.campusImageUrl || '/src/assets/images/hero_smpn14_building_1792594018035.jpg'}
                        alt="Pratinjau Foto Sekolah Gedung Terpadu"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent flex flex-col justify-end p-3 text-white pointer-events-none">
                        <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                          Pratinjau Tampilan Beranda
                        </span>
                        <p className="text-xs font-bold leading-snug truncate">
                          {profileForm.campusTitle || 'Gedung Terpadu SMPN 14 Tubaba'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <p className="text-xs font-semibold text-slate-800">
                        Ganti Foto Bangunan / Gedung Sekolah SMPN 14 Tulang Bawang Barat
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Foto yang Anda unggah di sini akan langsung menggantikan foto default dengan keterangan{' '}
                        <strong className="text-slate-700">&ldquo;Gedung Terpadu&rdquo;</strong> pada halaman utama (Beranda) secara realtime.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label
                          htmlFor="campus-photo-input"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>{profileForm.campusImageUrl ? 'Ganti Foto Sekolah' : 'Upload Foto Sekolah'}</span>
                        </label>
                        <input
                          ref={campusImageInputRef}
                          type="file"
                          id="campus-photo-input"
                          accept="image/*"
                          onChange={handleCampusImageUpload}
                          className="hidden"
                        />

                        {profileForm.campusImageUrl && (
                          <button
                            type="button"
                            onClick={async () => {
                              const nextForm = { ...profileForm, campusImageUrl: '' };
                              setProfileForm(nextForm);
                              if (campusImageInputRef.current) campusImageInputRef.current.value = '';
                              const cleanMissions = nextForm.missions.map((m) => m.trim()).filter(Boolean);
                              await updateSchoolInfo({
                                ...schoolInfo,
                                ...nextForm,
                                missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
                              });
                              showSuccess('Foto sekolah dikembalikan ke foto Gedung Terpadu bawaan!');
                            }}
                            className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            Kembalikan Foto Bawaan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Keterangan Judul Foto (Pengganti &ldquo;Gedung Terpadu&rdquo;)
                      </label>
                      <input
                        type="text"
                        value={profileForm.campusTitle}
                        onChange={(e) => setProfileForm({ ...profileForm, campusTitle: e.target.value })}
                        placeholder="Gedung Terpadu SMPN 14 Tubaba"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Keterangan Deskripsi Singkat Sekolah
                      </label>
                      <input
                        type="text"
                        value={profileForm.campusDescription}
                        onChange={(e) => setProfileForm({ ...profileForm, campusDescription: e.target.value })}
                        placeholder="Dilengkapi ruang belajar sejuk, laboratorium sains terpadu..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        const cleanMissions = profileForm.missions.map((m) => m.trim()).filter(Boolean);
                        await updateSchoolInfo({
                          ...schoolInfo,
                          ...profileForm,
                          missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
                        });
                        showSuccess('Foto Sekolah & keterangan Gedung Terpadu berhasil disimpan ke Beranda!');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                      <span>Simpan Foto &amp; Keterangan Sekolah</span>
                    </button>
                  </div>
                </div>

                {/* Pengaturan Header Judul Utama & Pita Pengumuman Atas (Landing Page) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Teks Header Berita &amp; Judul Utama Beranda (Landing Page)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Mengubah judul besar &ldquo;Mendidik Generasi...&rdquo; dan pita pengumuman atas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Judul Utama Header Halaman Depan (Headline)
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroHeadline}
                        onChange={(e) => setProfileForm({ ...profileForm, heroHeadline: e.target.value })}
                        placeholder="Mendidik Generasi Berilmu, Berakhlak Mulia & Berbudaya"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Kata Sorotan Biru (Akhir Judul)
                      </label>
                      <input
                        type="text"
                        value={profileForm.heroHighlight}
                        onChange={(e) => setProfileForm({ ...profileForm, heroHighlight: e.target.value })}
                        placeholder="Nenemo"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-blue-900 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Paragraf Pengantar di Bawah Judul Utama
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.heroDescription}
                      onChange={(e) => setProfileForm({ ...profileForm, heroDescription: e.target.value })}
                      placeholder="Selamat datang di portal resmi SMP Negeri 14 Tulang Bawang Barat..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Label Pita Pengumuman Atas
                      </label>
                      <input
                        type="text"
                        value={profileForm.topBarLabel}
                        onChange={(e) => setProfileForm({ ...profileForm, topBarLabel: e.target.value })}
                        placeholder="PENGUMUMAN PPDB:"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-amber-700 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Isi Teks Pita Pengumuman Paling Atas
                      </label>
                      <input
                        type="text"
                        value={profileForm.topBarText}
                        onChange={(e) => setProfileForm({ ...profileForm, topBarText: e.target.value })}
                        placeholder="Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        const cleanMissions = profileForm.missions.map((m) => m.trim()).filter(Boolean);
                        await updateSchoolInfo({
                          ...schoolInfo,
                          ...profileForm,
                          missions: cleanMissions.length > 0 ? cleanMissions : schoolInfo.missions
                        });
                        showSuccess('Teks Header & Pengumuman Atas berhasil diperbarui di Landing Page!');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                      <span>Simpan Header Halaman Depan</span>
                    </button>
                  </div>
                </div>

                {/* Form Data Sekolah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nama Resmi Sekolah (Lengkap)
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nama Singkatan / Sebutan Populer (Header &amp; Navigasi)
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.shortName}
                      onChange={(e) => setProfileForm({ ...profileForm, shortName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nama Kepala Sekolah &amp; Gelar
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.headmaster}
                      onChange={(e) => setProfileForm({ ...profileForm, headmaster: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      NPSN (Nomor Pokok Sekolah Nasional)
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.npsn}
                      onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Status Akreditasi
                    </label>
                    <input
                      type="text"
                      value={profileForm.accreditation}
                      onChange={(e) => setProfileForm({ ...profileForm, accreditation: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      SK Pendirian / Izin Operasional
                    </label>
                    <input
                      type="text"
                      value={profileForm.decreeNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, decreeNumber: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Semboyan Budaya Daerah
                    </label>
                    <input
                      type="text"
                      value={profileForm.mottoLocal}
                      onChange={(e) => setProfileForm({ ...profileForm, mottoLocal: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nilai Karakter / Falsafah Sekolah
                    </label>
                    <input
                      type="text"
                      value={profileForm.mottoValues}
                      onChange={(e) => setProfileForm({ ...profileForm, mottoValues: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Jam Operasional Sekolah
                    </label>
                    <input
                      type="text"
                      value={profileForm.workingHours}
                      onChange={(e) => setProfileForm({ ...profileForm, workingHours: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nomor WhatsApp Humas / PPDB
                    </label>
                    <input
                      type="text"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nomor Telepon Kantor
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Alamat Lengkap Sekolah (Kecamatan &amp; Kabupaten)
                    </label>
                    <textarea
                      rows={2}
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Simpan Perubahan Profil, Logo &amp; Foto Kampus</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SAMBUTAN KEPALA SEKOLAH, FOTO KEPSEK & VISI MISI */}
            {activeTab === 'sambutan-visi' && (
              <form onSubmit={handleSaveSambutanVisi} className="max-w-3xl space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Sambutan Kepala Sekolah, Foto &amp; Visi Misi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggah foto resmi Kepala Sekolah, ubah kata sambutan, serta kelola Visi dan Misi sekolah yang tampil di website.
                  </p>
                </div>

                {/* Card 1: Foto & Identitas Kepala Sekolah */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Foto &amp; Profil Kepala Sekolah</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Foto Kepala Sekolah Preview */}
                    <div className="w-32 h-36 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {profileForm.headmasterPhotoUrl ? (
                        <img
                          src={profileForm.headmasterPhotoUrl}
                          alt="Foto Kepala Sekolah"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="text-center text-slate-400 p-2">
                          <GraduationCap className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] block">Belum ada foto</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs font-semibold text-slate-800">
                        Unggah Foto Resmi Kepala Sekolah
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Format JPG, PNG, atau WebP. Foto potret akan otomatis disesuaikan dan tampil pada bagian Sambutan Kepala Sekolah.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label
                          htmlFor="headmaster-photo-input"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>{profileForm.headmasterPhotoUrl ? 'Ganti Foto Kepala Sekolah' : 'Unggah Foto Kepala Sekolah'}</span>
                        </label>
                        <input
                          ref={headmasterPhotoInputRef}
                          type="file"
                          id="headmaster-photo-input"
                          accept="image/*"
                          onChange={handleHeadmasterPhotoUpload}
                          className="hidden"
                        />

                        {profileForm.headmasterPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => ({ ...prev, headmasterPhotoUrl: '' }));
                              if (headmasterPhotoInputRef.current) headmasterPhotoInputRef.current.value = '';
                              showSuccess('Foto Kepala Sekolah dihapus. Kembali ke tampilan inisial.');
                            }}
                            className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Kepala Sekolah</label>
                      <input
                        type="text"
                        required
                        value={profileForm.headmaster}
                        onChange={(e) => setProfileForm({ ...profileForm, headmaster: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                      <input
                        type="text"
                        value={profileForm.headmasterNip}
                        onChange={(e) => setProfileForm({ ...profileForm, headmasterNip: e.target.value })}
                        placeholder="19680315 199303 1 004"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Pendidikan / Gelar Akademik</label>
                      <input
                        type="text"
                        value={profileForm.headmasterEducation}
                        onChange={(e) => setProfileForm({ ...profileForm, headmasterEducation: e.target.value })}
                        placeholder="Magister Manajemen Pendidikan (UNILA)"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Isi Kata Sambutan Kepala Sekolah *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={profileForm.headmasterQuote}
                      onChange={(e) => setProfileForm({ ...profileForm, headmasterQuote: e.target.value })}
                      placeholder="Tuliskan kata sambutan resmi Kepala Sekolah..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Card 2: Visi & Misi Sekolah */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Visi &amp; Misi Sekolah</span>
                  </h4>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Visi Sekolah *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={profileForm.vision}
                      onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                      placeholder="Tuliskan rumusan visi sekolah..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>Daftar Poin Misi Sekolah ({profileForm.missions.length} Poin)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setProfileForm((prev) => ({
                            ...prev,
                            missions: [...prev.missions, '']
                          }))
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Poin Misi</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {profileForm.missions.map((misi, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="mt-2.5 w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={misi}
                            onChange={(e) => {
                              const nextMissions = [...profileForm.missions];
                              nextMissions[idx] = e.target.value;
                              setProfileForm({ ...profileForm, missions: nextMissions });
                            }}
                            placeholder={`Tuliskan poin misi ke-${idx + 1}...`}
                            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                          />
                          {profileForm.missions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextMissions = profileForm.missions.filter((_, i) => i !== idx);
                                setProfileForm({ ...profileForm, missions: nextMissions });
                              }}
                              className="mt-1.5 p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus poin misi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Simpan Sambutan Kepsek &amp; Visi Misi</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: DEWAN GURU (DENGAN TEMPLATE EXCEL & IMPOR EXCEL .XLSX) */}
            {activeTab === 'guru' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Kelola &amp; Impor Data Dewan Guru</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                        {teachers.length} Guru
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fasilitas impor file Excel (.xlsx) murni dan input manual dewan guru aktif.
                    </p>
                  </div>

                  {/* Excel Action Buttons for Teachers */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadTeacherTemplate}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-900" />
                      <span>Unduh Template Excel Guru (.xlsx)</span>
                    </button>

                    <label
                      htmlFor="teacher-excel-importer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>Pilih File Excel Guru</span>
                    </label>
                    <input
                      ref={teacherFileInputRef}
                      type="file"
                      id="teacher-excel-importer"
                      accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleTeacherExcelUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Teacher Excel Import Preview Banner */}
                {teacherImportStatus && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            File Excel Guru Terbaca: {teacherImportStatus.total} Data Guru Siap Diimpor
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Data akan diselaraskan berdasarkan NIP atau nama guru.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setTeacherImportStatus(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-amber-100/60"
                        title="Batal impor"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-52 overflow-y-auto border border-amber-200 rounded-xl bg-white text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3">Nama Lengkap</th>
                            <th className="py-2 px-3 font-mono">NIP</th>
                            <th className="py-2 px-3">Mata Pelajaran</th>
                            <th className="py-2 px-3">Jabatan</th>
                            <th className="py-2 px-3">Kategori</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {teacherImportStatus.preview.slice(0, 10).map((t, i) => (
                            <tr key={i} className="hover:bg-amber-50/40">
                              <td className="py-1.5 px-3 font-semibold text-slate-900">{t.name}</td>
                              <td className="py-1.5 px-3 font-mono text-slate-600">{t.nip}</td>
                              <td className="py-1.5 px-3">{t.subject}</td>
                              <td className="py-1.5 px-3 text-slate-700">{t.role}</td>
                              <td className="py-1.5 px-3 uppercase text-[10px] font-bold text-blue-900">{t.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500">
                        {teacherImportStatus.total > 10 ? `Menampilkan 10 dari total ${teacherImportStatus.total} guru.` : `Semua ${teacherImportStatus.total} data ditampilkan.`}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTeacherImportStatus(null)}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyTeacherImport}
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Terapkan Impor Guru ({teacherImportStatus.total})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add form */}
                <form onSubmit={handleAddTeacher} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Guru / Tenaga Kependidikan Manual</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso, S.Pd."
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">NIP (Opsional)</label>
                      <input
                        type="text"
                        placeholder="1985..."
                        value={newTeacher.nip}
                        onChange={(e) => setNewTeacher({ ...newTeacher, nip: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran Diampu *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Bahasa Inggris"
                        value={newTeacher.subject}
                        onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Jabatan / Peran</label>
                      <input
                        type="text"
                        placeholder="Contoh: Guru Mata Pelajaran / Wali Kelas"
                        value={newTeacher.role}
                        onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                      <select
                        value={newTeacher.category}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, category: e.target.value as Teacher['category'] })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="guru">Guru Mata Pelajaran</option>
                        <option value="pimpinan">Pimpinan Sekolah</option>
                        <option value="bk">Bimbingan Konseling (BK)</option>
                        <option value="tendik">Tata Usaha &amp; Perpustakaan</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Pendidikan Terakhir</label>
                      <input
                        type="text"
                        placeholder="Contoh: S1 Pendidikan Fisika (UNILA)"
                        value={newTeacher.education}
                        onChange={(e) => setNewTeacher({ ...newTeacher, education: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Tambahkan ke Direktori Guru</span>
                    </button>
                  </div>
                </form>

                {/* Existing Teachers List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Daftar Guru Terdaftar ({teachers.length} Orang)
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{teacher.name}</div>
                          <div className="text-slate-500 font-mono text-[11px]">NIP. {teacher.nip} · {teacher.subject}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {teacher.role}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingTeacher(teacher)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit data guru"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${teacher.name} dari daftar guru?`)) {
                                deleteTeacher(teacher.id);
                                showSuccess('Guru berhasil dihapus.');
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus data guru"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PESERTA DIDIK (TEMPLATE EXCEL & IMPOR EXCEL .XLSX) */}
            {activeTab === 'peserta-didik' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Section */}
                <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Kelola &amp; Impor Data Peserta Didik</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                        {students.length} Siswa
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fasilitas impor file Excel (.xlsx) murni dan input mandiri data siswa aktif.
                    </p>
                  </div>

                  {/* Top Action Buttons - Excel Only */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadStudentTemplate}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-900" />
                      <span>Unduh Template Excel Siswa (.xlsx)</span>
                    </button>

                    <label
                      htmlFor="student-excel-importer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>Pilih File Excel Siswa</span>
                    </label>
                    <input
                      ref={studentFileInputRef}
                      type="file"
                      id="student-excel-importer"
                      accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleStudentExcelUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Import Preview Banner if file loaded */}
                {studentImportStatus && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            File Excel Siswa Terbaca: {studentImportStatus.total} Data Siswa Siap Diimpor
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Data akan otomatis diselaraskan berdasarkan nomor NISN yang unik.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setStudentImportStatus(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-amber-100/60"
                        title="Batal impor"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-52 overflow-y-auto border border-amber-200 rounded-xl bg-white text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 font-mono">NISN</th>
                            <th className="py-2 px-3">Nama Lengkap</th>
                            <th className="py-2 px-3">L/P</th>
                            <th className="py-2 px-3">Rombel</th>
                            <th className="py-2 px-3">Orang Tua</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentImportStatus.preview.slice(0, 10).map((st, i) => (
                            <tr key={i} className="hover:bg-amber-50/40">
                              <td className="py-1.5 px-3 font-mono font-medium text-blue-900">{st.nisn}</td>
                              <td className="py-1.5 px-3 font-semibold text-slate-900">{st.fullName}</td>
                              <td className="py-1.5 px-3">{st.gender}</td>
                              <td className="py-1.5 px-3 font-mono">{st.rombel}</td>
                              <td className="py-1.5 px-3 text-slate-600">{st.parentName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500">
                        {studentImportStatus.total > 10 ? `Menampilkan 10 dari total ${studentImportStatus.total} data baris.` : `Semua ${studentImportStatus.total} baris ditampilkan.`}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStudentImportStatus(null)}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyStudentImport}
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Terapkan Impor Data ({studentImportStatus.total})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Input Manual Siswa */}
                <form
                  onSubmit={handleAddStudent}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Input Manual Data Siswa Baru</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Farhan"
                        value={newStudent.fullName}
                        onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">NISN (10 Digit) *</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder="Contoh: 0129384725"
                        value={newStudent.nisn}
                        onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">NIS Sekolah</label>
                      <input
                        type="text"
                        placeholder="Contoh: 241415"
                        value={newStudent.nis}
                        onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin</label>
                      <select
                        value={newStudent.gender}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, gender: e.target.value as 'Laki-laki' | 'Perempuan' })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tingkat Kelas</label>
                      <select
                        value={newStudent.grade}
                        onChange={(e) => {
                          const gr = e.target.value as 'VII' | 'VIII' | 'IX';
                          setNewStudent({ ...newStudent, grade: gr, rombel: `${gr}-A` });
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="VII">Kelas VII (Tujuh)</option>
                        <option value="VIII">Kelas VIII (Delapan)</option>
                        <option value="IX">Kelas IX (Sembilan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Rombel / Kelas</label>
                      <input
                        type="text"
                        placeholder="Contoh: VII-A, VIII-B"
                        value={newStudent.rombel}
                        onChange={(e) => setNewStudent({ ...newStudent, rombel: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Orang Tua</label>
                      <input
                        type="text"
                        placeholder="Nama Ayah/Ibu"
                        value={newStudent.parentName}
                        onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Alamat Domisili</label>
                      <input
                        type="text"
                        placeholder="Contoh: Tiyuh Panaragan Jaya RT 02"
                        value={newStudent.address}
                        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">No HP / WA Ortu</label>
                      <input
                        type="text"
                        placeholder="0812..."
                        value={newStudent.parentPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4 text-amber-300" />
                        <span>Simpan Siswa</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Table List inside Admin */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Filter Tingkat:</span>
                      {(['all', 'VII', 'VIII', 'IX'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setStudentGradeFilter(g)}
                          className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                            studentGradeFilter === g
                              ? 'bg-blue-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {g === 'all' ? 'Semua' : `Kelas ${g}`}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-[240px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Cari siswa atau NISN..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 font-mono">NISN</th>
                            <th className="py-2.5 px-3">Nama Siswa</th>
                            <th className="py-2.5 px-3">L/P</th>
                            <th className="py-2.5 px-3 font-mono">Rombel</th>
                            <th className="py-2.5 px-3">Alamat</th>
                            <th className="py-2.5 px-3">Orang Tua</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredAdminStudents.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono font-medium text-blue-900">{st.nisn}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{st.fullName}</td>
                              <td className="py-2 px-3">{st.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                              <td className="py-2 px-3 font-mono font-semibold">{st.rombel}</td>
                              <td className="py-2 px-3 text-slate-600 truncate max-w-xs">{st.address}</td>
                              <td className="py-2 px-3 text-slate-600">{st.parentName}</td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingStudent(st)}
                                    className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="Edit data siswa"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus data peserta didik ${st.fullName}?`)) {
                                        deleteStudent(st.id);
                                        showSuccess('Data siswa telah dihapus.');
                                      }
                                    }}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                    title="Hapus siswa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EKSTRAKURIKULER */}
            {activeTab === 'ekstrakurikuler' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Program Ekstrakurikuler Siswa</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tambah, ubah jadwal, pembina, atau hapus daftar ekstrakurikuler yang tampil di submenu Peserta Didik &amp; Ekstrakurikuler.
                  </p>
                </div>

                <form onSubmit={handleAddEkskul} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>Tambah Ekstrakurikuler Baru</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Ekstrakurikuler *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Paskibra SMPN 14 / Klub Coding"
                        value={newEkskul.name}
                        onChange={(e) => setNewEkskul({ ...newEkskul, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori Bidang</label>
                      <select
                        value={newEkskul.category}
                        onChange={(e) => setNewEkskul({ ...newEkskul, category: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="Wajib & Kepemimpinan">Wajib &amp; Kepemimpinan</option>
                        <option value="Seni Budaya">Seni Budaya</option>
                        <option value="Kemanusiaan">Kemanusiaan</option>
                        <option value="Olahraga Prestasi">Olahraga Prestasi</option>
                        <option value="Akademik Unggulan">Akademik Unggulan</option>
                        <option value="Keagamaan">Keagamaan</option>
                        <option value="Teknologi & Literasi">Teknologi &amp; Literasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Jadwal Latihan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sabtu, 14.00 - 16.00 WIB"
                        value={newEkskul.schedule}
                        onChange={(e) => setNewEkskul({ ...newEkskul, schedule: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Pembina / Pelatih *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pak Bagus Prakoso, S.Pd."
                        value={newEkskul.coach}
                        onChange={(e) => setNewEkskul({ ...newEkskul, coach: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Deskripsi Kegiatan &amp; Materi</label>
                      <textarea
                        rows={2}
                        placeholder="Jelaskan fokus pembinaan, prestasi, dan keterampilan yang dilatih..."
                        value={newEkskul.desc}
                        onChange={(e) => setNewEkskul({ ...newEkskul, desc: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Simpan Ekstrakurikuler</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Daftar Ekstrakurikuler Aktif ({extracurriculars.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    {extracurriculars.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] font-semibold text-blue-900">· {item.category}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5 truncate">
                            {item.schedule} · Pembina: {item.coach}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingEkskul(item)}
                            className="p-1.5 text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit ekstrakurikuler"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus program ekstrakurikuler "${item.name}"?`)) {
                                deleteExtracurricular(item.id);
                                showSuccess('Program ekstrakurikuler telah dihapus.');
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus ekstrakurikuler"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PENGUMUMAN (DENGAN FITUR UPLOAD LAMPIRAN BERKAS/PDF) */}
            {activeTab === 'pengumuman' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Pengumuman &amp; Berita Sekolah</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Terbitkan pengumuman, berita sekolah, atau surat edaran baru beserta unggah berkas PDF / dokumen lampiran.
                  </p>
                </div>

                <form onSubmit={handleAddAnnouncement} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Publikasikan Pengumuman / Berita Baru</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Judul Pengumuman / Berita *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Tim Sains SMPN 14 Meraih Juara 1 / Jadwal Asesmen Sumatif"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                      <select
                        value={newAnnouncement.category}
                        onChange={(e) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            category: e.target.value as Announcement['category']
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="Berita">Berita &amp; Prestasi Sekolah</option>
                        <option value="Akademik">Akademik &amp; Jadwal</option>
                        <option value="PPDB">PPDB 2026</option>
                        <option value="Kesiswaan">Kesiswaan &amp; Ekstrakurikuler</option>
                        <option value="Edaran">Surat Edaran Dinas</option>
                      </select>
                    </div>

                    {/* Fitur Upload File Dokumen Lampiran Pengumuman */}
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Unggah Berkas Lampiran (PDF / Dokumen)
                      </label>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="ann-file-upload"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 cursor-pointer transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-blue-900" />
                          <span className="truncate">
                            {newAnnouncement.documentUrl ? newAnnouncement.documentName : 'Pilih Berkas Lampiran'}
                          </span>
                        </label>
                        <input
                          ref={announcementFileInputRef}
                          type="file"
                          id="ann-file-upload"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={handleAnnouncementFileUpload}
                          className="hidden"
                        />
                        {newAnnouncement.documentUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewAnnouncement((prev) => ({ ...prev, documentUrl: '', documentName: 'Surat_Edaran_2026.pdf' }));
                              if (announcementFileInputRef.current) announcementFileInputRef.current.value = '';
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Hapus berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        File maksimal 5MB (PDF/Doc). Siswa dan wali dapat langsung mengunduhnya di website.
                      </span>
                    </div>

                    {/* Fitur Upload Foto Warta / Berita */}
                    <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-28 h-20 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          {newAnnouncement.imageUrl ? (
                            <img
                              src={newAnnouncement.imageUrl}
                              alt="Pratinjau Foto Berita"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-slate-400 p-1">
                              <ImageIcon className="w-5 h-5 mx-auto mb-0.5 opacity-60" />
                              <span className="text-[10px] block leading-tight">Tanpa foto</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-center sm:text-left space-y-1">
                          <label className="font-semibold text-slate-800 block text-xs">
                            Unggah Foto / Gambar Utama Berita (Opsional)
                          </label>
                          <p className="text-[11px] text-slate-500">
                            Format JPG, PNG, atau WebP (maks 5MB). Foto akan langsung tampil di kartu warta dan surat resmi.
                          </p>
                          <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                            <label
                              htmlFor="ann-image-upload"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-300" />
                              <span>{newAnnouncement.imageUrl ? 'Ganti Foto' : 'Pilih Foto Berita'}</span>
                            </label>
                            <input
                              ref={announcementImageInputRef}
                              type="file"
                              id="ann-image-upload"
                              accept="image/*"
                              onChange={handleAnnouncementImageUpload}
                              className="hidden"
                            />
                            {newAnnouncement.imageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setNewAnnouncement((prev) => ({ ...prev, imageUrl: '' }));
                                  if (announcementImageInputRef.current) announcementImageInputRef.current.value = '';
                                }}
                                className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                              >
                                Hapus Foto
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Ringkasan Singkat (Lead Warta)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Kabar membanggakan datang dari tim robotik SMPN 14..."
                        value={newAnnouncement.summary}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, summary: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Isi Lengkap Surat Pengumuman / Berita *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tuliskan isi pengumuman atau berita secara mendetail..."
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Terbitkan Pengumuman / Berita</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Daftar Pengumuman Aktif ({announcements.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{ann.title}</div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{ann.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>Kategori: {ann.category}</span>
                            {ann.documentUrl && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>Ada Lampiran</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pengumuman "${ann.title}"?`)) {
                              deleteAnnouncement(ann.id);
                              showSuccess('Pengumuman telah dihapus.');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Hapus pengumuman"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GALERI KEGIATAN (DENGAN FITUR UPLOAD FOTO DOKUMENTASI) */}
            {activeTab === 'galeri' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Dokumentasi &amp; Unggah Foto Galeri</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggah foto dokumentasi kegiatan sekolah langsung dari HP atau komputer Anda.
                  </p>
                </div>

                <form onSubmit={handleAddActivity} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kegiatan Dokumentasi Sekolah</span>
                  </h4>

                  {/* Upload Foto Preview & Picker */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-32 h-24 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {newActivity.image ? (
                        <img
                          src={newActivity.image}
                          alt="Pratinjau Foto"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-400 p-2">
                          <Camera className="w-6 h-6 mx-auto mb-1 opacity-60" />
                          <span className="text-[10px] block leading-tight">Belum ada foto</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5 text-center sm:text-left text-xs">
                      <span className="font-bold text-slate-800 block">Pilih File Foto Dokumentasi *</span>
                      <p className="text-[11px] text-slate-500">
                        Format: JPG, PNG, atau WebP (maksimal 5MB). Foto akan tampil dalam resolusi tajam di galeri beranda.
                      </p>
                      <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label
                          htmlFor="activity-photo-input"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unggah Foto dari Perangkat</span>
                        </label>
                        <input
                          ref={activityImageInputRef}
                          type="file"
                          id="activity-photo-input"
                          accept="image/*"
                          onChange={handleActivityImageUpload}
                          className="hidden"
                        />
                        {newActivity.image && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewActivity((prev) => ({ ...prev, image: '' }));
                              if (activityImageInputRef.current) activityImageInputRef.current.value = '';
                            }}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Nama Acara / Kegiatan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Lomba Cerdas Cermat Hari Kemerdekaan"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori Kegiatan</label>
                      <select
                        value={newActivity.category}
                        onChange={(e) => {
                          const cat = e.target.value as ActivityPhoto['category'];
                          const labels: Record<string, string> = {
                            'kegiatan-pagi': 'Kegiatan Pagi',
                            osis: 'OSIS & Kepemimpinan',
                            upacara: 'Upacara & Nasionalisme',
                            pramuka: 'Kepramukaan & Karakter',
                            akademik: 'Sains & Lab',
                            seni: 'Seni Budaya Lampung',
                            olahraga: 'Olahraga'
                          };
                          setNewActivity({
                            ...newActivity,
                            category: cat,
                            categoryLabel: labels[cat] || 'Kegiatan'
                          });
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="kegiatan-pagi">Kegiatan Pagi</option>
                        <option value="osis">OSIS &amp; Kepemimpinan Siswa</option>
                        <option value="upacara">Upacara &amp; Nasionalisme</option>
                        <option value="pramuka">Kepramukaan</option>
                        <option value="akademik">Sains &amp; Lab</option>
                        <option value="seni">Seni Budaya Lampung</option>
                        <option value="olahraga">Olahraga</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Lokasi Kegiatan</label>
                      <input
                        type="text"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Keterangan / Narasi Foto</label>
                      <textarea
                        rows={2}
                        placeholder="Deskripsikan keseruan dan tujuan kegiatan..."
                        value={newActivity.caption}
                        onChange={(e) => setNewActivity({ ...newActivity, caption: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Tambahkan ke Galeri</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Foto Kegiatan Tampil di Galeri ({activities.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    {activities.map((act) => (
                      <div key={act.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <img
                            src={act.image}
                            alt={act.title}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{act.title}</div>
                            <div className="text-slate-500 text-[11px]">{act.date} · {act.categoryLabel}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kegiatan "${act.title}"?`)) {
                              deleteActivity(act.id);
                              showSuccess('Kegiatan telah dihapus dari galeri.');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Hapus foto kegiatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: KEGIATAN PAGI */}
            {activeTab === 'kegiatan-pagi' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Kelola Kegiatan Pagi &amp; Pembiasaan Siswa</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tambahkan atau perbarui agenda kegiatan pagi (5S, Upacara, Literasi, Senam, Imtaq) yang tampil di submenu Kegiatan Pagi.
                  </p>
                </div>

                <form onSubmit={handleAddMorningActivity} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Tambah Program Kegiatan Pagi</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="w-32 h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {newMorning.imageUrl ? (
                        <img src={newMorning.imageUrl} alt="Pratinjau Kegiatan Pagi" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-400 p-2">
                          <Sun className="w-6 h-6 mx-auto mb-1 opacity-60" />
                          <span className="text-[10px] block">Belum ada foto</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5 text-center sm:text-left text-xs">
                      <span className="font-bold text-slate-800 block">Foto Dokumentasi Kegiatan Pagi</span>
                      <p className="text-[11px] text-slate-500">
                        Unggah foto pembiasaan pagi siswa (JPG, PNG, WebP). Otomatis dikompresi agar cepat tampil.
                      </p>
                      <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                        <label
                          htmlFor="morning-photo-input"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unggah Foto Kegiatan Pagi</span>
                        </label>
                        <input
                          ref={morningImageInputRef}
                          type="file"
                          id="morning-photo-input"
                          accept="image/*"
                          onChange={handleMorningImageUpload}
                          className="hidden"
                        />
                        {newMorning.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewMorning((prev) => ({ ...prev, imageUrl: '' }));
                              if (morningImageInputRef.current) morningImageInputRef.current.value = '';
                            }}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hari Pelaksanaan</label>
                      <select
                        value={newMorning.day}
                        onChange={(e) => setNewMorning({ ...newMorning, day: e.target.value as MorningActivity['day'] })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      >
                        <option value="Setiap Pagi">Setiap Pagi</option>
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Waktu Pelaksanaan *</label>
                      <input
                        type="text"
                        required
                        placeholder="07.00 – 07.30 WIB"
                        value={newMorning.time}
                        onChange={(e) => setNewMorning({ ...newMorning, time: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Nama Kegiatan Pagi *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Apel Pagi & Pembiasaan Membaca Al-Qur'an"
                        value={newMorning.title}
                        onChange={(e) => setNewMorning({ ...newMorning, title: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Koordinator / Pembina</label>
                      <input
                        type="text"
                        value={newMorning.coordinator}
                        onChange={(e) => setNewMorning({ ...newMorning, coordinator: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Lokasi</label>
                      <input
                        type="text"
                        value={newMorning.location}
                        onChange={(e) => setNewMorning({ ...newMorning, location: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Deskripsi Kegiatan</label>
                      <textarea
                        rows={2}
                        placeholder="Jelaskan rangkaian pembiasaan pagi dan tujuan karakter bagi siswa..."
                        value={newMorning.description}
                        onChange={(e) => setNewMorning({ ...newMorning, description: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-900 text-white font-semibold text-xs rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Simpan ke Kegiatan Pagi</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Daftar Program Kegiatan Pagi ({morningActivities.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs shadow-xs">
                    {morningActivities.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                              <Sun className="w-4 h-4 text-amber-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                            <div className="text-slate-500 text-[11px] truncate">
                              {item.day} · {item.time} · {item.coordinator}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingMorning(item)}
                            className="p-1.5 text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit kegiatan pagi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus program "${item.title}"?`)) {
                                deleteMorningActivity(item.id);
                                showSuccess('Kegiatan pagi telah dihapus.');
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus kegiatan pagi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VERIFIKASI PPDB */}
            {activeTab === 'ppdb' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Verifikasi Calon Peserta Didik Baru (PPDB)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ubah status verifikasi berkas pendaftar baru secara langsung.
                    </p>
                  </div>
                  <span className="font-bold text-blue-900 text-xs px-2.5 py-1 rounded-lg bg-blue-50">
                    Total: {applicants.length} Calon Siswa
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="py-3 px-3 font-mono">No. Registrasi</th>
                        <th className="py-3 px-3">Nama Siswa</th>
                        <th className="py-3 px-3">Jalur</th>
                        <th className="py-3 px-3 font-mono">Kontak Ortu</th>
                        <th className="py-3 px-3">Status Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicants.map((app) => (
                        <tr key={app.registrationNumber} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-medium text-blue-900">
                            {app.registrationNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">NISN: {app.nisn}</div>
                          </td>
                          <td className="py-2.5 px-3">{app.track}</td>
                          <td className="py-2.5 px-3 font-mono">{app.parentPhone}</td>
                          <td className="py-2.5 px-3">
                            <select
                              value={app.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as typeof app.status;
                                updateApplicantStatus(
                                  app.registrationNumber,
                                  newStatus,
                                  `Status diubah oleh Admin menjadi ${newStatus} pada ${new Date().toLocaleTimeString('id-ID')}`
                                );
                                showSuccess(`Status ${app.fullName} diubah ke ${newStatus}`);
                              }}
                              className={`p-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                                app.status === 'Lolos Seleksi'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : app.status === 'Terverifikasi'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Menunggu Berkas">Menunggu Berkas</option>
                              <option value="Terverifikasi">Terverifikasi</option>
                              <option value="Lolos Seleksi">Lolos Seleksi</option>
                              <option value="Cadangan">Cadangan</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modal Edit Data Guru */}
        {editingTeacher && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-900" />
                  <span>Edit Data Guru / Tenaga Pendidik</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editingTeacher.name || !editingTeacher.subject) return;
                  await updateTeacher(editingTeacher.id, editingTeacher);
                  showSuccess(`Data guru ${editingTeacher.name} berhasil diperbarui!`);
                  setEditingTeacher(null);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NIP</label>
                    <input
                      type="text"
                      value={editingTeacher.nip}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, nip: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                    <input
                      type="text"
                      required
                      value={editingTeacher.subject}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jabatan / Peran</label>
                    <input
                      type="text"
                      value={editingTeacher.role}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, role: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                    <select
                      value={editingTeacher.category}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, category: e.target.value as Teacher['category'] })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="guru">Guru Mata Pelajaran</option>
                      <option value="pimpinan">Pimpinan Sekolah</option>
                      <option value="bk">Bimbingan Konseling (BK)</option>
                      <option value="tendik">Tata Usaha &amp; Perpustakaan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={editingTeacher.education}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, education: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Perubahan Guru</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Data Siswa */}
        {editingStudent && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-900" />
                  <span>Edit Data Peserta Didik</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editingStudent.fullName || !editingStudent.nisn) return;
                  await updateStudent(editingStudent.id, editingStudent);
                  showSuccess(`Data siswa ${editingStudent.fullName} berhasil diperbarui!`);
                  setEditingStudent(null);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fullName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NISN</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.nisn}
                      onChange={(e) => setEditingStudent({ ...editingStudent, nisn: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NIS</label>
                    <input
                      type="text"
                      value={editingStudent.nis}
                      onChange={(e) => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin</label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tingkat</label>
                    <select
                      value={editingStudent.grade}
                      onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value as 'VII' | 'VIII' | 'IX' })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="VII">VII</option>
                      <option value="VIII">VIII</option>
                      <option value="IX">IX</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Rombel</label>
                    <input
                      type="text"
                      value={editingStudent.rombel}
                      onChange={(e) => setEditingStudent({ ...editingStudent, rombel: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Orang Tua</label>
                    <input
                      type="text"
                      value={editingStudent.parentName}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">No HP Ortu</label>
                    <input
                      type="text"
                      value={editingStudent.parentPhone}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alamat</label>
                  <input
                    type="text"
                    value={editingStudent.address}
                    onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Perubahan Siswa</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Kegiatan Pagi */}
        {editingMorning && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Edit Program Kegiatan Pagi</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingMorning(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateMorningActivity(editingMorning.id, editingMorning);
                  setEditingMorning(null);
                  showSuccess('Perubahan kegiatan pagi berhasil disimpan!');
                }}
                className="space-y-3 text-xs"
              >
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-20 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {editingMorning.imageUrl ? (
                      <img src={editingMorning.imageUrl} alt={editingMorning.title} className="w-full h-full object-cover" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="font-semibold text-slate-800 block">Foto Kegiatan Pagi</span>
                    <label
                      htmlFor="edit-morning-photo-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ganti Foto</span>
                    </label>
                    <input
                      type="file"
                      id="edit-morning-photo-input"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !file.type.startsWith('image/')) return;
                        try {
                          const base64 = await compressImage(file, 960, 720, 0.8, 200000);
                          setEditingMorning((prev) => (prev ? { ...prev, imageUrl: base64 } : null));
                        } catch {
                          alert('Gagal memproses foto.');
                        } finally {
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Hari</label>
                    <select
                      value={editingMorning.day}
                      onChange={(e) => setEditingMorning({ ...editingMorning, day: e.target.value as MorningActivity['day'] })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Setiap Pagi">Setiap Pagi</option>
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Waktu</label>
                    <input
                      type="text"
                      required
                      value={editingMorning.time}
                      onChange={(e) => setEditingMorning({ ...editingMorning, time: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kegiatan</label>
                  <input
                    type="text"
                    required
                    value={editingMorning.title}
                    onChange={(e) => setEditingMorning({ ...editingMorning, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Koordinator / Pembina</label>
                    <input
                      type="text"
                      value={editingMorning.coordinator}
                      onChange={(e) => setEditingMorning({ ...editingMorning, coordinator: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lokasi</label>
                    <input
                      type="text"
                      value={editingMorning.location}
                      onChange={(e) => setEditingMorning({ ...editingMorning, location: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={editingMorning.description}
                    onChange={(e) => setEditingMorning({ ...editingMorning, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingMorning(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Ekstrakurikuler */}
        {editingEkskul && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Edit Program Ekstrakurikuler</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingEkskul(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editingEkskul.name.trim()) return;
                  await updateExtracurricular(editingEkskul.id, editingEkskul);
                  setEditingEkskul(null);
                  showSuccess(`Ekstrakurikuler "${editingEkskul.name}" berhasil diperbarui!`);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Ekstrakurikuler</label>
                  <input
                    type="text"
                    required
                    value={editingEkskul.name}
                    onChange={(e) => setEditingEkskul({ ...editingEkskul, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori Bidang</label>
                    <select
                      value={editingEkskul.category}
                      onChange={(e) => setEditingEkskul({ ...editingEkskul, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Wajib & Kepemimpinan">Wajib &amp; Kepemimpinan</option>
                      <option value="Seni Budaya">Seni Budaya</option>
                      <option value="Kemanusiaan">Kemanusiaan</option>
                      <option value="Olahraga Prestasi">Olahraga Prestasi</option>
                      <option value="Akademik Unggulan">Akademik Unggulan</option>
                      <option value="Keagamaan">Keagamaan</option>
                      <option value="Teknologi & Literasi">Teknologi &amp; Literasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jadwal Latihan</label>
                    <input
                      type="text"
                      required
                      value={editingEkskul.schedule}
                      onChange={(e) => setEditingEkskul({ ...editingEkskul, schedule: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Pembina / Pelatih</label>
                  <input
                    type="text"
                    required
                    value={editingEkskul.coach}
                    onChange={(e) => setEditingEkskul({ ...editingEkskul, coach: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deskripsi Kegiatan</label>
                  <textarea
                    rows={3}
                    value={editingEkskul.desc}
                    onChange={(e) => setEditingEkskul({ ...editingEkskul, desc: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingEkskul(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {successToast && (
          <div className="absolute bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-4 z-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
