export interface Teacher {
  id: string;
  name: string;
  nip: string;
  role: string;
  subject: string;
  category: 'pimpinan' | 'guru' | 'bk' | 'tendik';
  education: string;
  photoUrl?: string;
  initials: string;
  bio: string;
  colorScheme: string;
}

export interface ActivityPhoto {
  id: string;
  title: string;
  category: 'upacara' | 'pramuka' | 'akademik' | 'seni' | 'olahraga' | 'osis' | 'kegiatan-pagi';
  categoryLabel: string;
  date: string;
  location: string;
  image: string;
  caption: string;
  highlight?: boolean;
}

export interface MorningActivity {
  id: string;
  day: 'Setiap Pagi' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  title: string;
  coordinator: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: string;
  schedule: string;
  coach: string;
  desc: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Akademik' | 'Kesiswaan' | 'PPDB' | 'Edaran' | 'Berita';
  date: string;
  dateIso: string;
  summary: string;
  content: string;
  imageUrl?: string; // Optional uploaded news/announcement photo
  documentName?: string;
  documentUrl?: string; // Optional uploaded PDF/image base64 or file URL
  important?: boolean;
}

export interface PPDBApplicant {
  registrationNumber: string;
  fullName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  previousSchool: string;
  track: 'Zonasi' | 'Prestasi' | 'Afirmasi' | 'Pindah Tugas';
  parentName: string;
  parentPhone: string;
  address: string;
  submissionDate: string;
  status: 'Terverifikasi' | 'Menunggu Berkas' | 'Lolos Seleksi' | 'Cadangan';
  notes: string;
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  grade: 'VII' | 'VIII' | 'IX';
  rombel: string; // e.g. "VII-A", "VII-B", "VIII-A", "IX-C"
  birthPlace: string;
  birthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
  status: 'Aktif' | 'Mutasi' | 'Lulus';
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0129384721',
    nis: '241401',
    fullName: 'Muhammad Rizky Pratama',
    gender: 'Laki-laki',
    grade: 'VII',
    rombel: 'VII-A',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2013-05-14',
    address: 'Panaragan Jaya RT 02/RW 01, Tubaba',
    parentName: 'Bambang Supriyanto',
    parentPhone: '081273948210',
    status: 'Aktif'
  },
  {
    id: 'std-2',
    nisn: '0128472910',
    nis: '241402',
    fullName: 'Anindya Salma Putri',
    gender: 'Perempuan',
    grade: 'VII',
    rombel: 'VII-A',
    birthPlace: 'Kotabumi',
    birthDate: '2013-08-22',
    address: 'Kompleks Asri Indah C3, Tumijajar, Tubaba',
    parentName: 'Hendra Gunawan',
    parentPhone: '085268192033',
    status: 'Aktif'
  },
  {
    id: 'std-3',
    nisn: '0125739102',
    nis: '241403',
    fullName: 'Galih Bagas Saputra',
    gender: 'Laki-laki',
    grade: 'VII',
    rombel: 'VII-B',
    birthPlace: 'Menggala',
    birthDate: '2013-02-18',
    address: 'Tiyuh Karta Raharja RT 02, TBU, Tubaba',
    parentName: 'Suryanto',
    parentPhone: '082379104820',
    status: 'Aktif'
  },
  {
    id: 'std-4',
    nisn: '0118392019',
    nis: '231401',
    fullName: 'Fathir Ahmad Kurniawan',
    gender: 'Laki-laki',
    grade: 'VIII',
    rombel: 'VIII-A',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2012-04-11',
    address: 'Tiyuh Daya Murni, Kec. Tumijajar',
    parentName: 'Kurniawan Santoso',
    parentPhone: '081369281729',
    status: 'Aktif'
  },
  {
    id: 'std-5',
    nisn: '0119283746',
    nis: '231402',
    fullName: 'Nayla Zahra Salsabila',
    gender: 'Perempuan',
    grade: 'VIII',
    rombel: 'VIII-A',
    birthPlace: 'Bandar Lampung',
    birthDate: '2012-10-03',
    address: 'Jl. Poros Panaragan No. 18, Tubaba',
    parentName: 'Drs. Syarifuddin',
    parentPhone: '085382910293',
    status: 'Aktif'
  },
  {
    id: 'std-6',
    nisn: '0117462910',
    nis: '231403',
    fullName: 'Rian Dwi Saputra',
    gender: 'Laki-laki',
    grade: 'VIII',
    rombel: 'VIII-B',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2012-07-29',
    address: 'Tiyuh Kagungan Ratu RT 04, Tubaba',
    parentName: 'Wagimin',
    parentPhone: '082291028471',
    status: 'Aktif'
  },
  {
    id: 'std-7',
    nisn: '0109283719',
    nis: '221401',
    fullName: 'Dimas Bagus Anggoro',
    gender: 'Laki-laki',
    grade: 'IX',
    rombel: 'IX-A',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2011-01-15',
    address: 'Panaragan Jaya Indah Blok B, Tubaba',
    parentName: 'Gunadi Anggoro',
    parentPhone: '081277382910',
    status: 'Aktif'
  },
  {
    id: 'std-8',
    nisn: '0108372619',
    nis: '221402',
    fullName: 'Tiara Citra Lestari',
    gender: 'Perempuan',
    grade: 'IX',
    rombel: 'IX-A',
    birthPlace: 'Metro',
    birthDate: '2011-09-08',
    address: 'Tiyuh Tirta Kencana RT 01, Tubaba',
    parentName: 'Rudi Hartono',
    parentPhone: '085278192019',
    status: 'Aktif'
  },
  {
    id: 'std-9',
    nisn: '0106291028',
    nis: '221403',
    fullName: 'Bayu Arya Pratama',
    gender: 'Laki-laki',
    grade: 'IX',
    rombel: 'IX-B',
    birthPlace: 'Tulang Bawang Tengah',
    birthDate: '2011-06-20',
    address: 'Tiyuh Marga Asri RT 03, Tubaba',
    parentName: 'Pratama Jaya',
    parentPhone: '081382910284',
    status: 'Aktif'
  },
  {
    id: 'std-10',
    nisn: '0105192837',
    nis: '221404',
    fullName: 'Aisyah Nur Rahmah',
    gender: 'Perempuan',
    grade: 'IX',
    rombel: 'IX-B',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2011-12-05',
    address: 'Kompleks Pemda Lama Tubaba No. 7',
    parentName: 'H. Mansyur',
    parentPhone: '082188291023',
    status: 'Aktif'
  }
];

export const SCHOOL_INFO = {
  name: 'SMP Negeri 14 Tulang Bawang Barat',
  shortName: 'SMPN 14 Tubaba',
  npsn: '69947814',
  accreditation: 'Akreditasi B',
  decreeNumber: '420/188/II.01/TUBABA/2016',
  headmaster: 'Drs. H. Sukamto, M.Pd.',
  headmasterNip: '19680315 199303 1 004',
  headmasterEducation: 'Magister Manajemen Pendidikan (UNILA)',
  headmasterPhotoUrl: '',
  headmasterQuote:
    'Pendidikan sejati bukan sekadar mentransfer pengetahuan akademik dari buku ke lembar ujian, melainkan menyalakan lentera budi pekerti, menumbuhkan rasa ingin tahu ilmiah, dan membentuk pribadi yang tangguh menghadapi peradaban abad 21. Di SMP Negeri 14 Tulang Bawang Barat, kami merajut keunggulan sains terapan dengan nilai luhur Nenemo: bekerja keras (nemen), ulet dan tahan uji (nedes), serta senantiasa ikhlas dan berakhlak mulia (nerimo). Mari bersama kita hantarkan anak-anak kita menjadi tunas bangsa yang berkarakter, berbudaya, dan berprestasi.',
  vision:
    'Terwujudnya Peserta Didik yang Beriman dan Bertakwa, Unggul dalam Prestasi Akademik dan Non-Akademik, Berwawasan Lingkungan, serta Berakar pada Budaya Luhur Nenemo.',
  missions: [
    'Menyelenggarakan proses pembelajaran berbasis Kurikulum Merdeka yang kontekstual, adaptif terhadap perkembangan teknologi digital.',
    'Menumbuhkembangkan keimanan, ketakwaan, serta pembiasaan ibadah rutin dan penguatan budi pekerti luhur bagi seluruh warga sekolah.',
    'Mengembangkan bakat, minat, dan potensi peserta didik di bidang sains, riset terapan, olahraga, serta seni budaya tradisional Lampung.',
    'Menanamkan nilai-nilai karakter luhur Nenemo (Nemen, Nedes, Nerimo) dan kebersamaan Ragem Sai Mangi Wawai dalam interaksi sehari-hari.',
    'Mewujudkan lingkungan sekolah yang bersih, rindang, asri, sehat (Adiwiyata), serta ramah anak dan bebas perundungan.'
  ],
  mottoLocal: 'Ragem Sai Mangi Wawai',
  mottoValues: 'Nenemo (Nemen, Nedes, Nerimo)',
  heroHeadline: 'Mendidik Generasi Berilmu, Berakhlak Mulia & Berbudaya',
  heroHighlight: 'Nenemo',
  heroDescription:
    'Selamat datang di portal resmi SMP Negeri 14 Tulang Bawang Barat. Kami berkomitmen menyelenggarakan pendidikan menengah pertama yang bermutu tinggi, memupuk kreativitas, sains, serta melestarikan kearifan lokal Ragem Sai Mangi Wawai di Provinsi Lampung.',
  topBarLabel: 'PENGUMUMAN PPDB:',
  topBarText: 'Pendaftaran Peserta Didik Baru TA 2026/2027 telah dibuka secara daring',
  address: 'Kawasan Pendidikan Terpadu, Kec. Tulang Bawang Barat, Kab. Tulang Bawang Barat, Provinsi Lampung 34693',
  phone: '(0726) 782-194',
  whatsapp: '+62 821-7890-1414',
  email: 'smpn14tubaba@gmail.com',
  workingHours: 'Senin - Jumat: 07.15 - 15.00 WIB',
  logoUrl: '', // Base64 or image URL uploaded by school admin
  campusImageUrl: '', // Uploaded photo of SMPN 14 Tulang Bawang Barat campus
  campusTitle: 'Gedung Terpadu SMPN 14 Tubaba',
  campusDescription: 'Dilengkapi ruang belajar sejuk, laboratorium sains terpadu, perpustakaan digital, serta lapangan serbaguna.',
  stats: [
    { label: 'Peserta Didik Aktif', value: '486', unit: 'Siswa' },
    { label: 'Tenaga Pendidik & Staf', value: '32', unit: 'Guru & Tendik' },
    { label: 'Rombongan Belajar', value: '15', unit: 'Kelas' },
    { label: 'Tingkat Kelulusan', value: '100%', unit: 'Kelulusan 2025/2026' }
  ]
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Drs. H. Sukamto, M.Pd.',
    nip: '19680315 199303 1 004',
    role: 'Kepala Sekolah',
    subject: 'Manajemen Pendidikan & Pembina Upacara',
    category: 'pimpinan',
    education: 'S2 Magister Pendidikan (FKIP Universitas Lampung)',
    initials: 'SK',
    bio: 'Berpengalaman lebih dari 28 tahun di dunia pendidikan dasar & menengah, mengedepankan kepemimpinan berbasis keteladanan dan digitalisasi sekolah.',
    colorScheme: 'from-blue-700 to-indigo-900'
  },
  {
    id: 't-2',
    name: 'Dra. Hj. Nuraini, M.Pd.',
    nip: '19710512 199802 2 002',
    role: 'Wakil Kepala Sekolah Bidang Kurikulum',
    subject: 'Bahasa Indonesia',
    category: 'pimpinan',
    education: 'S2 Pendidikan Bahasa Indonesia (UNILA)',
    initials: 'NR',
    bio: 'Penggerak implementasi Kurikulum Merdeka dan pembimbing tim karya tulis ilmiah siswa berprestasi tingkat provinsi.',
    colorScheme: 'from-emerald-700 to-teal-900'
  },
  {
    id: 't-3',
    name: 'Rahmat Hidayat, S.Pd., M.Si.',
    nip: '19820719 200801 1 011',
    role: 'Wakil Kepala Sekolah Bidang Kesiswaan',
    subject: 'Ilmu Pengetahuan Alam (IPA Terpadu)',
    category: 'guru',
    education: 'S2 Fisika Lingkungan (ITERA)',
    initials: 'RH',
    bio: 'Koordinator Olimpiade Sains Nasional (OSN) dan pembina komunitas riset saintis muda SMPN 14.',
    colorScheme: 'from-cyan-700 to-blue-900'
  },
  {
    id: 't-4',
    name: 'Siti Masithoh, S.Pd.',
    nip: '19851104 201001 2 018',
    role: 'Guru Kelas / Koordinator P5',
    subject: 'Matematika',
    category: 'guru',
    education: 'S1 Pendidikan Matematika (Universitas Negeri Yogyakarta)',
    initials: 'SM',
    bio: 'Menekankan pembelajaran matematika visual dan kontekstual yang menyenangkan bagi siswa SMP.',
    colorScheme: 'from-violet-700 to-purple-900'
  },
  {
    id: 't-5',
    name: 'I Made Sudarsana, S.Pd.',
    nip: '19870322 201101 1 009',
    role: 'Pembina OSIS & Guru Penggerak',
    subject: 'Bahasa Inggris',
    category: 'guru',
    education: 'S1 Pendidikan Bahasa Inggris (Universitas Lampung)',
    initials: 'MS',
    bio: 'Pengampu English Club dan aktif mengembangkan modul interaktif conversation bahasa Inggris.',
    colorScheme: 'from-amber-700 to-orange-900'
  },
  {
    id: 't-6',
    name: 'Nurul Hidayati, S.Pd.',
    nip: '19900814 201502 2 005',
    role: 'Guru Muatan Lokal',
    subject: 'Bahasa & Aksara Lampung',
    category: 'guru',
    education: 'S1 Pendidikan Bahasa Daerah Lampung (UNILA)',
    initials: 'NH',
    bio: 'Pelestari budaya Lampung Tulang Bawang, pembina tari kreasi daerah dan penulisan Had Lampung.',
    colorScheme: 'from-rose-700 to-pink-900'
  },
  {
    id: 't-7',
    name: 'Ahmad Fauzi, S.Pd.I.',
    nip: '19840210 200902 1 003',
    role: 'Pembina Rohani Islam (Rohis)',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    category: 'guru',
    education: 'S1 Pendidikan Agama Islam (UIN Raden Intan Lampung)',
    initials: 'AF',
    bio: 'Mengasuh program Tahfidz Al-Qur\'an Juz 30 dan pembinaan akhlak mulia setiap pagi hari sebelum KBM dimulai.',
    colorScheme: 'from-teal-700 to-emerald-900'
  },
  {
    id: 't-8',
    name: 'Bagus Prakoso, S.Pd.',
    nip: '19920118 201903 1 007',
    role: 'Pembina Ekstrakurikuler Olahraga',
    subject: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
    category: 'guru',
    education: 'S1 Pendidikan Kepelatihan Olahraga (Universitas Negeri Jakarta)',
    initials: 'BP',
    bio: 'Pelatih kepala tim futsal & atletik siswa yang telah meraih medali emas O2SN tingkat kabupaten.',
    colorScheme: 'from-blue-600 to-slate-900'
  },
  {
    id: 't-9',
    name: 'Dewi Lestari, S.Sos., M.Pd.',
    nip: '19890409 201402 2 006',
    role: 'Konselor Sekolah',
    subject: 'Bimbingan dan Konseling (BK)',
    category: 'bk',
    education: 'S2 Bimbingan & Konseling (Universitas Pendidikan Indonesia)',
    initials: 'DL',
    bio: 'Fasilitator pendampingan psikologis, pencegahan perundungan (anti-bullying), dan pemetaan bakat minat peserta didik.',
    colorScheme: 'from-fuchsia-700 to-pink-900'
  },
  {
    id: 't-10',
    name: 'Tri Wahyudi, S.Kom.',
    nip: '19931205 202012 1 002',
    role: 'Kepala Lab Komputer & Pengelola IT',
    subject: 'Informatika & Literasi Digital',
    category: 'guru',
    education: 'S1 Teknik Informatika (Institut Teknologi Sumatera)',
    initials: 'TW',
    bio: 'Penanggung jawab infrastruktur ANBK, server sekolah, e-rapor, dan pelatihan dasar pemrograman robotik.',
    colorScheme: 'from-sky-700 to-indigo-950'
  },
  {
    id: 't-11',
    name: 'Endang Purwaningsih, A.Md.',
    nip: '19790616 200701 2 015',
    role: 'Kepala Tata Usaha (TU)',
    subject: 'Administrasi Kepegawaian & Kesiswaan',
    category: 'tendik',
    education: 'D3 Administrasi Perkantoran (Politeknik Negeri Lampung)',
    initials: 'EP',
    bio: 'Mengkoordinir pelayanan administrasi surat menyurat, berkas Dapodik, dan layanan orang tua murid secara profesional.',
    colorScheme: 'from-slate-700 to-slate-900'
  },
  {
    id: 't-12',
    name: 'Wahyudin, S.I.Pust.',
    nip: '19940310 202203 1 004',
    role: 'Pengelola Perpustakaan',
    subject: 'Layanan Perpustakaan & Gerakan Literasi',
    category: 'tendik',
    education: 'S1 Ilmu Perpustakaan & Informasi (UIN Raden Intan)',
    initials: 'WY',
    bio: 'Mengembangkan Pojok Baca Ramah Anak dan katalog peminjaman buku digital bagi siswa SMPN 14.',
    colorScheme: 'from-amber-800 to-yellow-950'
  }
];

export const SCHOOL_ACTIVITIES: ActivityPhoto[] = [
  {
    id: 'act-1',
    title: 'Upacara Bendera Peringatan Hari Pendidikan & Pelantikan Pengurus OSIS',
    category: 'upacara',
    categoryLabel: 'Upacara & Nasionalisme',
    date: '14 Oktober 2026',
    location: 'Lapangan Utama Kampus SMPN 14',
    image: '/src/assets/images/activity_ceremony_1792594019651.jpg',
    caption: 'Seluruh civitas akademika berkumpul dalam kedisiplinan dan rasa nasionalisme yang mendalam untuk menyemai benih kepemimpinan siswa.',
    highlight: true
  },
  {
    id: 'act-2',
    title: 'Perkemahan Sabtu-Minggu (Persami) Gugus Depan Pramuka SMPN 14',
    category: 'pramuka',
    categoryLabel: 'Kepramukaan & Karakter',
    date: '28 September 2026',
    location: 'Bumi Perkemahan Tiyuh Berseri',
    image: '/src/assets/images/activity_scout_pramuka_1792594019748.jpg',
    caption: 'Latihan tali temali pionering bambu serta penguatan ketahanan mental, kerja sama tim, dan kepemimpinan pramuka penggalang.',
    highlight: true
  },
  {
    id: 'act-3',
    title: 'Praktikum Sains Mikrobiologi & Eksperimen Botani di Lab Terpadu',
    category: 'akademik',
    categoryLabel: 'Sains & Teknologi Lab',
    date: '02 Oktober 2026',
    location: 'Laboratorium IPA & Komputer SMPN 14',
    image: '/src/assets/images/activity_science_lab_1792594020856.jpg',
    caption: 'Pembelajaran kontekstual abad 21 di mana siswa meneliti struktur sel daun dan organisme mikroskopis secara kolaboratif didampingi guru pembina.',
    highlight: true
  },
  {
    id: 'act-4',
    title: 'Pekan Budaya Nenemo: Pementasan Tari Sigeh Penguten & Bedana',
    category: 'seni',
    categoryLabel: 'Seni Budaya Lampung',
    date: '19 September 2026',
    location: 'Aula Terbuka Ragem Sai Mangi Wawai',
    image: '/src/assets/images/hero_smpn14_building_1792594018035.jpg',
    caption: 'Peserta didik menampilkan ragam gerak tari tradisi Lampung dengan busana kebesaran adat Pepadun dan Sai Batin sebagai wujud cinta warisan leluhur.',
    highlight: false
  },
  {
    id: 'act-5',
    title: 'Turnamen Futsal dan Voli Kesiswaan Hari Olahraga Nasional',
    category: 'olahraga',
    categoryLabel: 'Olahraga & Prestasi',
    date: '09 September 2026',
    location: 'Gelanggang Olahraga SMPN 14',
    image: '/src/assets/images/activity_scout_pramuka_1792594019748.jpg',
    caption: 'Menumbuhkan sportivitas dan kebugaran jasmani antar kelas, melahirkan bibit atlet muda berbakat untuk mewakili sekolah di tingkat kabupaten.',
    highlight: false
  },
  {
    id: 'act-6',
    title: 'Gerakan Sekolah Sehat & Aksi Tanam Pohon Adiwiyata Bersama Masyarakat',
    category: 'akademik',
    categoryLabel: 'Lingkungan & Adiwiyata',
    date: '25 Agustus 2026',
    location: 'Taman Konservasi Sekolah',
    image: '/src/assets/images/hero_smpn14_building_1792594018035.jpg',
    caption: 'Edukasi pilah sampah organik dan penanaman 100 bibit tanaman pelindung untuk menjaga kesejukan dan kelestarian ekosistem belajar.',
    highlight: false
  },
  {
    id: 'act-7',
    title: 'Latihan Dasar Kepemimpinan Siswa (LDKS) Pengurus OSIS 2026/2027',
    category: 'osis',
    categoryLabel: 'OSIS & Kepemimpinan',
    date: '22 Oktober 2026',
    location: 'Aula Utama & Kampus SMPN 14 Tubaba',
    image: '/src/assets/images/activity_ceremony_1792594019651.jpg',
    caption: 'Pembekalan kepemimpinan, manajemen organisasi siswa intra sekolah, dan penanaman integritas karakter Nenemo.',
    highlight: true
  },
  {
    id: 'act-8',
    title: 'Pemilihan Umum Ketua dan Wakil Ketua OSIS (Pemilos) Demokratis',
    category: 'osis',
    categoryLabel: 'OSIS & Demokrasi Pelajar',
    date: '10 Oktober 2026',
    location: 'TPS Demokrasi Pelajar SMPN 14',
    image: '/src/assets/images/hero_smpn14_building_1792594018035.jpg',
    caption: 'Pesta demokrasi pelajar menggunakan bilik suara dan e-voting digital untuk melatih kesadaran berbangsa sejak dini.',
    highlight: false
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-news-1',
    title: 'Siswa SMPN 14 Tulang Bawang Barat Raih Juara 1 Lomba Sains & Robotik Tingkat Provinsi',
    category: 'Berita',
    date: '28 Oktober 2026',
    dateIso: '2026-10-28',
    summary: 'Kabar membanggakan datang dari tim robotik dan inovasi sains SMPN 14 Tubaba yang berhasil meraih medali emas pada ajang bergengsi tingkat Provinsi Lampung.',
    content: `Civitas akademika SMP Negeri 14 Tulang Bawang Barat mengucapkan selamat dan apresiasi setinggi-tingginya kepada siswa-siswi pembina klub sains yang berhasil mengharumkan nama sekolah di tingkat Provinsi Lampung. Prestasi ini membuktikan semangat Nenemo (Nemen, Nedes, Nerimo) dan filosofi Ragem Sai Mangi Wawai yang senantiasa ditanamkan dalam keseharian belajar.`,
    imageUrl: '/src/assets/images/activity_science_lab_1792594020856.jpg',
    documentName: 'Sertifikat_Juara_Sains_2026.pdf',
    important: true
  },
  {
    id: 'ann-1',
    title: 'Petunjuk Teknis Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027',
    category: 'PPDB',
    date: '18 Oktober 2026',
    dateIso: '2026-10-18',
    summary: 'Dinas Pendidikan Kabupaten Tulang Bawang Barat resmi membuka pendaftaran daring dengan 4 jalur: Zonasi, Prestasi, Afirmasi, dan Perpindahan Tugas.',
    content: `Berdasarkan Surat Edaran Dinas Pendidikan Kab. Tulang Bawang Barat, SMP Negeri 14 membuka pendaftaran calon peserta didik baru dengan rincian kuota: Jalur Zonasi (50%), Jalur Prestasi (30%), Jalur Afirmasi (15%), dan Jalur Perpindahan Tugas Orang Tua (5%). Pendaftaran dapat dilakukan langsung melalui portal online resmi di website ini. Berkas wajib diverifikasi sebelum batas waktu yang ditentukan.`,
    documentName: 'Juknis_PPDB_2026_SMPN14.pdf',
    important: true
  },
  {
    id: 'ann-2',
    title: 'Jadwal Asesmen Sumatif Akhir Semester (ASAS) Ganjil dan Tryout Bersama',
    category: 'Akademik',
    date: '12 Oktober 2026',
    dateIso: '2026-10-12',
    summary: 'Pelaksanaan asesmen sumatif semester ganjil berbasis komputer dan tes tertulis akan dimulai serentak pada tanggal 24 November 2026.',
    content: `Diberitahukan kepada seluruh siswa kelas VII, VIII, dan IX beserta bapak/ibu wali murid bahwa Asesmen Sumatif Akhir Semester (ASAS) Ganjil Tahun Ajaran 2026/2027 akan diselenggarakan mulai tanggal 24 November s.d. 02 Desember 2026. Seluruh siswa diharapkan mengecek kartu peserta ujian dan menyelesaikan seluruh tagihan tugas praktikum.`,
    documentName: 'Jadwal_ASAS_Ganjil_2026.pdf',
    important: false
  },
  {
    id: 'ann-3',
    title: 'Sosialisasi Penilaian Karakter Profil Pelajar Pancasila (P5) Tema Kearifan Lokal',
    category: 'Kesiswaan',
    date: '05 Oktober 2026',
    dateIso: '2026-10-05',
    summary: 'Gelar Karya P5 dengan tema "Melestarikan Ragam Seni Tiyuh Tulang Bawang Barat" akan diselenggarakan di lapangan utama sekolah.',
    content: `Sebagai implementasi Kurikulum Merdeka, SMPN 14 akan mengadakan pameran karya siswa mencakup olahan pangan lokal singkong dan pisang, kerajinan anyaman bambu, serta pementasan seni drama tradisi Lampung. Orang tua murid diundang hadir memberikan apresiasi kepada putra-putrinya.`,
    documentName: 'Panduan_Gelar_Karya_P5.pdf',
    important: false
  },
  {
    id: 'ann-4',
    title: 'Undangan Rapat Pleno Komite Sekolah & Laporan Perkembangan Belajar Tengah Semester',
    category: 'Edaran',
    date: '26 September 2026',
    dateIso: '2026-09-26',
    summary: 'Pertemuan berkala orang tua/wali murid bersama dewan guru dan pengurus komite sekolah mengenai program beasiswa dan sarana digital.',
    content: `Kami mengundang seluruh orang tua/wali murid kelas VII, VIII, dan IX untuk hadir dalam Rapat Pleno Komite Sekolah yang akan diadakan pada hari Sabtu, 31 Oktober 2026 pukul 08.30 WIB di Ruang Aula Pertemuan SMPN 14 Tulang Bawang Barat. Kehadiran bapak/ibu sangat berarti demi kemajuan pendidikan anak-anak kita.`,
    documentName: 'Surat_Undangan_Komite_2026.pdf',
    important: false
  }
];

export const INITIAL_APPLICANTS: PPDBApplicant[] = [
  {
    registrationNumber: 'PPDB-2026-SMPN14-0012',
    fullName: 'Muhammad Rizky Pratama',
    nisn: '0129384721',
    nik: '1812011405080001',
    birthPlace: 'Tulang Bawang Barat',
    birthDate: '2013-05-14',
    gender: 'Laki-laki',
    previousSchool: 'SD Negeri 1 Panaragan Jaya',
    track: 'Zonasi',
    parentName: 'Bambang Supriyanto',
    parentPhone: '081273948210',
    address: 'Jl. Pemda No. 24, Panaragan Jaya, Kab. Tulang Bawang Barat',
    submissionDate: '2026-10-19 09:15 WIB',
    status: 'Terverifikasi',
    notes: 'Berkas lengkap: Akta lahir, KK, Nilai Rapor SD, dan SKL terlampir.'
  },
  {
    registrationNumber: 'PPDB-2026-SMPN14-0013',
    fullName: 'Anindya Salma Putri',
    nisn: '0128472910',
    nik: '1812025608090002',
    birthPlace: 'Kotabumi',
    birthDate: '2013-08-22',
    gender: 'Perempuan',
    previousSchool: 'SD Negeri 2 Daya Murni',
    track: 'Prestasi',
    parentName: 'Hendra Gunawan, S.E.',
    parentPhone: '085268192033',
    address: 'Kompleks Asri Indah Blok C3, Kec. Tumijajar, Kab. Tubaba',
    submissionDate: '2026-10-19 11:42 WIB',
    status: 'Lolos Seleksi',
    notes: 'Juara 1 OSN Matematika Tingkat Kecamatan dan Nilai Rata-rata 92.4.'
  },
  {
    registrationNumber: 'PPDB-2026-SMPN14-0014',
    fullName: 'Galih Bagas Saputra',
    nisn: '0125739102',
    nik: '1812012002100003',
    birthPlace: 'Menggala',
    birthDate: '2013-02-18',
    gender: 'Laki-laki',
    previousSchool: 'MI Nurul Huda Tubaba',
    track: 'Afirmasi',
    parentName: 'Suryanto',
    parentPhone: '082379104820',
    address: 'Tiyuh Karta Raharja RT 02/RW 01, Tulang Bawang Udik',
    submissionDate: '2026-10-20 14:05 WIB',
    status: 'Menunggu Berkas',
    notes: 'Pemegang KIP Aktif. Mohon menyerahkan fotokopi legalisir Kartu Keluarga ke loket TU.'
  }
];

export const SCHOOL_FACILITIES = [
  {
    title: 'Ruang Kelas Nyaman & Multimedia',
    desc: 'Dilengkapi pencahayaan alami optimal, ventilasi silang, proyektor LCD, dan papan tulis ganda.',
    icon: 'DoorOpen'
  },
  {
    title: 'Laboratorium Sains & Komputer',
    desc: 'Fasilitas perangkat eksperimen fisika/biologi modern serta 40 unit PC terhubung jaringan serat optik.',
    icon: 'Microscope'
  },
  {
    title: 'Perpustakaan Literasi Ramah Anak',
    desc: 'Koleksi ribuan buku fiksi, non-fiksi, ensiklopedia edukasi, area pojok baca santai dan e-library.',
    icon: 'BookOpen'
  },
  {
    title: 'Gelanggang Olahraga & Lapangan Upacara',
    desc: 'Lapangan futsal, voli, basket terawat serta area latihan upacara bendera dan pramuka yang luas.',
    icon: 'Trophy'
  },
  {
    title: 'Musholla Al-Ikhlas SMPN 14',
    desc: 'Pusat kegiatan ibadah salat zuhur berjamaah, pembacaan surat yasin Jumat pagi, dan kajian keputrian.',
    icon: 'Building2'
  },
  {
    title: 'Unit Kesehatan Sekolah (UKS) & Kantin Sehat',
    desc: 'Ruang rawat pertolongan pertama dengan tenaga pembina PMR terlatih dan kantin higienis bebas 5P.',
    icon: 'HeartHandshake'
  }
];

export const SCHOOL_EXTRAS: ExtracurricularItem[] = [
  {
    id: 'ekskul-1',
    name: 'Pramuka Gugus Depan 14.01 - 14.02',
    category: 'Wajib & Kepemimpinan',
    schedule: 'Jumat, 14.00 - 16.30 WIB',
    coach: 'Kak Bagus Prakoso & Kak Nuraini',
    desc: 'Membentuk kemandirian, kecintaan alam, keterampilan pioneering, semapur, dan morse.'
  },
  {
    id: 'ekskul-2',
    name: 'Sanggar Seni Tari & Musik Lampung',
    category: 'Seni Budaya',
    schedule: 'Rabu, 15.00 - 16.45 WIB',
    coach: 'Ibu Nurul Hidayati, S.Pd.',
    desc: 'Melatih olah tubuh tari tradisional (Sigeh Penguten, Bedana) serta musik cetik kulintang Lampung.'
  },
  {
    id: 'ekskul-3',
    name: 'Palang Merah Remaja (PMR Madya)',
    category: 'Kemanusiaan',
    schedule: 'Kamis, 15.00 - 16.30 WIB',
    coach: 'Ibu Siti Masithoh, S.Pd.',
    desc: 'Pelatihan pertolongan pertama, donor darah sukarela, evakuasi bencana, dan pola hidup bersih.'
  },
  {
    id: 'ekskul-4',
    name: 'Tim Olahraga (Futsal & Bola Voli)',
    category: 'Olahraga Prestasi',
    schedule: 'Selasa & Sabtu, 15.30 - 17.30 WIB',
    coach: 'Pak Bagus Prakoso, S.Pd.',
    desc: 'Pembinaan taktik, kekuatan fisik, stamina, dan kejuaraan turnamen tingkat antarpelajar se-provinsi.'
  },
  {
    id: 'ekskul-5',
    name: 'Klub Sains & Olimpiade Matematika',
    category: 'Akademik Unggulan',
    schedule: 'Senin & Kamis, 14.30 - 16.00 WIB',
    coach: 'Pak Rahmat Hidayat & Bu Siti Masithoh',
    desc: 'Pendalaman materi penalaran tinggi (HOTS), persiapan OSN tingkat kabupaten dan provinsi.'
  },
  {
    id: 'ekskul-6',
    name: 'Rohani Islam (Rohis) & Tahfidz',
    category: 'Keagamaan',
    schedule: 'Senin - Kamis Ba\'da Ashar',
    coach: 'Ustadz Ahmad Fauzi, S.Pd.I.',
    desc: 'Bimbingan tahsin Al-Qur\'an, hafalan juz 30, rebana hadrah, dan kepribadian muslim berkarakter.'
  }
];

export const INITIAL_MORNING_ACTIVITIES: MorningActivity[] = [
  {
    id: 'pagi-5s',
    day: 'Setiap Pagi',
    time: '06.45 – 07.15 WIB',
    title: 'Penyambutan 5S (Senyum, Salam, Sapa, Sopan, Santun)',
    coordinator: 'Tim Guru Piket & Pengurus OSIS',
    location: 'Gerbang Utama SMPN 14 Tubaba',
    description:
      'Guru piket dan perwakilan OSIS menyambut kedatangan peserta didik di gerbang sekolah untuk menanamkan budaya ramah, disiplin waktu, dan kerapian seragam sejak pagi hari.',
    imageUrl: '/src/assets/images/hero_smpn14_building_1792594018035.jpg'
  },
  {
    id: 'pagi-senin',
    day: 'Senin',
    time: '07.00 – 07.45 WIB',
    title: 'Upacara Bendera & Pembinaan Karakter Kebangsaan',
    coordinator: 'Waka Kesiswaan & Pembina OSIS',
    location: 'Lapangan Upacara Utama',
    description:
      'Pembiasaan kedisiplinan, pengibaran Sang Merah Putih, pembacaan UUD 1945, serta amanat pembina upacara untuk menumbuhkan nasionalisme dan karakter Nenemo.',
    imageUrl: '/src/assets/images/activity_ceremony_1792594019651.jpg'
  },
  {
    id: 'pagi-selasa',
    day: 'Selasa',
    time: '07.00 – 07.25 WIB',
    title: 'Gerakan Literasi Sekolah (GLS) & Pojok Baca Pagi',
    coordinator: 'Tim Literasi & Wali Kelas',
    location: 'Ruang Kelas & Taman Baca',
    description:
      'Membaca buku non-pelajaran pilihan selama 15–20 menit sebelum jam pelajaran pertama, dilanjutkan ringkasan lisan untuk meningkatkan minat baca dan daya nalar siswa.',
    imageUrl: '/src/assets/images/activity_science_lab_1792594020856.jpg'
  },
  {
    id: 'pagi-rabu',
    day: 'Rabu',
    time: '07.00 – 07.30 WIB',
    title: 'Rabu Bersih & Operasi Semut Adiwiyata',
    coordinator: 'Pembina Adiwiyata & UKS',
    location: 'Seluruh Lingkungan Kelas & Taman',
    description:
      'Gerakan bersama merawat kebersihan ruang belajar, pemilahan sampah organik dan anorganik, serta pemeliharaan tanaman peneduh sekolah.',
    imageUrl: '/src/assets/images/activity_scout_pramuka_1792594019748.jpg'
  },
  {
    id: 'pagi-kamis',
    day: 'Kamis',
    time: '06.50 – 07.30 WIB',
    title: 'Senam Anak Indonesia Hebat & Kebugaran Pagi',
    coordinator: 'Guru PJOK & Tim Olahraga',
    location: 'Lapangan Serbaguna SMPN 14',
    description:
      'Senam pagi bersama seluruh guru dan siswa guna menjaga kebugaran jasmani, kekompakan, dan semangat belajar sepanjang hari.',
    imageUrl: '/src/assets/images/activity_ceremony_1792594019651.jpg'
  },
  {
    id: 'pagi-jumat',
    day: 'Jumat',
    time: '07.00 – 07.40 WIB',
    title: 'Jumat Berkah, Pembinaan Imtaq & Doa Bersama',
    coordinator: 'Guru PAI & Pembina Rohis',
    location: 'Musholla Al-Ikhlas & Lapangan',
    description:
      'Pembacaan Surat Yasin, Asmaul Husna, kultum siswa, serta penguatan akhlak mulia dan kepedulian sosial warga SMPN 14 Tulang Bawang Barat.',
    imageUrl: '/src/assets/images/hero_smpn14_building_1792594018035.jpg'
  }
];

