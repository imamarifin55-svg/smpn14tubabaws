import React, { useState, useEffect } from 'react';
import { Images, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

export const PurePhotoGallery: React.FC = () => {
  const { purePhotos } = useSchoolData();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto = activeIndex !== null ? purePhotos[activeIndex] : null;

  const handlePrev = () => {
    if (activeIndex === null || purePhotos.length === 0) return;
    setActiveIndex(activeIndex > 0 ? activeIndex - 1 : purePhotos.length - 1);
  };

  const handleNext = () => {
    if (activeIndex === null || purePhotos.length === 0) return;
    setActiveIndex(activeIndex < purePhotos.length - 1 ? activeIndex + 1 : 0);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : prev > 0 ? prev - 1 : purePhotos.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : prev < purePhotos.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, purePhotos.length]);

  return (
    <section id="album-foto" className="py-16 lg:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
            <Images className="w-4 h-4 text-amber-600" />
            <span>Album Visual</span>
            <span aria-hidden="true">·</span>
            <span>Koleksi Foto Murni</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Album Kegiatan
          </h2>
        </div>

        {/* Pure Photo Grid - Zero Captions or Text Overlays */}
        {purePhotos.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-sm text-slate-500">
            Belum ada foto yang diunggah ke album ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {purePhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                aria-label={`Lihat foto ${index + 1}`}
              >
                <img
                  src={photo.imageUrl}
                  alt={`Foto dokumentasi ${index + 1}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        )}

        {/* Clean Photo-Only Lightbox Modal */}
        {activePhoto && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveIndex(null);
            }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          >
            {/* Top-Right Minimal Controls */}
            <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
              <a
                href={activePhoto.imageUrl}
                download={`SMPN14_${activePhoto.id}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/70 transition-colors"
                aria-label="Unduh foto"
                title="Unduh / Buka Foto"
              >
                <Download className="w-5 h-5 text-amber-400" />
              </a>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/70 transition-colors cursor-pointer"
                aria-label="Tutup foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prev / Next Navigation */}
            {purePhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/10 transition-colors cursor-pointer"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pure Full Image Container */}
            <img
              src={activePhoto.imageUrl}
              alt="Tampilan foto penuh"
              referrerPolicy="no-referrer"
              className="max-h-[88vh] max-w-[92vw] w-auto object-contain rounded-xl shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200"
            />
          </div>
        )}
      </div>
    </section>
  );
};
