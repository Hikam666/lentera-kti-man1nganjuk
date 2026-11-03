import React, { useState } from 'react';
import {
  Heart,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import {
  KBC_VALUES,
  KBC_SAMPLE_LATAR,
  KBC_SAMPLE_PEMB,
  kbcTemaKeys
} from '../../data/rules';
import {
  assessKbc,
  kbcTemplate,
  downloadTextFile,
  countWords
} from '../../utils/textAnalysis';
import { Badge } from '../../components/Badge';

export const KbcView: React.FC = () => {
  const [mode, setMode] = useState<'proposal' | 'paper'>('proposal');
  const [tema, setTema] = useState('');
  const [judul, setJudul] = useState('');
  const [latar, setLatar] = useState('');
  const [pemb, setPemb] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Results
  const [latarResult, setLatarResult] = useState<any>(null);
  const [pembResult, setPembResult] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showReference, setShowReference] = useState(false);

  const handleReview = () => {
    if (!latar.trim() && !(mode === 'paper' && pemb.trim())) return;

    const aL = latar.trim() ? assessKbc(latar, 'latar', { judul }) : null;
    const aP =
      mode === 'paper' && pemb.trim()
        ? assessKbc(pemb, 'pembahasan', {
            judul,
            latarVals: aL ? aL.vals.map((v: any) => v.k) : null
          })
        : null;

    setLatarResult(aL);
    setPembResult(aP);
    setHasReviewed(true);
  };

  const handleLoadSample = () => {
    setLatar(KBC_SAMPLE_LATAR);
    setPemb(KBC_SAMPLE_PEMB);
    setTema('Transformasi Digital untuk Pembangunan Nasional');
    setJudul('Pengembangan Media Game Edukasi Berbasis Cerita Rakyat Nganjuk');
  };

  const handleClear = () => {
    setLatar('');
    setPemb('');
    setTema('');
    setJudul('');
    setHasReviewed(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownload = () => {
    const tanggal = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    const blk = (t: string, a: any) =>
      !a
        ? ''
        : `${t}: ${a.status} (${a.score}/${a.total} kriteria)\nNilai terdeteksi: ${
            a.vals.map((v: any) => v.n).join(', ') || '-'
          }\n${a.crit
            .map(
              (x: any) =>
                `[${x.pass === null ? '-' : x.pass ? 'V' : 'X'}] ${x.label}\n    ${x.note}`
            )
            .join('\n')}\n\n`;

    const out = `LENTERA KTI — HASIL REVIEW INSERSI KBC
MAN 1 Nganjuk — Pemilik: Mustagfiroh
Jenis naskah: ${mode === 'paper' ? 'Paper (Karya Tulis)' : 'Proposal Riset'}
Tema: ${tema || '-'}
Judul: ${judul || '-'}
Diunduh: ${tanggal}

======================================
REVIEW INSERSI NILAI KBC (Lampiran 5 & 7)
======================================
${blk('Latar Belakang Masalah', latarResult) + blk('Pembahasan (BAB IV)', pembResult)}
--
Dihasilkan otomatis oleh aplikasi Lentera KTI sebagai telaah awal sesuai Lampiran 5 dan 7 Pedoman KTI MAN 1 Nganjuk. Keputusan akhir tetap berada pada guru pembimbing.`;

    downloadTextFile('hasil-review-kbc-kti-man1nganjuk.txt', out);
  };

  const renderAssessmentBlock = (a: any, title: string, targetMode: 'latar' | 'pembahasan') => {
    if (!a) return null;
    const rec = kbcTemaKeys(tema);
    const tv = a.vals.length ? a.vals : KBC_VALUES.filter((v) => !rec || rec.includes(v.k));

    return (
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink">{title}</h3>
            <Badge status={a.status} />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-ink-soft">
            {a.score}/{a.total} kriteria terpenuhi
          </span>
        </div>

        {/* Chips for detected values */}
        <div className="flex flex-wrap gap-2">
          {a.vals.length > 0 ? (
            a.vals.map((v: any) => (
              <span
                key={v.k}
                className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-medium"
              >
                {v.n}: <strong>{v.hits?.length || 0} konsep materi</strong>
              </span>
            ))
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 italic">
              Belum ada nilai KBC yang disebut
            </span>
          )}
        </div>

        {/* Criteria Checklist */}
        <ul className="space-y-2">
          {a.crit.map((x: any, idx: number) => {
            const isPass = x.pass;
            return (
              <li
                key={idx}
                className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                  isPass === null
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : isPass
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${
                    isPass === null ? 'bg-slate-400' : isPass ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {isPass === null ? '–' : isPass ? '✓' : '✕'}
                </span>
                <div>
                  <strong className="block font-semibold">{x.label}</strong>
                  <p className="mt-0.5 text-xs opacity-90 leading-relaxed">{x.note}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Detected sentences */}
        {a.kSents && a.kSents.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-ink block mb-1.5">
              Kalimat insersi yang terdeteksi:
            </span>
            <ul className="space-y-1.5 text-xs text-teal-950">
              {a.kSents.slice(0, 4).map((s: string, i: number) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-teal-50/60 border-l-4 border-teal-600 border-y border-r border-teal-100 leading-relaxed italic"
                >
                  "{s}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Templates to copy */}
        <div className="pt-2">
          <details className="rounded-xl border border-slate-200 bg-white p-3.5 transition-all text-xs">
            <summary className="font-bold text-brand-700 cursor-pointer select-none">
              Contoh kalimat insersi (sesuaikan dengan topikmu)
            </summary>
            <div className="space-y-2 mt-3 divide-y divide-slate-100">
              {tv.map((v: any, i: number) => {
                const tpl = kbcTemplate(v, targetMode);
                const id = `${targetMode}-${v.k}`;
                const isCopied = copiedId === id;
                return (
                  <div key={i} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
                    <p className="text-xs text-ink/85 leading-relaxed">{tpl}</p>
                    <button
                      onClick={() => handleCopy(tpl, id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Tersalin ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
          <span>Review Insersi Kurikulum Berbasis Cinta (KBC)</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft mt-1">
          Menilai integrasi nilai Kurikulum Berbasis Cinta pada Latar Belakang proposal serta Latar Belakang dan Pembahasan paper (Lampiran 5 dan 7 Pedoman KTI).
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-5">
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-3xl">
          KBC bukan tema riset tersendiri, melainkan bingkai nilai luhur yang disisipkan pada Latar Belakang Masalah dan Pembahasan (BAB IV). Periksa apakah nilai KBC disebut eksplisit, dikaitkan dengan topik atau hasil riset, dan dijelaskan maknanya.
        </p>

        {/* 5 Tag Values */}
        <div className="flex flex-wrap gap-2">
          {KBC_VALUES.map((v) => (
            <span
              key={v.k}
              className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-900"
            >
              {v.n}
            </span>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('proposal')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'proposal'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Proposal Riset
          </button>
          <button
            type="button"
            onClick={() => setMode('paper')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'paper'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Paper (Karya Tulis BAB I &amp; IV)
          </button>
        </div>

        {/* Optional Metadata: Tema & Judul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Tema Riset (Opsional)
            </label>
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">— Belum Dipilih —</option>
              <option>Integrasi Keislaman dan Keilmuan (Ekoteologi)</option>
              <option>Sustainable Development Goals (SDGs)</option>
              <option>Transformasi Digital untuk Pembangunan Nasional</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Judul Riset (Opsional)
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Efektivitas Media Game Edukasi..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Textareas */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-ink">
                {mode === 'paper'
                  ? 'Latar Belakang Masalah (BAB I Pendahuluan)'
                  : 'Latar Belakang Masalah (Proposal)'}
              </label>
              <span className="text-[11px] text-ink-soft">
                {countWords(latar)} kata
              </span>
            </div>
            <textarea
              value={latar}
              onChange={(e) => setLatar(e.target.value)}
              placeholder="Tempelkan paragraf Latar Belakang di sini..."
              rows={6}
              className="w-full p-4 text-xs sm:text-sm text-ink bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans transition-all resize-y leading-relaxed"
            />
          </div>

          {mode === 'paper' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-ink">
                  Pembahasan (BAB IV)
                </label>
                <span className="text-[11px] text-ink-soft">
                  {countWords(pemb)} kata
                </span>
              </div>
              <textarea
                value={pemb}
                onChange={(e) => setPemb(e.target.value)}
                placeholder="Tempelkan bagian Pembahasan (BAB IV) di sini..."
                rows={6}
                className="w-full p-4 text-xs sm:text-sm text-ink bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans transition-all resize-y leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleReview}
            disabled={!latar.trim() && !(mode === 'paper' && pemb.trim())}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Review Insersi KBC</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Muat Contoh Paragraf KBC</span>
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-ink-soft hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Bersihkan</span>
          </button>
        </div>

        {/* Reference Accordion */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowReference(!showReference)}
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs sm:text-sm font-bold text-ink hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-600" />
              <span>Panduan &amp; Referensi Lima Nilai Pokok KBC (Lampiran 7 Pedoman)</span>
            </span>
            {showReference ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showReference && (
            <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-white space-y-4 text-xs">
              {KBC_VALUES.map((v) => (
                <div key={v.k} className="pb-3 border-b border-slate-100 last:border-b-0 space-y-1">
                  <strong className="font-bold text-ink text-sm block">
                    {v.n}
                  </strong>
                  <p className="text-ink-soft leading-relaxed">
                    <strong>Tujuan Pembelajaran:</strong> {v.d}.
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    <strong>Kata Kunci Materi:</strong> {v.ind.join(', ')}.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Results */}
        {hasReviewed && (
          <div className="mt-8 pt-8 border-t border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-ink">Hasil Review Insersi Nilai KBC</h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Penilaian mengacu Lampiran 5 (contoh insersi) dan Lampiran 7 (materi pokok KBC).
              </p>
            </div>

            {renderAssessmentBlock(latarResult, 'Latar Belakang Masalah', 'latar')}
            {mode === 'paper' && renderAssessmentBlock(pembResult, 'Pembahasan (BAB IV)', 'pembahasan')}

            {/* Download Button */}
            <div className="pt-2">
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Hasil Review KBC (.txt)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
