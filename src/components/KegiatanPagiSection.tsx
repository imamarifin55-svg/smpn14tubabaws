import React, { useState, useMemo } from 'react';
import {
  Sun,
  Clock,
  MapPin,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

export const KegiatanPagiSection: React.FC = () => {
  const { morningActivities, activities, setAdminInitialTab, setIsAdminOpen } = useSchoolData();
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dayFilters = [
    { id: 'all', label: 'Semua Hari' },
    { id: 'Setiap Pagi', label: 'Setiap Pagi' },
    { id: 'Senin', label: 'Senin' },
    { id: 'Selasa', label: 'Selasa' },
    { id: 'Rabu', label: 'Rabu' },
    { id: 'Kamis', label: 'Kamis' },
    { id: 'Jumat', label: 'Jumat' }
  ];

  // Combine dedicated morning activities with any gallery photos tagged 'kegiatan-pagi'
  const combinedItems = useMemo(() => {
    const pagiGalleryItems = activities
      .filter((act) => act.category === 'kegiatan-pagi')
      .map((act) => ({
        id: `gal-${act.id}`,
        day: 'Setiap Pagi' as const,
        time: act.date,
        title: act.title,
        coordinator: 'Dokumentasi Kegiatan Pagi',
        location: act.location,
        description: act.caption,
        imageUrl: act.image
      }));

    return [...morningActivities, ...pagiGalleryItems];
  }, [morningActivities, activities]);

  const filteredItems = useMemo(() => {
    if (selectedDay === 'all') return combinedItems;
    return combinedItems.filter((item) => item.day === selectedDay);
  }, [combinedItems, selectedDay]);

  const activeItem = activeIndex !== null ? filteredItems[activeIndex] : null;

  const handlePrev = () => {
    if (activeIndex === null || filteredItems.length === 0) return;
    setActiveIndex(activeIndex > 0 ? activeIndex - 1 : filteredItems.length - 1);
  };

  const handleNext = () => {
    if (activeIndex === null || filteredItems.length === 0) return;
    setActiveIndex(activeIndex < filteredItems.length - 1 ? activeIndex + 1 : 0);
  };

  return (
    <section id="kegiatan-pagi" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Galeri Kegiatan</span>
              <span aria-hidden="true">·</span>
              <span>Program Pembiasaan 06.45 – 07.45 WIB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Kegiatan Pagi Siswa &amp; Budaya Sekolah
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Rangkaian pembiasaan pagi SMPN 14 Tulang Bawang Barat sebelum pembelajaran dimulai untuk
              membangun disiplin, literasi, kebugaran, serta karakter religius dan berbudaya Nenemo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAdminInitialTab('kegiatan-pagi');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Kegiatan Pagi</span>
            </button>
          </div>
        </div>

        {/* Interactive Day Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit max-w-full">
          {dayFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setSelectedDay(filter.id);
                setActiveIndex(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedDay === filter.id
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Morning Activities Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
            Belum ada agenda kegiatan pagi pada hari yang dipilih.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item, idx) => (
              <article
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center text-white">
                      <Sun className="w-10 h-10 text-amber-300 mb-2" />
                      <span className="text-xs font-semibold text-slate-200 line-clamp-2">{item.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/15 to-transparent flex items-end p-4">
                    <div className="text-white text-xs font-medium flex items-center gap-2 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Discipline */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-blue-900">{item.day}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.coordinator}</span>
                    </span>
                    <span className="font-semibold text-blue-900 shrink-0">Detail &rarr;</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Detail / Photo Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 tabular-nums">
                  <span className="font-semibold text-amber-400">{activeItem.day}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeItem.time}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeItem.location}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  aria-label="Tutup detail kegiatan pagi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative bg-black flex items-center justify-center min-h-[280px] max-h-[60vh] overflow-hidden">
                {activeItem.imageUrl ? (
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
                  />
                ) : (
                  <div className="p-12 text-center text-slate-300">
                    <Sun className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold">{activeItem.title}</p>
                  </div>
                )}

                {filteredItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      aria-label="Kegiatan sebelumnya"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      aria-label="Kegiatan berikutnya"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
                <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{activeItem.description}</p>
                <div className="pt-2 text-xs text-slate-400">
                  Penanggung Jawab / Pembina: <span className="text-amber-300 font-medium">{activeItem.coordinator}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
