import React from 'react';
import { Award, BookOpen, Heart, Target, CheckCircle2, Quote } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

export const SchoolProfile: React.FC = () => {
  const { schoolInfo } = useSchoolData();
  const missions = [
    'Menyelenggarakan proses pembelajaran berbasis Kurikulum Merdeka yang kontekstual, adaptif terhadap perkembangan teknologi digital.',
    'Menumbuhkembangkan keimanan, ketakwaan, serta pembiasaan ibadah rutin dan penguatan budi pekerti luhur bagi seluruh warga sekolah.',
    'Mengembangkan bakat, minat, dan potensi peserta didik di bidang sains, riset terapan, olahraga, serta seni budaya tradisional Lampung.',
    'Menanamkan nilai-nilai karakter luhur Nenemo (Nemen, Nedes, Nerimo) dan kebersamaan Ragem Sai Mangi Wawai dalam interaksi sehari-hari.',
    'Mewujudkan lingkungan sekolah yang bersih, rindang, asri, sehat (Adiwiyata), serta ramah anak dan bebas perundungan.'
  ];

  const nenemoValues = [
    {
      term: 'Nemen',
      meaning: 'Bekerja Keras & Sungguh-sungguh',
      desc: 'Setiap siswa dan guru didorong untuk gigih, tekun, dan mengerahkan kemampuan terbaik dalam menuntut ilmu dan berkarya.'
    },
    {
      term: 'Nedes',
      meaning: 'Tahan Banting & Pantang Menyerah',
      desc: 'Membentuk daya lentur mental (resilience), kedisiplinan tinggi, serta kemampuan memecahkan masalah dalam menghadapi tantangan.'
    },
    {
      term: 'Nerimo',
      meaning: 'Ikhlas, Bersyukur & Berintegritas',
      desc: 'Menjunjung kejujuran, kerendahan hati, rasa syukur, serta tanggung jawab sosial terhadap masyarakat dan alam sekitar.'
    }
  ];

  return (
    <section id="profil" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
            <span>Profil Lembaga</span>
            <span aria-hidden="true">·</span>
            <span>Identitas &amp; Visi Pendidikan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Membangun Karakter Unggul Berakar pada Kearifan Tulang Bawang Barat
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            <strong>{schoolInfo.name}</strong> didirikan sebagai wujud komitmen pemerintah daerah dan masyarakat 
            dalam menghadirkan layanan pendidikan bermutu yang merata bagi seluruh putra-putri daerah.
          </p>
        </div>

        {/* Sambutan Kepala Sekolah - Editorial Layout */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 mb-16 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Foto / Badge Kepala Sekolah */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 p-1 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-800/20 mix-blend-overlay"></div>
                  <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-amber-300 text-3xl font-bold font-mono">
                    {schoolInfo.headmaster
                      ? schoolInfo.headmaster
                          .split(' ')
                          .filter((w) => !w.includes('.') && !w.includes(','))
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('') || 'KS'
                      : 'KS'}
                  </div>
                  <span className="text-xs font-medium text-slate-300 mt-3">Kepala Sekolah</span>
                  <span className="text-xs text-amber-400 font-semibold">{schoolInfo.shortName || schoolInfo.name}</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{schoolInfo.headmaster}</h3>
              <p className="text-xs text-slate-500 font-mono">Kepala {schoolInfo.shortName || schoolInfo.name}</p>
              <span className="mt-2 text-xs text-blue-900 font-medium">
                Pendidikan Berkualitas &amp; Berkarakter
              </span>
            </div>

            {/* Editorial Quote & Statement */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <Quote className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sambutan Kepala Sekolah
                </span>
              </div>
              
              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
                &ldquo;Pendidikan sejati bukan sekadar mentransfer pengetahuan akademik dari buku ke lembar ujian, melainkan 
                menyalakan lentera budi pekerti, menumbuhkan rasa ingin tahu ilmiah, dan membentuk pribadi yang tangguh menghadapi peradaban abad 21. 
                Di {schoolInfo.name}, kami merajut keunggulan sains terapan dengan nilai luhur {schoolInfo.mottoValues || 'Nenemo (Nemen, Nedes, Nerimo)'}: 
                bekerja keras (nemen), ulet dan tahan uji (nedes), serta senantiasa ikhlas dan berakhlak mulia (nerimo). 
                Mari bersama kita hantarkan anak-anak kita menjadi tunas bangsa yang berkarakter, berbudaya, dan berprestasi.&rdquo;
              </blockquote>

              <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <span>{schoolInfo.headmaster} — Kepala {schoolInfo.name}</span>
                <span className="font-mono">Tahun Pelajaran 2026/2027</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visi, Misi & Falsafah Nenemo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Visi & Misi (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Visi */}
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Visi Sekolah</h3>
                  <p className="text-xs text-slate-500">Landasan Arah &amp; Cita-cita Pendidikan</p>
                </div>
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed bg-blue-50/60 p-5 rounded-xl border border-blue-100/80">
                &ldquo;Terwujudnya Peserta Didik yang Beriman dan Bertakwa, Unggul dalam Prestasi Akademik dan Non-Akademik, 
                Berwawasan Lingkungan, serta Berakar pada Budaya Luhur Nenemo.&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Misi Sekolah</h3>
                  <p className="text-xs text-slate-500">Langkah Nyata Mewujudkan Visi</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {missions.map((misi, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{misi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Falsafah Budaya Nenemo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Falsafah Budaya &ldquo;NENEMO&rdquo;</h3>
                  <p className="text-xs text-slate-300">Pilar Karakter Luhur Tulang Bawang Barat</p>
                </div>
              </div>

              <div className="space-y-6">
                {nenemoValues.map((val, idx) => (
                  <div key={val.term} className="border-b border-slate-800 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="text-lg font-bold text-amber-400 font-mono">
                        0{idx + 1}. {val.term}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        {val.meaning}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Motto: &ldquo;Ragem Sai Mangi Wawai&rdquo;</span>
                <span className="text-amber-400 font-semibold">Tubaba Maju</span>
              </div>
            </div>

            {/* Legalitas & Akreditasi Box */}
            <div className="mt-6 border border-slate-200 rounded-2xl p-6 bg-slate-50 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-blue-900 shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-bold text-slate-900 text-sm">Status Legalitas Sekolah Resmi</div>
                <div>SK Operasional: {schoolInfo.decreeNumber}</div>
                <div>Kementerian Pendidikan Dasar dan Menengah RI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
