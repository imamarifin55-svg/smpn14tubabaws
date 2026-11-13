import React, { useState, useMemo } from 'react';
import { Camera, Calendar, MapPin, X, ChevronLeft, ChevronRight, Download, Share2, Check } from 'lucide-react';
import { ActivityPhoto } from '../data/schoolData';
import { useSchoolData } from '../context/SchoolDataContext';

export const ActivityGallery: React.FC = () => {
  const { activities } = useSchoolData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua Kegiatan' },
    { id: 'kegiatan-pagi', label: 'Kegiatan Pagi' },
    { id: 'osis', label: 'OSIS & Kepemimpinan' },
    { id: 'upacara', label: 'Upacara Bendera' },
    { id: 'pramuka', label: 'Kepramukaan' },
    { id: 'akademik', label: 'Sains & Lab' },
    { id: 'seni', label: 'Seni Budaya' },
    { id: 'olahraga', label: 'Olahraga' }
  ];

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return activities;
    return activities.filter((photo) => photo.category === activeCategory);
  }, [activities, activeCategory]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handlePrev = () => {
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    } else {
      setActivePhotoIndex(filteredPhotos.length - 1);
    }
  };

  const handleNext = () => {
    if (activePhotoIndex !== null && activePhotoIndex < filteredPhotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    } else {
      setActivePhotoIndex(0);
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="galeri" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Dokumentasi Sekolah</span>
              <span aria-hidden="true">·</span>
              <span>Kilas Aktivitas Siswa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Kegiatan &amp; Prestasi SMPN 14
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Momen nyata pembelajaran bermakna, kedisiplinan upacara, kepanduan pramuka, 
              serta riset sains kontekstual di lingkungan kampus SMPN 14 Tulang Bawang Barat.
            </p>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white text-blue-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                <img
                  src={photo.image}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-4">
                  <div className="text-white text-xs font-medium flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Unboxed Metadata Discipline */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-blue-900">{photo.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {photo.location}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {photo.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {photo.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-blue-900 group-hover:text-blue-700">
                  <span>Lihat Foto Penuh</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
            <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">{activePhoto.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePhoto.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePhoto.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                    title="Bagikan tautan dokumentasi"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Bagikan</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActivePhotoIndex(null)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Tutup preview"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Main Photo View with Nav Controls */}
              <div className="relative bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />

                {/* Left Button */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Button */}
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption & Description Footer */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-3xl">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    {activePhoto.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <a
                    href={activePhoto.image}
                    download={`SMPN14_${activePhoto.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Buka Resolusi Penuh</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
