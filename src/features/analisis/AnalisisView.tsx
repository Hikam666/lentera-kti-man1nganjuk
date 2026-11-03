import React, { useState } from 'react';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Quote,
  Layers,
  Heart
} from 'lucide-react';
import {
  STRUCTURE,
  SAMPLE_PAPER,
  APA_PAREN_RE,
  APA_NARR_RE,
  KBC_VALUES
} from '../../data/rules';
import {
  countWords,
  assessBahasa,
  keywordOverlap,
  assessKbc,
  downloadTextFile,
  escapeHtml
} from '../../utils/textAnalysis';
import { ReviewCard } from '../../components/ReviewCard';
import { Badge } from '../../components/Badge';

export const AnalisisView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [lastReport, setLastReport] = useState<string | null>(null);

  // Analysis result states
  const [foundCount, setFoundCount] = useState(0);
  const [checklistItems, setChecklistItems] = useState<
    { label: string; found: boolean; wordCount: number; limit: number | null; over: boolean }[]
  >([]);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [marginNote, setMarginNote] = useState('');
  const [citNote, setCitNote] = useState('');
  const [citCount, setCitCount] = useState(0);

  // Review card states
  const [reviewData, setReviewData] = useState<{
    strengths: string[];
    revisi: string[];
    keselarasanStatus: string;
    keselarasanNote: string;
    bahasaStatus: string;
    bahasaItems: any[];
    metrics: { label: string; val: string | number }[];
  } | null>(null);

  // KBC card states
  const [kbcLatarResult, setKbcLatarResult] = useState<any>(null);
  const [kbcPembResult, setKbcPembResult] = useState<any>(null);

  const handleAnalyze = () => {
    const raw = inputText.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();

    // 1. Locate positions of each structure section
    const located = STRUCTURE.map((s) => {
      let pos = -1;
      s.kw.forEach((k) => {
        const i = lower.indexOf(k);
        if (i !== -1 && (pos === -1 || i < pos)) pos = i;
      });
      return { ...s, pos };
    });

    const found = located.filter((s) => s.pos !== -1).sort((a, b) => a.pos - b.pos);
    setFoundCount(found.length);

    // 2. Segment text per section and compute word counts
    const segments: Record<string, string> = {};
    const overLimitList: { label: string; wc: number; limit: number }[] = [];

    const items = STRUCTURE.map((s) => {
      const match = found.find((f) => f.key === s.key);
      let wc = 0;
      let over = false;

      if (match) {
        const idx = found.indexOf(match);
        const nextPos = idx + 1 < found.length ? found[idx + 1].pos : raw.length;
        const segment = raw.substring(match.pos, nextPos);
        segments[s.key] = segment;
        wc = countWords(segment);
        if (s.limit) {
          over = wc > s.limit;
          if (over) overLimitList.push({ label: s.label, wc, limit: s.limit });
        }
      }

      return {
        label: s.label,
        found: !!match,
        wordCount: wc,
        limit: s.limit,
        over
      };
    });
    setChecklistItems(items);

    // 3. Highlight keywords and APA citations in rendered HTML
    let html = escapeHtml(raw);
    STRUCTURE.forEach((s) => {
      s.kw.forEach((k) => {
        const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
        if (!esc) return;
        const re = new RegExp(`(${esc})`, 'gi');
        html = html.replace(re, '<mark class="bg-amber-100 text-amber-900 px-1 rounded font-bold">$1</mark>');
      });
    });

    html = html.replace(
      APA_PAREN_RE,
      (m) => `<mark class="bg-teal-50 border-b-2 border-teal-600 border-dashed text-teal-800 font-medium px-0.5">${m}</mark>`
    );
    html = html.replace(
      APA_NARR_RE,
      (m) => `<mark class="bg-teal-50 border-b-2 border-teal-600 border-dashed text-teal-800 font-medium px-0.5">${m}</mark>`
    );
    setRenderedHtml(html);

    // 4. Missing parts and word count notices
    const missing = STRUCTURE.filter((s) => !found.find((f) => f.key === s.key)).map((s) => s.label);
    let noteTxt = '';
    if (missing.length) noteTxt += `Bagian belum ditemukan: ${missing.join(', ')}. `;
    if (overLimitList.length) {
      noteTxt += `Melebihi batas kata: ${overLimitList
        .map((o) => `${o.label} (${o.wc} kata, batas ${o.limit})`)
        .join('; ')}.`;
    }
    setMarginNote(noteTxt || 'Struktur lengkap dan seluruh bagian berada dalam batas kata.');

    // 5. APA Citation count
    const apaCount = (raw.match(APA_PAREN_RE) || []).length + (raw.match(APA_NARR_RE) || []).length;
    setCitCount(apaCount);
    setCitNote(
      apaCount > 0
        ? `${apaCount} sitasi bergaya APA Edisi Ke-7 terdeteksi. Periksa kembali kesesuaian setiap sitasi dengan entri Daftar Pustaka (prinsip korespondensi).`
        : 'Belum ada sitasi bergaya APA (Nama, Tahun) yang terdeteksi. Setiap gagasan atau data dari sumber lain wajib disitasi sesuai Bab V pedoman.'
    );

    // 6. Language assessment (EYD V, Pleonasme, Ragam Ilmiah)
    const bahasaResult = assessBahasa(raw);

    // 7. Keselarasan Rumusan Masalah BAB I vs Pembahasan BAB IV / BAB V
    let rumusanText = '';
    if (segments['bab1']) {
      const m = segments['bab1'].match(/rumusan masalah[^?]*\?/i);
      if (m) rumusanText = m[0];
    }
    const pembahasanGabungan = (segments['bab4'] || '') + ' ' + (segments['bab5'] || '');
    const overlapWords = rumusanText ? keywordOverlap(rumusanText, pembahasanGabungan, 5) : [];

    let keselarasanStatus = 'Cukup';
    let keselarasanNote = '';
    if (!rumusanText) {
      keselarasanStatus = 'Cukup';
      keselarasanNote =
        'Kalimat rumusan masalah tidak dapat diidentifikasi secara otomatis (pastikan ditulis eksplisit sebagai kalimat tanya pada BAB I), sehingga keterkaitannya dengan pembahasan belum dapat dinilai.';
    } else if (overlapWords.length >= 2) {
      keselarasanStatus = 'Baik';
      keselarasanNote = `Bagian pembahasan dan/atau simpulan memuat kata kunci yang sama dengan rumusan masalah (${overlapWords
        .slice(0, 5)
        .join(', ')}), menandakan pembahasan cenderung menjawab rumusan masalah yang diajukan.`;
    } else if (overlapWords.length === 1) {
      keselarasanStatus = 'Cukup';
      keselarasanNote = `Hanya ditemukan sedikit kesamaan kata kunci ("${overlapWords[0]}") antara rumusan masalah dan pembahasan/simpulan. Perkuat keterkaitan keduanya agar pembahasan lebih jelas menjawab rumusan masalah.`;
    } else {
      keselarasanStatus = 'Perlu Diperbaiki';
      keselarasanNote =
        'Tidak ditemukan kata kunci yang sama antara rumusan masalah dan bagian pembahasan/simpulan. Periksa kembali apakah pembahasan benar-benar menjawab rumusan masalah yang diajukan pada BAB I.';
    }

    // Strengths
    const strengths: string[] = [];
    if (missing.length === 0)
      strengths.push('Seluruh 7 bagian sistematika (Abstrak s.d. Daftar Pustaka) sudah lengkap dan berurutan.');
    if (overLimitList.length === 0 && found.length > 0)
      strengths.push('Seluruh bagian yang ditemukan berada dalam batas kata sesuai pedoman.');
    if (apaCount > 0)
      strengths.push(`${apaCount} sitasi bergaya APA Edisi Ke-7 terdeteksi dalam naskah.`);
    if (bahasaResult.items.every((it) => it.pass))
      strengths.push('Penggunaan bahasa sudah memenuhi tiga kriteria efektivitas: jelas/objektif, kalimat efektif, dan ejaan sesuai EYD.');
    if (strengths.length === 0)
      strengths.push('Naskah sudah menunjukkan kerangka dasar karya tulis ilmiah; beberapa penguatan masih diperlukan (lihat saran revisi).');

    // Revisi
    const revisi: string[] = [];
    missing.forEach((label) => revisi.push(`Tambahkan bagian "${label}" karena belum ditemukan dalam naskah.`));
    overLimitList.forEach((o) =>
      revisi.push(`Ringkas bagian "${o.label}", saat ini ${o.wc} kata melebihi batas ${o.limit} kata.`)
    );
    if (apaCount === 0)
      revisi.push('Tambahkan sitasi APA Edisi Ke-7, misalnya (Nama, Tahun), untuk setiap gagasan atau data yang dikutip dari sumber lain.');
    if (keselarasanStatus !== 'Baik')
      revisi.push('Periksa kembali keselarasan rumusan masalah dengan pembahasan dan simpulan agar benar-benar saling menjawab.');
    bahasaResult.items.filter((it) => !it.pass).forEach((it) => revisi.push(it.note));

    // KBC analysis for Bab I and Bab IV
    const kL = segments['bab1'] ? assessKbc(segments['bab1'], 'latar') : null;
    const kP = segments['bab4']
      ? assessKbc(segments['bab4'], 'pembahasan', { latarVals: kL ? kL.vals.map((v) => v.k) : null })
      : null;

    if (kL && kL.score === kL.total) strengths.push('Insersi nilai KBC pada Latar Belakang (BAB I) memenuhi seluruh kriteria Lampiran 5.');
    if (kL) kL.crit.filter((c) => c.pass === false).forEach((c) => revisi.push(`Insersi KBC, BAB I: ${c.note}`));

    if (kP && kP.score === kP.total) strengths.push('Insersi nilai KBC pada Pembahasan (BAB IV) memenuhi seluruh kriteria Lampiran 5.');
    if (kP) kP.crit.filter((c) => c.pass === false).forEach((c) => revisi.push(`Insersi KBC, BAB IV: ${c.note}`));

    if (!kL && !kP) revisi.push('Insersi KBC belum dapat ditelaah karena BAB I dan BAB IV tidak ditemukan.');

    if (revisi.length === 0)
      revisi.push('Tidak ada revisi mendesak pada aspek struktur dan kebahasaan; naskah dapat dilanjutkan ke tahap bimbingan substansi oleh pembimbing.');

    setReviewData({
      strengths,
      revisi,
      keselarasanStatus,
      keselarasanNote,
      bahasaStatus: bahasaResult.status,
      bahasaItems: bahasaResult.items,
      metrics: [
        { label: 'Sitasi APA', val: apaCount },
        { label: 'Rata-rata kata/kalimat', val: bahasaResult.avgLen ? bahasaResult.avgLen.toFixed(0) : '-' }
      ]
    });

    setKbcLatarResult(kL);
    setKbcPembResult(kP);

    // Build TXT Report
    const tanggal = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    const checklistLines = items.map((it) => {
      const statusMark = it.found ? '[ V ]' : '[ X ]';
      const countStr = it.found ? `${it.wordCount}${it.limit ? ` / ${it.limit} kata` : ' kata'}` : 'tidak ditemukan';
      return `${statusMark} ${it.label} - ${countStr}`;
    });

    const report = `LENTERA KTI — HASIL ANALISIS TEKS
MAN 1 Nganjuk — Pemilik: Mustagfiroh
Diunduh: ${tanggal}

======================================
RINGKASAN STRUKTUR (${found.length}/${STRUCTURE.length} bagian ditemukan)
======================================
${checklistLines.join('\n')}

Catatan struktur: ${noteTxt || 'Struktur lengkap dan seluruh bagian berada dalam batas kata.'}
Catatan sitasi: ${apaCount > 0 ? `${apaCount} sitasi APA terdeteksi.` : 'Belum ada sitasi APA terdeteksi.'}

======================================
HASIL TELAAH NASKAH PAPER
======================================

A. KEKUATAN
${strengths.map((s) => '- ' + s).join('\n')}

B. SARAN PERBAIKAN / REVISI
${revisi.map((s) => '- ' + s).join('\n')}

C. KESESUAIAN ANTARBAGIAN: ${keselarasanStatus}
${keselarasanNote}

D. EFEKTIVITAS PENGGUNAAN BAHASA: ${bahasaResult.status}
${bahasaResult.items
  .map((it, i) => `${i + 1}. ${it.label} [${it.pass ? 'V' : 'X'}]\n   ${it.note}`)
  .join('\n')}

Metrik: Sitasi APA = ${apaCount} | Rata-rata kata/kalimat = ${
      bahasaResult.avgLen ? bahasaResult.avgLen.toFixed(0) : '-'
    }

======================================
TEKS YANG DIANALISIS
======================================
${raw}

--
Dihasilkan otomatis oleh aplikasi Lentera KTI sebagai alat bantu telaah awal sesuai Pedoman Penulisan KTI (Paper) MAN 1 Nganjuk TA 2026/2027. Hasil ini bersifat pendukung; keputusan akhir tetap berada pada guru pembimbing.`;

    setLastReport(report);
    setHasAnalyzed(true);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_PAPER);
  };

  const handleClear = () => {
    setInputText('');
    setHasAnalyzed(false);
    setLastReport(null);
  };

  const handleDownload = () => {
    if (!lastReport) return;
    downloadTextFile('hasil-analisis-teks-kti-man1nganjuk.txt', lastReport);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-600" />
          <span>Analisis Teks Paper</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft mt-1">
          Pemeriksaan sistematika, batas kata per bab, sitasi APA Edisi Ke-7, dan kaidah kebahasaan draf karya ilmiah.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-5">
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-3xl">
          Tempelkan draf paper lengkap Anda (Abstrak, BAB I hingga BAB V, dan Daftar Pustaka). Aplikasi akan memeriksa kelengkapan struktur, menghitung batas kata per bab, serta mendeteksi sitasi APA secara otomatis.
        </p>

        {/* Tag row */}
        <div className="flex flex-wrap gap-2">
          {STRUCTURE.filter((s) => s.limit).map((s, i) => (
            <span
              key={i}
              className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-bg border border-surface-border text-ink-soft"
            >
              {s.label.split(' ')[0]} ≤{s.limit} kata
            </span>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tempelkan draf paper lengkap di sini (Abstrak s.d. Daftar Pustaka)..."
            rows={12}
            className="w-full p-4 text-xs sm:text-sm text-ink bg-surface-bg border border-surface-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans transition-all resize-y leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 text-[11px] text-ink-soft bg-white/90 px-2 py-0.5 rounded border border-slate-200">
            {countWords(inputText)} kata
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analisis Teks</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Muat Contoh Paper</span>
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-ink-soft hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bersihkan</span>
          </button>
        </div>

        {/* Results Area */}
        {hasAnalyzed && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
            {/* Score band */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/80 border border-brand-100 flex items-center gap-4">
              <div className="text-3xl sm:text-4xl font-black text-brand-700 leading-none">
                {foundCount}/7
              </div>
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-brand-900">
                  Bagian Sistematika Ditemukan
                </strong>
                <p className="text-xs text-brand-700/80 mt-0.5">
                  Dari Abstrak sampai dengan Daftar Pustaka sesuai Pedoman KTI MAN 1 Nganjuk.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-ink mb-3">
                Daftar Periksa Kelengkapan &amp; Batas Kata per Bagian:
              </h3>
              <ul className="divide-y divide-dashed divide-slate-200 text-xs sm:text-sm">
                {checklistItems.map((item, idx) => (
                  <li key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                          item.found ? 'bg-emerald-600' : 'bg-rose-500'
                        }`}
                      >
                        {item.found ? '✓' : '✕'}
                      </span>
                      <span className={item.found ? 'text-ink font-medium' : 'text-slate-400'}>
                        {item.label}
                      </span>
                    </div>

                    <div className="text-right">
                      {item.found ? (
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            item.over
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-white text-ink-soft border border-slate-200'
                          }`}
                        >
                          {item.wordCount} {item.limit ? `/ ${item.limit} kata` : 'kata'}
                          {item.over && ' (Melebihi Batas)'}
                        </span>
                      ) : (
                        <span className="text-xs text-rose-500 font-medium">Belum ditemukan</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Margin and Citation Notes */}
            {marginNote && (
              <div className="p-4 rounded-xl bg-rose-50 border-l-4 border-rose-500 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{marginNote}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-teal-50 border-l-4 border-teal-600 text-teal-900 text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
              <Quote className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
              <span>{citNote}</span>
            </div>

            {/* Rendered Text Highlight */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-ink">
                  Tinjauan Visual Naskah (Penanda Bab &amp; Sitasi)
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                    <span>Penanda Bagian</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 border-b-2 border-teal-600 border-dashed" />
                    <span>Sitasi APA 7th</span>
                  </span>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto font-sans"
              />
            </div>

            {/* Review Card */}
            {reviewData && <ReviewCard title="Hasil Telaah Naskah Paper" subtitle="Telaah otomatis terhadap struktur, keselarasan antarbagian, dan efektivitas bahasa sesuai Pedoman KTI MAN 1 Nganjuk." {...reviewData} />}

            {/* KBC Review for Paper */}
            {(kbcLatarResult || kbcPembResult) && (
              <div className="pt-6 border-t border-slate-200">
                <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <span>Review Insersi Kurikulum Berbasis Cinta (KBC) pada Paper</span>
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft mt-1 mb-4">
                  Evaluasi insersi nilai KBC pada BAB I Pendahuluan dan BAB IV Hasil &amp; Pembahasan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BAB I */}
                  {kbcLatarResult ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-bold text-ink">
                          Latar Belakang (BAB I)
                        </strong>
                        <Badge status={kbcLatarResult.status} />
                      </div>
                      <p className="text-xs text-ink-soft">
                        Kriteria terpenuhi: <strong>{kbcLatarResult.score}/{kbcLatarResult.total}</strong>
                      </p>
                      <ul className="space-y-1.5 text-xs text-ink/80 pt-2 border-t border-slate-200">
                        {kbcLatarResult.crit.map((c: any, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className={c.pass ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                              {c.pass ? '✓' : '✕'}
                            </span>
                            <span>{c.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic">
                      BAB I tidak teridentifikasi untuk evaluasi KBC.
                    </div>
                  )}

                  {/* BAB IV */}
                  {kbcPembResult ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-bold text-ink">
                          Pembahasan (BAB IV)
                        </strong>
                        <Badge status={kbcPembResult.status} />
                      </div>
                      <p className="text-xs text-ink-soft">
                        Kriteria terpenuhi: <strong>{kbcPembResult.score}/{kbcPembResult.total}</strong>
                      </p>
                      <ul className="space-y-1.5 text-xs text-ink/80 pt-2 border-t border-slate-200">
                        {kbcPembResult.crit.map((c: any, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className={c.pass ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                              {c.pass ? '✓' : '✕'}
                            </span>
                            <span>{c.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic">
                      BAB IV tidak teridentifikasi untuk evaluasi KBC.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="pt-4">
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Hasil Analisis Teks (.txt)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
