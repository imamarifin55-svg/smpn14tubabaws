import React, { useState, useMemo } from 'react';
import { Bell, Calendar, FileText, Download, Search, X, CheckCircle, ExternalLink } from 'lucide-react';
import { Announcement } from '../data/schoolData';
import { useSchoolData } from '../context/SchoolDataContext';

export const AnnouncementsSection: React.FC = () => {
  const { announcements, schoolInfo } = useSchoolData();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'Semua Pengumuman' },
    { id: 'PPDB', label: 'PPDB 2026' },
    { id: 'Akademik', label: 'Jadwal & Akademik' },
    { id: 'Kesiswaan', label: 'Kegiatan Siswa' },
    { id: 'Edaran', label: 'Surat Edaran' }
  ];

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchTab = activeTab === 'all' || item.category === activeTab;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [announcements, activeTab, searchQuery]);

  const handleDownload = (docName: string, docUrl?: string) => {
    if (docUrl) {
      const link = document.createElement('a');
      link.href = docUrl;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate simulated official PDF download
      const blob = new Blob(
        [
          `SURAT RESMI SMP NEGERI 14 TULANG BAWANG BARAT\nNPSN: ${schoolInfo.npsn}\n\nDokumen: ${docName}\n\nIsi Lampiran: Dokumen Resmi Terverifikasi untuk civitas akademika dan orang tua murid.\n\nTanggal Unduh: ${new Date().toLocaleDateString('id-ID')}`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = docName.endsWith('.pdf') ? docName.replace('.pdf', '.txt') : docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setDownloadSuccess(docName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section id="pengumuman" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Warta Sekolah</span>
              <span aria-hidden="true">·</span>
              <span>Papan Informasi Resmi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pengumuman Akademik &amp; Edaran Dinas
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Informasi terkini mengenai agenda pembelajaran, jadwal ujian sumatif, petunjuk teknis PPDB, 
              serta surat edaran resmi bagi orang tua dan siswa.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[260px] shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci pengumuman..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 shadow-xs"
            />
          </div>
        </div>

        {/* Tab Filters (Button Segmented) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl max-w-max mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-blue-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-3xl">
                  {/* Unboxed Metadata Discipline */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-900">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    {item.important && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-amber-700">Wajib Diperhatikan</span>
                      </>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedAnnouncement(item)}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {item.documentName && (
                    <button
                      onClick={() => handleDownload(item.documentName!, item.documentUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Unduh Lampiran Resmi"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Unduh Lampiran</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAnnouncement(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Baca Surat</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-slate-700">Tidak ada pengumuman yang sesuai</h4>
              <p className="text-xs text-slate-500 mt-1">Gunakan kata kunci lain atau pilih tab Semua Pengumuman.</p>
            </div>
          )}
        </div>

        {/* Download notification feedback toast */}
        {downloadSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-slate-100">Lampiran berhasil diunduh:</div>
              <div className="text-slate-300 font-mono text-[11px]">{downloadSuccess}</div>
            </div>
          </div>
        )}

        {/* Official Announcement Modal with School Letterhead */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup surat pengumuman"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Kop Surat Resmi */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Pemerintah Kabupaten Tulang Bawang Barat
                </div>
                <div className="text-xs font-semibold text-slate-600 uppercase">
                  Dinas Pendidikan dan Kebudayaan
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  SMP NEGERI 14 TULANG BAWANG BARAT
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  NPSN: {schoolInfo.npsn} · {schoolInfo.address} · Telp: {schoolInfo.phone}
                </div>
              </div>

              {/* Unboxed Metadata inside Modal */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">{selectedAnnouncement.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tanggal: {selectedAnnouncement.date}</span>
                </div>
                <div className="font-mono text-[11px]">
                  Ref: TUBABA/SMPN14/2026-X
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4">
                {selectedAnnouncement.title}
              </h3>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                <p>{selectedAnnouncement.content}</p>
                <p>
                  Demikian pengumuman ini disampaikan untuk diketahui dan dilaksanakan sebagaimana mestinya. 
                  Atas perhatian dan kerja sama yang baik dari bapak/ibu orang tua dan seluruh peserta didik, 
                  kami ucapkan terima kasih.
                </p>
              </div>

              {/* Signature block */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end">
                <div className="text-xs text-slate-500">
                  {selectedAnnouncement.documentName && (
                    <button
                      onClick={() =>
                        handleDownload(
                          selectedAnnouncement.documentName!,
                          selectedAnnouncement.documentUrl
                        )
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-900" />
                      <span>Unduh {selectedAnnouncement.documentName}</span>
                    </button>
                  )}
                </div>

                <div className="text-right text-xs">
                  <p className="text-slate-500">Tulang Bawang Barat, {selectedAnnouncement.date}</p>
                  <p className="font-bold text-slate-900 mt-1">Kepala Sekolah,</p>
                  <div className="h-12 flex items-center justify-end font-serif italic text-blue-900 font-bold text-sm">
                    {schoolInfo.headmaster}
                  </div>
                  <p className="font-mono text-slate-500">NIP. 19680315 199303 1 004</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
