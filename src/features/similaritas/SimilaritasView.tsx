import React, { useState } from 'react';
import {
  Search,
  Download,
  RotateCcw,
  Layers,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { SIM_SAMPLE_A, SIM_SAMPLE_B } from '../../data/rules';
import {
  countWords,
  computeSimilarity,
  downloadTextFile,
  escapeHtml
} from '../../utils/textAnalysis';
import { Badge } from '../../components/Badge';

export const SimilaritasView: React.FC = () => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [hasChecked, setHasChecked] = useState(false);

  // Result state
  const [percent, setPercent] = useState(0);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [status, setStatus] = useState<'Baik' | 'Cukup' | 'Perlu Diperbaiki'>('Baik');
  const [verdictNote, setVerdictNote] = useState('');
  const [tokACount, setTokACount] = useState(0);
  const [tokBCount, setTokBCount] = useState(0);

  // Candidates for Google search
  const [candidates, setCandidates] = useState<string[]>([]);

  const handleCheck = () => {
    if (!textA.trim() || !textB.trim()) return;

    const res = computeSimilarity(textA, textB, 5);
    setPercent(res.percent);
    setRenderedHtml(res.html);
    setTokACount(res.tokACount);
    setTokBCount(res.tokBCount);

    let s: 'Baik' | 'Cukup' | 'Perlu Diperbaiki' = 'Baik';
    let note = '';

    if (res.tooShort) {
      s = 'Cukup';
      note = 'Salah satu naskah terlalu pendek (kurang dari 5 kata) untuk dibandingkan secara bermakna. Tambahkan teks yang lebih panjang.';
    } else if (res.percent <= 15) {
      s = 'Baik';
      note = 'Tingkat kemiripan rendah dan berada jauh di bawah batas toleransi similaritas pedoman (maksimal 30%).';
    } else if (res.percent <= 30) {
      s = 'Cukup';
      note = 'Tingkat kemiripan masih berada dalam batas toleransi pedoman (maksimal 30%), namun perlu diwaspadai. Periksa apakah bagian yang disorot sudah dikutip dan disitasi dengan benar.';
    } else {
      s = 'Perlu Diperbaiki';
      note = 'Tingkat kemiripan melebihi batas toleransi similaritas pedoman (maksimal 30%). Tulis ulang bagian yang disorot dengan kalimat sendiri (parafrasa) atau lengkapi dengan sitasi yang tepat sesuai gaya APA Edisi Ke-7.';
    }

    setStatus(s);
    setVerdictNote(note);
    setHasChecked(true);
  };

  const handleFindCandidates = () => {
    if (!textA.trim()) return;

    const sentences = textA
      .split(/[.!?\n]+/)
      .map((s) => s.trim())
      .filter((s) => countWords(s) >= 8);

    const unique = Array.from(new Set(sentences));
    const sorted = unique.sort((a, b) => countWords(b) - countWords(a)).slice(0, 5);
    setCandidates(sorted);
  };

  const handleLoadSample = () => {
    setTextA(SIM_SAMPLE_A);
    setTextB(SIM_SAMPLE_B);
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    setCandidates([]);
    setHasChecked(false);
  };

  const handleDownload = () => {
    const tanggal = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    const cleanRendered = renderedHtml
      .replace(/<mark class="[^"]*">/g, '[MIRIP] ')
      .replace(/<\/mark>/g, ' [/MIRIP]')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    const out = `LENTERA KTI — HASIL CEK SIMILARITAS
MAN 1 Nganjuk — Pemilik: Mustagfiroh
Diunduh: ${tanggal}

Catatan metode: Perbandingan dilakukan secara lokal di perangkat ini menggunakan metode shingle 5-kata terhadap Naskah B yang ditempel.

======================================
HASIL
======================================
Tingkat kemiripan Naskah A terhadap Naskah B: ${percent.toFixed(1)}%
Status: ${status} (batas toleransi pedoman: maksimal 30%)
${verdictNote}

Jumlah kata Naskah A: ${tokACount}
Jumlah kata Naskah B: ${tokBCount}

======================================
NASKAH A (bagian mirip ditandai [MIRIP]...[/MIRIP])
======================================
${cleanRendered}

======================================
NASKAH B (sumber pembanding)
======================================
${textB}

--
Dihasilkan otomatis oleh aplikasi Lentera KTI sebagai alat bantu pemeriksaan similaritas, bukan pengganti aplikasi pengecekan plagiarisme resmi madrasah. Hasil ini bersifat pendukung; keputusan akhir tetap berada pada guru pembimbing.`;

    downloadTextFile('hasil-cek-similaritas-kti-man1nganjuk.txt', out);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-brand-600" />
          <span>Cek Similaritas Naskah</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft mt-1">
          Bandingkan Naskah A (Draf Murid) dengan Naskah B (Sumber Pembanding) sesuai batas toleransi Pedoman KTI MAN 1 Nganjuk (maksimal 30%).
        </p>
      </div>

      {/* Main Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-6">
        {/* Info notice */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 leading-relaxed flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Panduan Pemeriksaan Mandiri:</strong> Tempelkan draf murid pada <strong>Naskah A</strong>. Jika ingin melacak sumber di internet, gunakan tombol <em>"Cari Kalimat Kunci di Google"</em> di bawah untuk membuka pencarian Google per kalimat secara otomatis, lalu salin teks dari situs rujukan ke kolom <strong>Naskah B</strong>.
          </div>
        </div>

        {/* Dual Textareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Naskah A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-ink">
                Naskah A — Draf yang Diperiksa
              </label>
              <span className="text-[11px] text-ink-soft">
                {countWords(textA)} kata
              </span>
            </div>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Tempelkan naskah karya ilmiah murid di sini..."
              rows={8}
              className="w-full p-4 text-xs sm:text-sm text-ink bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans transition-all resize-y leading-relaxed"
            />
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFindCandidates}
                disabled={!textA.trim()}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-ink-soft hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Kalimat Kunci di Google</span>
              </button>
            </div>
          </div>

          {/* Naskah B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-ink">
                Naskah B — Sumber Pembanding / Rujukan
              </label>
              <span className="text-[11px] text-ink-soft">
                {countWords(textB)} kata
              </span>
            </div>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Tempelkan sumber pembanding (artikel rujukan, website, buku, atau naskah lain) di sini..."
              rows={8}
              className="w-full p-4 text-xs sm:text-sm text-ink bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans transition-all resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Google candidates result */}
        {candidates.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-ink block">
              Kalimat Kunci Khas dari Naskah A (Klik untuk Mencari Sumber di Google):
            </span>
            <ul className="space-y-2 text-xs">
              {candidates.map((s, idx) => {
                const phrase = s.split(/\s+/).slice(0, 14).join(' ');
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`"${phrase}"`)}`;
                return (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <span className="text-ink-soft truncate font-serif italic">
                      "{phrase}{phrase.length < s.length ? '…' : ''}"
                    </span>
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold whitespace-nowrap flex items-center gap-1"
                    >
                      <span>Cari di Google</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCheck}
            disabled={!textA.trim() || !textB.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cek Similaritas</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Muat Contoh Perbandingan</span>
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
        {hasChecked && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
            {/* Score band */}
            <div className="p-5 rounded-2xl bg-brand-50 border border-brand-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl font-black text-brand-700 leading-none">
                  {percent.toFixed(1)}%
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm font-bold text-brand-900">
                    Tingkat Kemiripan Naskah A terhadap Naskah B
                  </strong>
                  <span className="text-xs text-brand-700/80">
                    Metode shingle 5-kata · Batas toleransi pedoman maksimal 30%
                  </span>
                </div>
              </div>
              <Badge status={status} />
            </div>

            {/* Verdict note */}
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                status === 'Baik'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : status === 'Cukup'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <strong>Status Penilaian:</strong> {verdictNote}
            </div>

            {/* Visual highlighted comparison */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-ink">
                  Tinjauan Naskah A (Bagian Mirip Ditandai Merah)
                </h3>
                <span className="text-xs text-ink-soft flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-200 border border-rose-400" />
                  <span>Bagian yang cocok dengan Naskah B</span>
                </span>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto font-sans"
              />
            </div>

            {/* Download Button */}
            <div className="pt-2">
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Hasil Cek Similaritas (.txt)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
