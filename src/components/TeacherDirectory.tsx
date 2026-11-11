import React, { useState, useMemo } from 'react';
import { Search, Mail, BookOpen, GraduationCap, Clock, Award, X, CheckCircle2 } from 'lucide-react';
import { Teacher } from '../data/schoolData';
import { useSchoolData } from '../context/SchoolDataContext';

export const TeacherDirectory: React.FC = () => {
  const { teachers } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [consultModalSuccess, setConsultModalSuccess] = useState(false);
  const [consultMessage, setConsultMessage] = useState('');

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchSearch =
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.nip.includes(searchQuery);

      const matchCategory =
        selectedCategory === 'all' || teacher.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [teachers, searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', label: 'Semua Staf' },
    { id: 'pimpinan', label: 'Pimpinan Sekolah' },
    { id: 'guru', label: 'Guru Mata Pelajaran' },
    { id: 'bk', label: 'Bimbingan Konseling' },
    { id: 'tendik', label: 'Tata Usaha & Pustaka' }
  ];

  const handleSendConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultMessage.trim()) return;
    setConsultModalSuccess(true);
    setTimeout(() => {
      setConsultModalSuccess(false);
      setConsultMessage('');
      setSelectedTeacher(null);
    }, 2500);
  };

  return (
    <section id="guru" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <span>Civitas Akademika</span>
              <span aria-hidden="true">·</span>
              <span>Pendidik &amp; Tenaga Kependidikan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dewan Guru &amp; Tenaga Kependidikan
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Didukung oleh tenaga pendidik bersertifikasi, berkompeten, dan berdedikasi tinggi membimbing 
              potensi siswa dalam lingkungan belajar yang aman dan inspiratif.
            </p>
          </div>

          {/* Quick Stat Pill-less metadata */}
          <div className="text-xs text-slate-500 font-mono flex items-center gap-2 shrink-0">
            <span>Total {teachers.length} Staf Pendidik</span>
            <span aria-hidden="true">·</span>
            <span>100% S1/S2 Linier</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Interactive Category Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-blue-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru atau mata pelajaran..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Avatar & Department Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${teacher.colorScheme} text-white flex items-center justify-center font-bold text-lg font-mono shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      {teacher.initials}
                    </div>
                    <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                      {teacher.category === 'pimpinan'
                        ? 'Pimpinan'
                        : teacher.category === 'guru'
                        ? 'Guru Mapel'
                        : teacher.category === 'bk'
                        ? 'Konselor'
                        : 'Tenaga Kependidikan'}
                    </span>
                  </div>

                  {/* Teacher Info */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    NIP. {teacher.nip}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span className="font-medium line-clamp-1">{teacher.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{teacher.education}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {teacher.role}
                  </span>
                  <button
                    onClick={() => setSelectedTeacher(teacher)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Detail Profil &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-700">Tidak ada data guru yang cocok</h4>
            <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian yang lain atau reset filter kategori.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Teacher Profile Detail Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTeacher.colorScheme} text-white flex items-center justify-center font-bold text-2xl font-mono shadow-md shrink-0`}
                >
                  {selectedTeacher.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    NIP. {selectedTeacher.nip}
                  </p>
                  <p className="text-xs font-semibold text-blue-900 mt-1">
                    {selectedTeacher.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-900" />
                    <span><strong>Mata Pelajaran:</strong> {selectedTeacher.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span><strong>Kualifikasi:</strong> {selectedTeacher.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span><strong>Jadwal Konsultasi:</strong> Setiap Hari Kerja (08.00 - 14.30 WIB)</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                    Catatan Pendidik &amp; Dedikasi
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {selectedTeacher.bio}
                  </p>
                </div>

                {/* Consultation Message Simulation */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-xs mb-2">
                    Hubungi / Jadwalkan Konsultasi Wali Murid
                  </h4>
                  {consultModalSuccess ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Permohonan konsultasi telah diteruskan ke Tata Usaha dan nomor WhatsApp beliau.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendConsultation} className="space-y-2">
                      <textarea
                        rows={2}
                        value={consultMessage}
                        onChange={(e) => setConsultMessage(e.target.value)}
                        placeholder={`Tulis pesan atau pertanyaan untuk ${selectedTeacher.name}...`}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTeacher(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
                        >
                          Kirim Pesan
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
