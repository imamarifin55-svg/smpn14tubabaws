import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Users,
  Search,
  UserCheck,
  Building,
  GraduationCap,
  Filter,
  Download,
  Upload,
  Settings,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { Student } from '../data/schoolData';

export const StudentDirectory: React.FC = () => {
  const { students, setIsAdminOpen, setAdminInitialTab } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'VII' | 'VIII' | 'IX'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Laki-laki' | 'Perempuan'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Statistics calculation
  const totalStudents = students.length;
  const gradeVII = students.filter((s) => s.grade === 'VII').length;
  const gradeVIII = students.filter((s) => s.grade === 'VIII').length;
  const gradeIX = students.filter((s) => s.grade === 'IX').length;

  const countMale = students.filter((s) => s.gender === 'Laki-laki').length;
  const countFemale = students.filter((s) => s.gender === 'Perempuan').length;

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nisn.includes(searchQuery) ||
        student.nis.includes(searchQuery) ||
        student.rombel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade = selectedGrade === 'all' || student.grade === selectedGrade;
      const matchGender = selectedGender === 'all' || student.gender === selectedGender;

      return matchSearch && matchGrade && matchGender;
    });
  }, [students, searchQuery, selectedGrade, selectedGender]);

  // Export current list to Excel (.xlsx)
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NISN',
      'NIS',
      'Nama Lengkap',
      'Jenis Kelamin',
      'Tingkat',
      'Rombel',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Alamat',
      'Nama Orang Tua',
      'No HP Ortu',
      'Status'
    ];

    const worksheetData = [
      headers,
      ...filteredStudents.map((s, idx) => [
        idx + 1,
        s.nisn,
        s.nis,
        s.fullName,
        s.gender,
        s.grade,
        s.rombel,
        s.birthPlace,
        s.birthDate,
        s.address,
        s.parentName,
        s.parentPhone,
        s.status
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Peserta Didik');
    XLSX.writeFile(wb, `Data_Peserta_Didik_SMPN14_Tubaba_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleOpenAdminImport = () => {
    setAdminInitialTab('peserta-didik');
    setIsAdminOpen(true);
  };

  return (
    <section id="peserta-didik" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Kesiswaan &amp; Dapodik</span>
              <span aria-hidden="true">·</span>
              <span>Direktori Peserta Didik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Data Peserta Didik SMPN 14
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Daftar resmi peserta didik aktif SMP Negeri 14 Tulang Bawang Barat yang terdaftar 
              dalam pangkalan data Dapodikdasmen Kemdikbudristek RI.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Unduh data dalam format Excel (.xlsx)"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleOpenAdminImport}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Buka panel admin untuk mengimpor file Excel"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>Impor Data Siswa</span>
            </button>
          </div>
        </div>

        {/* 4-Column Metric Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-1">
              <span>Total Siswa</span>
              <Users className="w-4 h-4 text-blue-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalStudents}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {countMale} Laki-laki · {countFemale} Perempuan
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-1">
              <span>Kelas VII</span>
              <span className="text-xs font-bold text-blue-900 font-mono">Fase D</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {gradeVII}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Siswa Kelas VII (Tahun Masuk 2026)
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-1">
              <span>Kelas VIII</span>
              <span className="text-xs font-bold text-blue-900 font-mono">Fase D</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {gradeVIII}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Siswa Kelas VIII
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-1">
              <span>Kelas IX</span>
              <span className="text-xs font-bold text-amber-600 font-mono">Tingkat Akhir</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {gradeIX}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Persiapan Kelulusan &amp; Asesmen
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80">
              {(['all', 'VII', 'VIII', 'IX'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-blue-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {grade === 'all' ? 'Semua Kelas' : `Kelas ${grade}`}
                </button>
              ))}
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80">
              {(['all', 'Laki-laki', 'Perempuan'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedGender === gender
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {gender === 'all' ? 'Semua Gender' : gender}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, NISN, atau rombel..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all shadow-xs"
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

        {/* Student Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-mono w-12 text-center">No</th>
                  <th className="py-3.5 px-4 font-mono">NISN / NIS</th>
                  <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                  <th className="py-3.5 px-4">L/P</th>
                  <th className="py-3.5 px-4 font-mono">Rombel</th>
                  <th className="py-3.5 px-4">Alamat Domisili</th>
                  <th className="py-3.5 px-4">Nama Orang Tua</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-center text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        <span className="font-semibold text-blue-900">{student.nisn}</span>
                        <span className="block text-[11px] text-slate-400">NIS: {student.nis}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors block">
                          {student.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {student.birthPlace}, {student.birthDate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            student.gender === 'Laki-laki'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {student.gender === 'Laki-laki' ? 'L' : 'P'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {student.rombel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {student.address}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium text-slate-800">{student.parentName}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {student.parentPhone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">Tidak ada data peserta didik yang cocok.</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Coba ubah kata kunci pencarian atau reset filter tingkat/gender.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan {filteredStudents.length} dari total {students.length} peserta didik terdata.
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">Data tersinkronisasi Dapodik SMPN 14 Tubaba</span>
            </div>
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-900 block">
                    NISN: {selectedStudent.nisn} · NIS: {selectedStudent.nis}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedStudent.fullName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-900 font-mono">
                  Kelas {selectedStudent.rombel}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Jenis Kelamin:</span>
                    <span className="font-semibold text-slate-800">{selectedStudent.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tingkat Kelas:</span>
                    <span className="font-semibold text-slate-800">Kelas {selectedStudent.grade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tempat, Tgl Lahir:</span>
                    <span className="font-medium text-slate-800">
                      {selectedStudent.birthPlace}, {selectedStudent.birthDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status Siswa:</span>
                    <span className="font-semibold text-emerald-700">{selectedStudent.status}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Alamat Tempat Tinggal:</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedStudent.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block">Nama Orang Tua / Wali:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedStudent.parentName}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                    No. HP / WA: {selectedStudent.parentPhone}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
