import React, { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

export const Footer: React.FC = () => {
  const { schoolInfo, setIsAdminOpen } = useSchoolData();
  const [quickContactMsg, setQuickContactMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContactMsg.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setQuickContactMsg('');
    }, 3000);
  };

  return (
    <footer id="kontak" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Identity & Motto (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 overflow-hidden bg-transparent">
                {schoolInfo.logoUrl ? (
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <GraduationCap className="w-10 h-10 text-amber-400" />
                )}
              </div>
              <div>
                <span className="text-base font-bold text-white block">
                  {schoolInfo.name}
                </span>
                <span className="text-xs text-amber-400 font-medium block">
                  NPSN: {schoolInfo.npsn} · {schoolInfo.accreditation}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mendidik generasi cerdas, berkarakter, berbudaya lokal, dan bertakwa kepada Tuhan Yang Maha Esa. 
              Mengimplementasikan nilai <em>{schoolInfo.mottoValues || 'Nenemo (Nemen, Nedes, Nerimo)'}</em> dan falsafah <em>{schoolInfo.mottoLocal || 'Ragem Sai Mangi Wawai'}</em>.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong>Status:</strong> Sekolah Negeri di bawah Naungan</div>
              <div className="text-slate-300">Dinas Pendidikan Kab. Tulang Bawang Barat &amp; Kemdikbudristek RI</div>
            </div>
          </div>

          {/* Col 2: Kontak & Pelayanan (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Kontak &amp; Alamat
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-slate-400 leading-relaxed">
                {schoolInfo.address}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-mono">{schoolInfo.phone} / {schoolInfo.whatsapp}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300">{schoolInfo.email}</span>
            </div>
            <div className="flex items-start gap-2.5 pt-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-300 font-medium">Jam Pelayanan Kantor:</span>
                <span className="text-slate-400">{schoolInfo.workingHours || 'Senin - Jumat: 07.15 - 15.00 WIB'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Tautan Cepat & Portal Dinas (2 cols) */}
          <div className="lg:col-span-2 space-y-2 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Tautan Terkait
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#beranda" className="text-slate-400 hover:text-white transition-colors">
                  Beranda Sekolah
                </a>
              </li>
              <li>
                <a href="#profil" className="text-slate-400 hover:text-white transition-colors">
                  Visi &amp; Misi
                </a>
              </li>
              <li>
                <a href="#guru" className="text-slate-400 hover:text-white transition-colors">
                  Direktori Dewan Guru
                </a>
              </li>
              <li>
                <a href="#peserta-didik" className="text-slate-400 hover:text-white transition-colors">
                  Data Peserta Didik
                </a>
              </li>
              <li>
                <a href="#galeri" className="text-slate-400 hover:text-white transition-colors">
                  Galeri Kegiatan
                </a>
              </li>
              <li>
                <a href="#pengumuman" className="text-slate-400 hover:text-white transition-colors">
                  Pengumuman &amp; Berita
                </a>
              </li>
              <li>
                <a href="#ppdb" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Pendaftaran PPDB
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Layanan Tanya Jawab / Aspirasi Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Layanan Informasi &amp; Saran
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Memiliki pertanyaan mengenai sekolah atau pendaftaran PPDB? Kirimkan pesan langsung ke staf humas kami.
            </p>

            {submitted ? (
              <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Pesan telah diterima! Tim humas sekolah akan segera merespons.</span>
              </div>
            ) : (
              <form onSubmit={handleQuickContact} className="space-y-2">
                <input
                  type="text"
                  required
                  value={quickContactMsg}
                  onChange={(e) => setQuickContactMsg(e.target.value)}
                  placeholder="Ketik pertanyaan / nomor WA Anda..."
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kirim ke Humas</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 {schoolInfo.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Kelola Data Sekolah</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Portal Resmi</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Provinsi Lampung</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
