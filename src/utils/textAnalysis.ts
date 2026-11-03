import {
  BahasaAssessment,
  KbcAssessmentResult,
  KbcValueItem,
  SimilarityResult
} from '../types';
import {
  INFORMAL_WORDS,
  HEDGE_PHRASES,
  REDUNDANT_PHRASES,
  NONBAKU_ABBR,
  KBC_VALUES,
  KBC_LINK_RE,
  KBC_RES_RE
} from '../data/rules';

export function countWords(s?: string): number {
  if (!s) return 0;
  const trimmed = s.trim();
  return trimmed.length ? trimmed.split(/\s+/).length : 0;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Mendeteksi kesalahan penulisan desimal dengan tanda titik pada teks bahasa Indonesia.
 * Otomatis MENGABAIKAN:
 * 1. Tautan URL (http, https, www)
 * 2. Tautan DOI (10.xxxx/xxxx, doi: xxxx)
 * 3. Penomoran subbab / outline (1.1, 2.3.1, dsb.)
 * 4. Metadata volume/nomor jurnal (Vol. 4. No. 2, hlm. 12-18)
 * 5. Penomoran gambar/tabel/lampiran
 */
export function detectDecimalErrors(clean: string): string[] {
  // 1. Hapus URL dan web links
  let text = clean.replace(/https?:\/\/[^\s)\]]+/gi, '');
  text = text.replace(/\bwww\.[^\s)\]]+/gi, '');
  text = text.replace(/\bdoi:\s*[^\s)\]]+/gi, '');
  text = text.replace(/\b10\.\d{4,9}\/[^\s)\]]+/gi, '');

  // 2. Hapus referensi volume, nomor, halaman jurnal
  text = text.replace(/\b(?:vol|no|hlm|pp|hal)\.\s*\d+(?:\.\d+)*/gi, '');

  // 3. Hapus penomoran subbab bertingkat (1.1.1, 2.3.1, dll)
  text = text.replace(/\b\d+\.\d+\.\d+(?:\.\d+)*\b/g, '');

  // 4. Hapus penomoran subbab bab utama (misal '1.1 Latar Belakang' atau '2.1 Kajian')
  text = text.replace(/(?:^|[\r\n\s])\d+\.\d+\s+[A-ZÀ-ÿ]/g, ' ');
  text = text.replace(/\b(?:subbab|bab|pasal|gambar|tabel|grafik|lampiran)\s+\d+\.\d+\b/gi, '');

  // 5. Temukan sisa bilangan desimal kuantitatif dengan titik (contoh: 85.5, 3.5%, 0.05)
  const matches = text.match(/(?<![A-Za-z0-9_\/])(\d+\.\d{1,4})(?![A-Za-z0-9_\/])/g) || [];
  return matches;
}

export function assessBahasa(text?: string): BahasaAssessment {
  const clean = text || '';
  const lower = clean.toLowerCase();

  // 1. Jelas, sistematis, logis, objektif
  const informalHits = INFORMAL_WORDS.filter(w =>
    new RegExp('\\b' + w + '\\b', 'i').test(clean)
  );
  const hedgeHits = HEDGE_PHRASES.filter(p => lower.includes(p));
  const objektifPass = informalHits.length === 0 && hedgeHits.length === 0;
  const objektifNote = objektifPass
    ? 'Tidak ditemukan ragam bahasa subjektif atau tidak baku; penyampaian gagasan cenderung jelas, sistematis, dan objektif.'
    : `Ditemukan ragam bahasa subjektif/tidak baku (${[...informalHits, ...hedgeHits].join(', ')}); gunakan bahasa yang objektif dan lugas, hindari opini pribadi tanpa dasar data.`;

  // 2. Kalimat efektif
  const redundantHits = REDUNDANT_PHRASES.filter(p => lower.includes(p));
  const sentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const avgLen = sentences.length
    ? sentences.reduce((a, s) => a + countWords(s), 0) / sentences.length
    : 0;
  const efektifPass = redundantHits.length === 0 && (avgLen === 0 || avgLen <= 32);
  const efektifNote = redundantHits.length > 0
    ? `Ditemukan pengulangan makna berlebihan (pleonasme) seperti "${redundantHits[0]}"; gunakan salah satu unsur saja agar kalimat lebih efektif.`
    : (avgLen > 32
        ? `Rata-rata panjang kalimat sekitar ${avgLen.toFixed(0)} kata; pertimbangkan memecah kalimat panjang menjadi beberapa kalimat agar lebih mudah dipahami.`
        : `Struktur kalimat cenderung efektif${avgLen > 0 ? ` dengan panjang rata-rata ${avgLen.toFixed(0)} kata per kalimat` : ''} dan tanpa pengulangan makna yang berlebihan.`);

  // 3. Ejaan dan tanda baca sesuai EYD V
  const abbrHits = NONBAKU_ABBR.filter(w =>
    new RegExp('\\b' + w + '\\b', 'i').test(clean)
  );
  const decimalMatches = detectDecimalErrors(clean);
  const decimalIssue = decimalMatches.length > 0;
  const eydPass = abbrHits.length === 0 && !decimalIssue;

  let eydNote = 'Tidak ditemukan singkatan tidak baku atau kesalahan penulisan bilangan desimal; ejaan cenderung sesuai kaidah EYD Edisi V.';
  if (abbrHits.length > 0 && decimalIssue) {
    eydNote = `Ditemukan singkatan tidak baku (${abbrHits.join(', ')}) dan penulisan desimal kuantitatif dengan tanda titik (${decimalMatches.slice(0, 3).join(', ')}); tulis kata secara lengkap dan gunakan tanda koma untuk desimal sesuai EYD V (misal 3,5 bukan 3.5). Tautan link/DOI dan nomor subbab tidak terpengaruh kaidah ini.`;
  } else if (abbrHits.length > 0) {
    eydNote = `Ditemukan singkatan tidak baku (${abbrHits.join(', ')}); tulis kata secara lengkap sesuai kaidah EYD Edisi V.`;
  } else if (decimalIssue) {
    eydNote = `Ditemukan penulisan bilangan desimal kuantitatif dengan tanda titik (${decimalMatches.slice(0, 3).join(', ')}); gunakan tanda koma untuk bilangan desimal kuantitatif sesuai kaidah EYD Edisi V (misalnya 3,5 bukan 3.5). Catatan: Tautan URL web, DOI, dan penomoran subbab (1.1) tidak terpengaruh kaidah ini.`;
  }

  const passCount = [objektifPass, efektifPass, eydPass].filter(Boolean).length;
  let status: BahasaAssessment['status'] = 'Perlu Ditingkatkan';
  if (passCount === 3) status = 'Sangat Efektif';
  else if (passCount === 2) status = 'Efektif';
  else if (passCount === 1) status = 'Cukup';

  return {
    status,
    avgLen,
    items: [
      { label: 'Jelas, Sistematis, Logis, dan Objektif', pass: objektifPass, note: objektifNote },
      { label: 'Kalimat Efektif', pass: efektifPass, note: efektifNote },
      { label: 'Ejaan dan Tanda Baca Sesuai EYD', pass: eydPass, note: eydNote },
    ]
  };
}

export function keywordOverlap(a?: string, b?: string, minLen = 5): string[] {
  const setA = new Set((a || '').toLowerCase().split(/\W+/).filter(w => w.length >= minLen));
  const wordsB = (b || '').toLowerCase().split(/\W+/).filter(w => w.length >= minLen);
  return Array.from(new Set(wordsB.filter(w => setA.has(w))));
}

export function tokenizeWithOffsets(text: string) {
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  const tokens: { word: string; start: number; end: number; norm: string }[] = [];
  while ((m = re.exec(text)) !== null) {
    const norm = m[0].toLowerCase().replace(/[^\wà-ÿ]/g, '');
    if (norm.length > 0) {
      tokens.push({
        word: m[0],
        start: m.index,
        end: m.index + m[0].length,
        norm
      });
    }
  }
  return tokens;
}

export function shingleSet(tokens: { norm: string }[], n: number): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i + n <= tokens.length; i++) {
    set.add(tokens.slice(i, i + n).map(t => t.norm).join(' '));
  }
  return set;
}

export function computeSimilarity(textA: string, textB: string, n = 5): SimilarityResult {
  const tokA = tokenizeWithOffsets(textA);
  const tokB = tokenizeWithOffsets(textB);

  if (tokA.length < n || tokB.length < n) {
    return {
      percent: 0,
      html: escapeHtml(textA),
      tooShort: true,
      tokACount: tokA.length,
      tokBCount: tokB.length
    };
  }

  const shinglesB = shingleSet(tokB, n);
  const matchedFlags = new Array(tokA.length).fill(false);

  for (let i = 0; i + n <= tokA.length; i++) {
    const shingle = tokA.slice(i, i + n).map(t => t.norm).join(' ');
    if (shinglesB.has(shingle)) {
      for (let k = i; k < i + n; k++) {
        matchedFlags[k] = true;
      }
    }
  }

  let html = '';
  let lastEnd = 0;
  let runStart: number | null = null;

  for (let i = 0; i < tokA.length; i++) {
    if (matchedFlags[i] && runStart === null) runStart = i;
    if (runStart !== null && (!matchedFlags[i] || i === tokA.length - 1)) {
      const runEndIdx = matchedFlags[i] ? i : i - 1;
      html += escapeHtml(textA.substring(lastEnd, tokA[runStart].start));
      html += `<mark class="bg-[#F9D2D2] text-[#991B1B] px-1 rounded">${escapeHtml(
        textA.substring(tokA[runStart].start, tokA[runEndIdx].end)
      )}</mark>`;
      lastEnd = tokA[runEndIdx].end;
      runStart = null;
    }
  }
  html += escapeHtml(textA.substring(lastEnd));

  const matchedWordCount = matchedFlags.filter(Boolean).length;
  const percent = tokA.length > 0 ? (matchedWordCount / tokA.length) * 100 : 0;

  return {
    percent,
    html,
    tooShort: false,
    tokACount: tokA.length,
    tokBCount: tokB.length
  };
}

export function assessKbc(
  text: string,
  mode: 'latar' | 'pembahasan',
  options?: { judul?: string; latarVals?: string[] | null }
): KbcAssessmentResult {
  const opt = options || {};
  const clean = text || '';
  const sents = clean.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);

  const hasExp = (s: string) => /kurikulum berbasis cinta|\bkbc\b/i.test(s);
  const isK = (s: string) => hasExp(s) || KBC_VALUES.some(v => v.re.test(s));
  const kIdx = sents.map((s, i) => (isK(s) ? i : -1)).filter(i => i >= 0);

  const ctx = kIdx.map(i => sents[i] + ' ' + (sents[i + 1] || '')).join(' ').toLowerCase().replace(/['"`]/g, '');

  const vals: KbcValueItem[] = KBC_VALUES.filter(v => v.re.test(clean)).map(v => ({
    ...v,
    hits: v.ind.filter(w =>
      new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)').test(ctx)
    )
  }));

  const best = Math.max(0, ...vals.map(v => (v.hits ? v.hits.length : 0)));
  const linkOk = kIdx.some(i => KBC_LINK_RE.test(sents[i]));
  const resOk = kIdx.some(i => KBC_RES_RE.test(sents[i] + ' ' + (sents[i - 1] || '')));
  const ratio = sents.length ? kIdx.length / sents.length : 0;
  const frameOk = kIdx.length > 0 && !(sents.length >= 4 && ratio > 0.4) && !(opt.judul && isK(opt.judul));

  const c = (label: string, pass: boolean | null, ok: string, no: string) => ({
    label,
    pass,
    note: pass === null ? no : pass ? ok : no
  });

  const bingkai = c(
    'Berfungsi sebagai bingkai nilai, bukan tema riset tersendiri',
    frameOk,
    'Insersi KBC proporsional dan menjadi bingkai nilai bagi topik riset.',
    kIdx.length === 0
      ? 'Belum ada kalimat insersi KBC pada bagian ini.'
      : `Porsi kalimat KBC terlalu dominan (${Math.round(ratio * 100)}% kalimat) atau judul memusatkan KBC. Pedoman menetapkan KBC sebagai landasan nilai, bukan tema tersendiri; ringkas menjadi satu hingga dua kalimat yang terhubung dengan topik.`
  );

  const makna = c(
    'Menjelaskan makna nilai sesuai Lampiran 7',
    best >= 2,
    `Makna nilai dijelaskan dengan kata kunci materi Lampiran 7 (mis. ${(
      vals.sort((a, b) => (b.hits?.length || 0) - (a.hits?.length || 0))[0]?.hits || []
    ).slice(0, 3).join(', ')}).`,
    'Jelaskan makna nilai dengan merujuk tujuan dan materi pada Lampiran 7 (minimal dua konsep kunci, bukan sekadar menyebut namanya).'
  );

  let crit;
  if (mode === 'latar') {
    crit = [
      c(
        'Menyebut Kurikulum Berbasis Cinta (KBC) secara eksplisit',
        hasExp(clean),
        'Istilah Kurikulum Berbasis Cinta/KBC disebut secara eksplisit.',
        'Sebut istilah "Kurikulum Berbasis Cinta (KBC)" secara eksplisit agar keterkaitan terbaca jelas.'
      ),
      c(
        'Menyebut nama nilai KBC (satu atau lebih dari lima nilai)',
        vals.length > 0,
        'Nilai yang disebut: ' + vals.map(v => v.n).join(', ') + '.',
        'Sebut minimal satu nama nilai: Cinta Allah SWT dan Rasul-Nya, Cinta Ilmu, Cinta Lingkungan, Cinta Diri dan Sesama Manusia, atau Cinta Tanah Air.'
      ),
      c(
        'Mengaitkan topik riset dengan nilai KBC',
        kIdx.length > 0 && linkOk,
        'Terdapat kalimat penghubung antara topik riset dan nilai KBC.',
        'Hubungkan topik dengan nilai memakai kalimat penghubung, misalnya "sejalan dengan", "wujud nyata dari", atau "mencerminkan" (lihat contoh Lampiran 5).'
      ),
      makna,
      bingkai
    ];
  } else {
    const lv = opt.latarVals;
    const shared = lv ? vals.filter(v => lv.includes(v.k)) : [];
    crit = [
      c(
        'Menyebut nama nilai KBC secara eksplisit',
        vals.length > 0,
        'Nilai yang disebut: ' + vals.map(v => v.n).join(', ') + '.',
        'Sebut nama nilai KBC yang relevan pada pembahasan (mis. "nilai Cinta Ilmu sebagaimana ditegaskan dalam KBC").'
      ),
      c(
        'Mengaitkan nilai KBC dengan hasil/temuan riset',
        kIdx.length > 0 && resOk && linkOk,
        'Nilai KBC dikaitkan langsung dengan hasil atau temuan riset.',
        'Kaitkan nilai dengan hasil riset secara konkret, misalnya "Peningkatan ini menegaskan bahwa ... merupakan wujud nyata dari nilai ..." (lihat Lampiran 5).'
      ),
      makna,
      c(
        'Konsisten dengan nilai pada Latar Belakang',
        lv && lv.length && vals.length ? shared.length > 0 : null,
        'Nilai pada Pembahasan selaras dengan Latar Belakang (' + shared.map(v => v.n).join(', ') + ').',
        lv && lv.length
          ? 'Nilai pada Pembahasan berbeda dari Latar Belakang. Pastikan nilai yang dibingkai di awal dibahas kembali pada akhir.'
          : 'Tidak dinilai: nilai pada Latar Belakang belum tersedia untuk dibandingkan.'
      ),
      bingkai
    ];
  }

  const evald = crit.filter(x => x.pass !== null);
  const score = evald.filter(x => x.pass).length;
  const total = evald.length;
  const none = kIdx.length === 0;
  const pct = total ? score / total : 0;

  let status: KbcAssessmentResult['status'] = 'Perlu Diperbaiki';
  if (none) status = 'Belum Ada Insersi KBC';
  else if (pct >= 1) status = 'Sangat Baik';
  else if (pct >= 0.75) status = 'Baik';
  else if (pct >= 0.5) status = 'Cukup';

  return {
    mode,
    vals,
    kSents: kIdx.map(i => sents[i]),
    crit,
    score,
    total,
    status
  };
}

export function kbcTemplate(v: KbcValueItem, mode: 'latar' | 'pembahasan'): string {
  return mode === 'latar'
    ? `Upaya [topik riset] ini sejalan dengan nilai ${v.n} dalam Kurikulum Berbasis Cinta (KBC), yaitu ${v.d} (lihat Lampiran 7).`
    : `Temuan ini menegaskan bahwa [hasil riset] merupakan wujud nyata dari nilai ${v.n} sebagaimana ditegaskan dalam KBC: ${v.d} (lihat Lampiran 7).`;
}

export function downloadTextFile(filename: string, content: string): void {
  // Menambahkan UTF-8 BOM (\uFEFF) agar berkas teks terbuka rapi di Windows Notepad & MS Word
  const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
