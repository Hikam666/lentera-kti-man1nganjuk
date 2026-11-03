import { StructureSection, StepDefinition, KbcValueItem } from '../types';

export const STRUCTURE: StructureSection[] = [
  { key: 'abstrak', label: 'Abstrak', kw: ['abstrak'], limit: 300 },
  { key: 'bab1', label: 'BAB I Pendahuluan', kw: ['bab i pendahuluan', 'bab i', 'pendahuluan'], limit: 1000 },
  { key: 'bab2', label: 'BAB II Kajian Teori dan Tinjauan Pustaka', kw: ['bab ii kajian teori', 'bab ii', 'kajian teori dan tinjauan pustaka'], limit: 1500 },
  { key: 'bab3', label: 'BAB III Metode Riset', kw: ['bab iii metode riset', 'bab iii', 'metode riset'], limit: 1000 },
  { key: 'bab4', label: 'BAB IV Hasil dan Pembahasan', kw: ['bab iv hasil', 'bab iv', 'hasil dan pembahasan'], limit: 3000 },
  { key: 'bab5', label: 'BAB V Penutup', kw: ['bab v penutup', 'bab v', 'penutup'], limit: 750 },
  { key: 'pustaka', label: 'Daftar Pustaka', kw: ['daftar pustaka'], limit: null },
];

export const INFORMAL_WORDS = [
  'gue', 'aku', 'nggak', 'gak', 'ngga', 'kayak', 'banget', 'dong', 'deh', 'nih', 'emang', 'kayaknya', 'pokoknya'
];

export const HEDGE_PHRASES = [
  'menurut saya', 'saya rasa', 'sepertinya'
];

export const REDUNDANT_PHRASES = [
  'agar supaya', 'demi untuk', 'adalah merupakan', 'sangat sekali', 'sangat penting sekali',
  'berbagai macam', 'maju ke depan', 'mundur ke belakang', 'naik ke atas', 'turun ke bawah',
  'saling bekerja sama satu sama lain'
];

export const NONBAKU_ABBR = [
  'yg', 'dgn', 'tdk', 'krn', 'utk', 'dr', 'sdh', 'blm', 'jd', 'klo', 'kalo', 'dpt', 'spy'
];

// Standar Sitasi APA Edisi Ke-7 (Parentetikal & Naratif)
// Mendukung: 1 penulis, 2 penulis (& / dan), >=3 penulis (dkk. / et al.), nama dengan spasi/hyphen, dan tanpa tahun (t.t. / n.d.)
export const APA_PAREN_RE = /\(([A-Z][a-zA-Z0-9À-ÿ\s,&.'-]+?),\s*(\d{4}[a-z]?|n\.d\.|t\.t\.)(?:(?:,\s*(?:hlm\.|p\.|hal\.)\s*|\s*:\s*)\d+(?:-\d+)?)?\)/g;
export const APA_NARR_RE = /\b([A-Z][a-zA-Z0-9À-ÿ.'-]+(?:\s+(?:et\s+al\.|dkk\.))?)\s*\(\s*(\d{4}[a-z]?|n\.d\.|t\.t\.)\s*\)/g;

export const KBC_VALUES: KbcValueItem[] = [
  {
    k: 'allah',
    n: 'Cinta Allah SWT dan Rasul-Nya',
    re: /cinta\s+(kepada\s+)?(allah|rasul)/i,
    d: 'menumbuhkan pemahaman bahwa rahmah Allah lebih dominan daripada murka-Nya, sehingga ibadah, sunnah Rasulullah, dan khidmat kepada sesama tumbuh dari rasa cinta, bukan paksaan',
    ind: ['asmaul husna', 'ar-rahman', 'ar-rahim', 'al-adl', 'al-latif', 'ar-rauf', 'rahmah', 'welas asih', 'jamaliyah', 'jalaliyah', 'sirah', 'rasulullah', 'sunnah', 'hadis', 'ketakwaan', 'keimanan', 'ibadah', 'salat', 'zikir', 'al-quran', 'syukur', 'amanah', 'akhlak mulia', 'teladan']
  },
  {
    k: 'ilmu',
    n: 'Cinta Ilmu',
    re: /cinta\s+ilmu/i,
    d: 'semangat menuntut ilmu sebagai sarana memahami keagungan penciptaan Allah SWT serta melatih murid menjadi pembelajar sepanjang hayat yang memanfaatkan teknologi secara bijak',
    ind: ['menuntut ilmu', 'mencari ilmu', 'pembelajar sepanjang hayat', 'sepanjang hayat', 'literasi', 'teknologi', 'inovasi', 'penalaran kritis', 'qauliyah', 'kauniyah', 'adab kepada guru', 'transformasi sosial', 'tekun', 'tawakal', 'keagungan penciptaan', 'kebesaran ciptaan', 'keseimbangan hidup', 'keberagaman']
  },
  {
    k: 'lingkungan',
    n: 'Cinta Lingkungan',
    re: /cinta\s+lingkungan/i,
    d: 'memandang alam semesta sebagai manifestasi cinta dan kebesaran Allah SWT sehingga tumbuh sikap hormat dan kepedulian terhadap lingkungan, serta menghindari fasad atau perusakan alam',
    ind: ['rahmatan lil alamin', 'alam semesta', 'sunnatullah', 'fasad', 'merusak lingkungan', 'kerusakan', 'kebersihan', 'thaharah', 'hemat energi', 'ishraf', 'keseimbangan', 'keberlanjutan', 'kelestarian', 'ekosistem', 'al-araf', 'ar-rum', 'adab pada alam', 'ciptaan allah']
  },
  {
    k: 'diri',
    n: 'Cinta Diri dan Sesama Manusia',
    re: /cinta\s+(diri|sesama)/i,
    d: 'merawat potensi diri dengan penuh syukur dan self-compassion serta membangun hubungan yang harmonis melalui tasamuh, tawasuth, dan musyawarah',
    ind: ['self-compassion', 'syukur', 'sabar', 'qanaah', 'ikhtiar', 'kesejahteraan mental', 'mental health', 'kesehatan mental', 'social emotional', 'sosial emosional', 'ukhuwah', 'persaudaraan', 'tasamuh', 'toleransi', 'tawasuth', 'moderat', 'syura', 'musyawarah', 'taawun', 'tafahum', 'tawadhu', 'husnuzhan', 'keragaman', 'kemanusiaan', 'empati', 'harmonis']
  },
  {
    k: 'tanahair',
    n: 'Cinta Tanah Air',
    re: /cinta\s+tanah\s+air|hubbul\s+wath?[ao]n/i,
    d: 'semangat Hubbul Wathan minal Iman dan kontribusi nyata bagi kemajuan bangsa dengan tetap menghormati perbedaan suku, budaya, dan agama dalam bingkai persatuan',
    ind: ['hubbul wathan', 'cinta tanah air', 'ukhuwah wathaniyah', 'persaudaraan kebangsaan', 'kebangsaan', 'persatuan', 'al-hujurat', 'kedaulatan', 'keamanan negara', 'kemajuan bangsa', 'kearifan lokal', 'budaya', 'bangsa', 'nasional', 'nusantara']
  }
];

export const KBC_TEMA_MAP: Record<string, string[]> = {
  eko: ['allah', 'lingkungan', 'ilmu'],
  sdg: ['diri', 'ilmu', 'lingkungan', 'tanahair'],
  dig: ['ilmu', 'tanahair']
};

export function kbcTemaKeys(tema?: string): string[] | null {
  const t = (tema || '').toLowerCase();
  if (/ekoteologi|keislaman/.test(t)) return KBC_TEMA_MAP.eko;
  if (/sustainable|sdg/.test(t)) return KBC_TEMA_MAP.sdg;
  if (/digital/.test(t)) return KBC_TEMA_MAP.dig;
  return null;
}

export const KBC_LINK_RE = /sejalan dengan|selaras dengan|sesuai dengan|wujud nyata|merupakan wujud|mencerminkan|menegaskan|sebagai bagian dari|berkaitan dengan|melandasi|dilandasi|berlandaskan|bingkai|mewujudkan|menjadi jalan|sarana/i;
export const KBC_RES_RE = /hasil|temuan|peningkatan|meningkat|menunjukkan|data|penerapan|efektif|pengaruh|riset ini|penelitian ini|capaian|skor/i;

export const SAMPLE_PAPER = `BAB I PENDAHULUAN
Transformasi digital mendorong murid untuk menguasai keterampilan berpikir komputasional yang relevan dengan kebutuhan abad ke-21. Kondisi ini terlihat dari meningkatnya penggunaan aplikasi pembelajaran interaktif di berbagai jenjang pendidikan (Hidayat, 2021). Berdasarkan survei awal, sekitar 55% murid kelas XI belum terbiasa menyelesaikan masalah secara sistematis. Kesenjangan ini menjadi masalah karena kemampuan tersebut menjadi dasar literasi digital. Penelitian terdahulu oleh Agustini dkk. (2024) menunjukkan bahwa game edukasi mampu meningkatkan keterampilan berpikir komputasi murid. Oleh karena itu, riset ini penting dilakukan untuk mengembangkan media pembelajaran berbasis game yang mengintegrasikan kearifan lokal. Upaya ini sejalan dengan nilai Cinta Ilmu dalam Kurikulum Berbasis Cinta (KBC), yaitu semangat menuntut ilmu sebagai sarana memahami keagungan penciptaan Allah SWT serta melatih murid menjadi pembelajar sepanjang hayat yang memanfaatkan teknologi secara bijak (lihat Lampiran 7).

Rumusan masalah dalam riset ini adalah bagaimana efektivitas media game edukasi terhadap kemampuan berpikir komputasional murid kelas XI? Tujuan riset ini adalah untuk mendeskripsikan efektivitas media game edukasi terhadap kemampuan berpikir komputasional murid kelas XI.

BAB II KAJIAN TEORI DAN TINJAUAN PUSTAKA
Computational thinking merupakan kemampuan berpikir sistematis dalam memecahkan masalah melalui prinsip komputasi (Oktifa, 2022). Menurut Jamun (2018), penggunaan permainan dalam pembelajaran dapat mendorong murid belajar secara aktif. Penelitian terdahulu oleh Jubaedi (2017) menunjukkan bahwa digital storytelling mampu menghadirkan konteks budaya secara lebih hidup dibandingkan metode ceramah. Riset ini berbeda karena mengintegrasikan kearifan lokal Nganjuk ke dalam game edukasi interaktif.

BAB III METODE RISET
Jenis riset yang digunakan adalah Research and Development (R&D). Pendekatan riset menggunakan model ADDIE. Teknik dan alat pengumpul data berupa angket dan observasi terhadap 60 murid kelas XI. Rencana analisis data menggunakan pendekatan campuran kualitatif dan kuantitatif untuk mengukur peningkatan kemampuan berpikir komputasional.

BAB IV HASIL DAN PEMBAHASAN
Hasil riset menunjukkan bahwa murid yang menggunakan media game edukasi mengalami peningkatan kemampuan berpikir komputasional dibandingkan sebelum perlakuan. Berdasarkan hasil analisis data, rata-rata skor pascates lebih tinggi dibandingkan skor prates. Temuan ini sejalan dengan Agustini dkk. (2024) yang menyatakan bahwa game berbasis masalah efektif melatih keterampilan berpikir sistematis. Peningkatan ini menegaskan bahwa pembelajaran berbasis game merupakan wujud nyata dari nilai Cinta Ilmu sebagaimana ditegaskan dalam KBC: ilmu menjadi jalan bagi murid untuk mengenal kebesaran ciptaan Allah SWT dan menumbuhkan sikap pembelajar yang tekun, kreatif, serta bertanggung jawab dalam memanfaatkan teknologi (lihat Lampiran 7).

BAB V PENUTUP
Simpulan riset ini adalah media game edukasi efektif meningkatkan kemampuan berpikir komputasional murid kelas XI. Saran yang dapat diberikan adalah pengembangan lebih lanjut pada aspek kearifan lokal lain di Kabupaten Nganjuk.

DAFTAR PUSTAKA
Agustini, K. T., Suparta, I. N., & Ardana, I. M. (2024). Meningkatkan keterampilan berpikir komputasi menggunakan game edukasi dengan model game based learning. Jurnal Media dan Teknologi Pendidikan, 4(4), 627-638.
Jamun, Y. M. (2018). Dampak teknologi terhadap pendidikan. Jurnal Pendidikan dan Kebudayaan Missio, 10(1), 48-52.
Jubaedi, A. D. (2017). Digital learning based storytelling model untuk pembelajaran sejarah. Prosiding Seminar Nasional Riset Terapan.`;

export const SIM_SAMPLE_A = `Kearifan lokal Kabupaten Nganjuk perlu diperkenalkan kembali kepada generasi muda melalui media pembelajaran yang menarik. Kearifan lokal merupakan nilai budaya yang berasal dari nenek moyang dan terus dipertahankan sebagai pedoman hidup masyarakat suatu daerah dari satu generasi ke generasi berikutnya. Salah satu bentuk pelestarian yang dapat dilakukan adalah melalui pengembangan game edukasi berbasis cerita rakyat setempat.`;

export const SIM_SAMPLE_B = `Kearifan lokal merupakan nilai budaya yang berasal dari nenek moyang dan terus dipertahankan yang dijadikan pedoman hidup oleh masyarakat suatu daerah dari satu generasi ke generasi berikutnya. Istilah ini sering disebut juga sebagai kebijakan setempat atau pengetahuan setempat.`;

export const KBC_SAMPLE_LATAR = `Kemampuan menulis teks eksplanasi merupakan kompetensi literasi yang penting bagi murid. Namun, hasil observasi awal di kelas XI menunjukkan bahwa sebagian besar murid masih kesulitan menyusun teks eksplanasi yang runtut. Media infografis digital berpotensi meningkatkan kemampuan tersebut. Upaya ini sejalan dengan nilai Cinta Ilmu dalam Kurikulum Berbasis Cinta (KBC), yaitu semangat menuntut ilmu sebagai sarana memahami keagungan penciptaan Allah SWT serta melatih murid menjadi pembelajar sepanjang hayat yang mampu memanfaatkan teknologi secara bijak (lihat Lampiran 7).`;

export const KBC_SAMPLE_PEMB = `Hasil riset menunjukkan bahwa media infografis digital meningkatkan kemampuan murid menyusun teks eksplanasi. Murid lebih mudah mengorganisasikan gagasan. Peningkatan ini menegaskan bahwa literasi digital yang dipadukan dengan semangat mencari ilmu merupakan wujud nyata dari nilai Cinta Ilmu sebagaimana ditegaskan dalam KBC: ilmu menjadi jalan bagi murid untuk mengenal kebesaran ciptaan Allah SWT dan menumbuhkan sikap pembelajar yang tekun serta bertanggung jawab dalam memanfaatkan teknologi (lihat Lampiran 7).`;

export const PROPOSAL_STEPS: StepDefinition[] = [
  {
    key: 'tema',
    title: 'Tema Riset',
    type: 'select',
    options: [
      'Integrasi Keislaman dan Keilmuan (Ekoteologi)',
      'Sustainable Development Goals (SDGs)',
      'Transformasi Digital untuk Pembangunan Nasional'
    ],
    hint: 'Pilih salah satu tema riset resmi sesuai Bab II.B.2 Pedoman KTI MAN 1 Nganjuk.'
  },
  {
    key: 'judul',
    title: 'Judul Riset',
    limit: 15,
    hint: 'Bentuk frasa, bukan kalimat, mencerminkan garis besar riset secara ringkas.',
    validate: (v) => {
      const trimmed = v.trim();
      const wc = trimmed.length ? trimmed.split(/\s+/).length : 0;
      if (wc === 0) return null;
      if (wc > 15) return `Judul melebihi 15 kata (${wc} kata). Ringkas kembali.`;
      if (trimmed.endsWith('.')) return 'Judul berbentuk frasa, tidak diakhiri tanda titik.';
      if (trimmed.includes('?')) return 'Judul berbentuk frasa, bukan kalimat tanya.';
      return null;
    }
  },
  {
    key: 'identitas',
    title: 'Identitas Penyusun',
    hint: 'Nama murid (maksimal 3 orang), NISN, kelas, dan nama pembimbing.',
    validate: (v) => v.trim().length < 15 ? 'Lengkapi identitas: nama, NISN, kelas, dan nama pembimbing.' : null
  },
  {
    key: 'latar',
    title: 'Latar Belakang Riset',
    limit: 450,
    hint: 'Memuat enam komponen: kondisi umum, fakta/data empirik, identifikasi masalah, penelitian terdahulu, urgensi/solusi, dan integrasi nilai Kurikulum Berbasis Cinta (KBC).',
    validate: (v) => {
      const trimmed = v.trim();
      const wc = trimmed.length ? trimmed.split(/\s+/).length : 0;
      if (wc === 0) return null;
      if (wc > 450) return `Melebihi batas 450 kata (${wc} kata).`;
      const l = v.toLowerCase();
      const comp = [
        { label: 'kondisi umum', hit: /fenomena|kondisi|era|zaman|saat ini/.test(l) },
        { label: 'fakta/data empirik', hit: /data|persentase|survei|%|statistik/.test(l) },
        { label: 'identifikasi masalah', hit: /masalah|kesenjangan|belum|kurang|hambatan/.test(l) },
        { label: 'penelitian terdahulu', hit: /penelitian terdahulu|riset sebelumnya|menurut|\(\s*[a-z]+.*\d{4}.*\)/.test(l) },
        { label: 'urgensi/solusi', hit: /penting|perlu|urgensi|oleh karena itu/.test(l) },
        { label: 'integrasi nilai KBC', hit: /kurikulum berbasis cinta|\bkbc\b|cinta (allah|rasul|ilmu|lingkungan|diri|sesama|tanah air)/.test(l) },
      ];
      const missing = comp.filter(c => !c.hit).map(c => c.label);
      return missing.length ? 'Komponen belum lengkap: ' + missing.join(', ') + '.' : null;
    }
  },
  {
    key: 'rumusan',
    title: 'Rumusan Masalah',
    hint: 'Kalimat tanya yang singkat, jelas, dan operasional.',
    validate: (v) => v.trim() && !v.includes('?') ? 'Rumusan masalah harus berupa kalimat tanya bertanda tanya (?).' : null
  },
  {
    key: 'tujuan',
    title: 'Tujuan Riset',
    hint: 'Pernyataan (bukan kalimat tanya), selaras dengan rumusan masalah.',
    validate: (v, all) => {
      if (!v.trim()) return null;
      if (v.includes('?')) return 'Tujuan ditulis sebagai pernyataan, bukan kalimat tanya.';
      const r = (all.rumusan || '').toLowerCase();
      const words = v.toLowerCase().split(/\W+/).filter(w => w.length > 5);
      const overlap = words.some(w => r.includes(w));
      if (r.trim() && !overlap) return 'Periksa keselarasan tujuan dengan rumusan masalah (gunakan kata kunci yang sejalan).';
      return null;
    }
  },
  {
    key: 'manfaat',
    title: 'Manfaat Riset',
    hint: 'Uraikan manfaat teoretis dan manfaat praktis.',
    validate: (v) => {
      if (!v.trim()) return null;
      const l = v.toLowerCase();
      const ok = (/teorit|teoret/.test(l)) && /praktis/.test(l);
      return ok ? null : 'Sertakan manfaat teoretis maupun manfaat praktis secara eksplisit.';
    }
  },
  {
    key: 'kajianteori',
    title: 'Kajian Teori',
    limit: 350,
    hint: 'Teori-teori kunci yang mendasari riset, disertai sitasi APA.',
    validate: (v) => {
      const trimmed = v.trim();
      const wc = trimmed.length ? trimmed.split(/\s+/).length : 0;
      if (wc === 0) return null;
      if (wc > 350) return `Melebihi batas 350 kata (${wc} kata).`;
      const hasCit = APA_PAREN_RE.test(v) || APA_NARR_RE.test(v);
      return hasCit ? null : 'Sertakan sitasi APA, misalnya (Nama, Tahun) atau Nama (Tahun).';
    }
  },
  {
    key: 'tinjauan',
    title: 'Tinjauan Pustaka / Riset Terdahulu',
    limit: 500,
    hint: 'Ringkasan riset relevan sebelumnya, sertakan penegasan kebaruan riset ini.',
    validate: (v) => {
      const trimmed = v.trim();
      const wc = trimmed.length ? trimmed.split(/\s+/).length : 0;
      if (wc === 0) return null;
      if (wc > 500) return `Melebihi batas 500 kata (${wc} kata).`;
      const citCount = (v.match(APA_PAREN_RE) || []).length + (v.match(APA_NARR_RE) || []).length;
      if (citCount < 2) return 'Sertakan minimal dua rujukan riset terdahulu dengan sitasi APA.';
      if (!/berbeda|kebaruan|belum|orisinal|perbedaan/.test(v.toLowerCase())) {
        return 'Tegaskan perbedaan/kebaruan riset ini dibanding riset terdahulu.';
      }
      return null;
    }
  },
  {
    key: 'hipotesis',
    title: 'Hipotesis (jika diperlukan)',
    hint: 'Opsional — riset kualitatif deskriptif boleh mengosongkan bagian ini.'
  },
  {
    key: 'metode',
    title: 'Metode Riset',
    limit: 750,
    hint: 'Empat subkomponen: jenis riset, pendekatan riset, teknik dan alat pengumpul data, rencana analisis data.',
    validate: (v) => {
      const trimmed = v.trim();
      const wc = trimmed.length ? trimmed.split(/\s+/).length : 0;
      if (wc === 0) return null;
      if (wc > 750) return `Melebihi batas 750 kata (${wc} kata).`;
      const l = v.toLowerCase();
      const comp = [
        { label: 'jenis riset', hit: /jenis riset|jenis penelitian/.test(l) },
        { label: 'pendekatan riset', hit: /pendekatan/.test(l) },
        { label: 'teknik dan alat pengumpul data', hit: /pengumpulan data|instrumen|kuesioner|angket|wawancara|observasi/.test(l) },
        { label: 'rencana analisis data', hit: /analisis data/.test(l) },
      ];
      const missing = comp.filter(c => !c.hit).map(c => c.label);
      return missing.length ? 'Subkomponen belum lengkap: ' + missing.join(', ') + '.' : null;
    }
  },
  {
    key: 'jadwal',
    title: 'Lokasi, Alokasi Waktu, dan Anggaran Riset',
    hint: 'Tempat pelaksanaan, jadwal riset, dan estimasi biaya (jika ada).'
  },
  {
    key: 'daftarpustaka',
    title: 'Daftar Pustaka Sementara',
    hint: 'Gaya APA Edisi Ke-7, minimal dua sumber rujukan.',
    validate: (v) => {
      const text = (v || '').trim();
      if (!text) return null;

      // Parse multiline reference entries accurately
      // Supports entries separated by double-newline, single-newline hanging lines, or numbers
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const entries: string[] = [];
      let currentEntry = '';
      const YEAR_PATTERN = /\(\s*(?:\d{4}[a-z]?|[tT]\.[tT]\.|[nN]\.[dD]\.)[^)]*\)/;

      for (const line of lines) {
        let isNew = false;
        if (!currentEntry) {
          isNew = true;
        } else if (/^(?:[0-9]+[\.\)]|[-*•])\s*/.test(line)) {
          isNew = true;
        } else if (YEAR_PATTERN.test(line) && !YEAR_PATTERN.test(currentEntry)) {
          isNew = false;
        } else if (YEAR_PATTERN.test(line) && YEAR_PATTERN.test(currentEntry)) {
          isNew = true;
        }

        if (isNew && currentEntry) {
          entries.push(currentEntry);
          currentEntry = line;
        } else {
          currentEntry = currentEntry ? `${currentEntry} ${line}` : line;
        }
      }
      if (currentEntry) entries.push(currentEntry);

      if (entries.length < 2) {
        return 'Cantumkan minimal dua sumber rujukan.';
      }

      const missingYear = entries.filter(e => !YEAR_PATTERN.test(e));
      if (missingYear.length > 0) {
        const sampleSnippet = missingYear[0].substring(0, 30);
        return `Entri rujukan "${sampleSnippet}..." belum memuat tahun terbit dalam kurung, misalnya (2020) atau (t.t.). Pastikan tahun ditaruh di dalam tanda kurung sesuai gaya APA.`;
      }

      return null;
    }
  },
];
