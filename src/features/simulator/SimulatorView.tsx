import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PROPOSAL_STEPS, KBC_VALUES } from '../../data/rules';
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

const LOCAL_STORAGE_KEY = 'lentera_kti_proposal_answers_v1';

export const SimulatorView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showDraft, setShowDraft] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [kbcProposalResult, setKbcProposalResult] = useState<any>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage', e);
    }
  }, [answers]);

  const step = PROPOSAL_STEPS[currentStep];
  const currentValue = answers[step.key] || '';

  const isStepValid = (s: typeof PROPOSAL_STEPS[0]): boolean => {
    const val = (answers[s.key] || '').trim();
    if (!val) return false;
    return s.validate ? !s.validate(val, answers) : true;
  };

  const handleInputChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [step.key]: val
    }));
  };

  const handleNext = () => {
    if (currentStep < PROPOSAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerateDraft = () => {
    // 1. Evaluate steps completion
    const revisi: string[] = [];
    PROPOSAL_STEPS.forEach((s) => {
      const v = (answers[s.key] || '').trim();
      if (!v) {
        if (s.key !== 'hipotesis') revisi.push(`${s.title}: bagian ini belum diisi.`);
        return;
      }
      const msg = s.validate ? s.validate(v, answers) : null;
      if (msg) revisi.push(`${s.title}: ${msg}`);
    });

    const validSteps = PROPOSAL_STEPS.filter((s) => isStepValid(s));
    const strengths: string[] = [];
    strengths.push(`${validSteps.length} dari ${PROPOSAL_STEPS.length} bagian rencana riset sudah terisi dan memenuhi kriteria dasar pedoman.`);

    if (answers.tema) strengths.push(`Tema riset resmi sudah dipilih: "${answers.tema}".`);
    if (answers.judul && countWords(answers.judul) <= 15 && !answers.judul.includes('?')) {
      strengths.push('Judul riset sudah sesuai ketentuan (berbentuk frasa, maksimal 15 kata).');
    }

    const kajianTinjauanText = (answers.kajianteori || '') + ' ' + (answers.tinjauan || '');
    const citCount = (kajianTinjauanText.match(/\([A-Z][a-zA-ZÀ-ÿ\-]+.*?\d{4}.*?\)/g) || []).length;
    if (citCount >= 2) {
      strengths.push(`${citCount} sitasi APA terdeteksi pada Kajian Teori dan Tinjauan Pustaka.`);
    }

    if (revisi.length === 0) {
      revisi.push('Tidak ada revisi mendesak; rencana riset dapat diajukan untuk pemeriksaan dan pengesahan pembimbing.');
    }

    // 2. Coherence checks
    const rumusanTujuanOverlap = keywordOverlap(answers.rumusan || '', answers.tujuan || '', 5);
    const temaWords = (answers.tema || '')
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4 && !['tema', 'riset', 'dan', 'untuk', 'dalam'].includes(w));
    const judulLatarText = ((answers.judul || '') + ' ' + (answers.latar || '')).toLowerCase();
    const temaMatch = temaWords.some((w) => judulLatarText.includes(w));
    const latarTinjauanOverlap = keywordOverlap(answers.latar || '', answers.tinjauan || '', 5);

    const checks = [];
    if (answers.rumusan && answers.tujuan) {
      checks.push({ name: 'Rumusan Masalah ↔ Tujuan Riset', pass: rumusanTujuanOverlap.length >= 1 });
    }
    if (answers.tema && (answers.judul || answers.latar)) {
      checks.push({ name: 'Tema Riset ↔ Judul / Latar Belakang', pass: temaMatch });
    }
    if (answers.latar && answers.tinjauan) {
      checks.push({ name: 'Latar Belakang ↔ Tinjauan Pustaka', pass: latarTinjauanOverlap.length >= 1 });
    }

    const passCount = checks.filter((c) => c.pass).length;
    let keselarasanStatus = 'Cukup';
    if (checks.length === 0) keselarasanStatus = 'Cukup';
    else if (passCount === checks.length) keselarasanStatus = 'Baik';
    else if (passCount >= checks.length / 2) keselarasanStatus = 'Cukup';
    else keselarasanStatus = 'Perlu Diperbaiki';

    const keselarasanNote =
      checks.length === 0
        ? 'Lengkapi lebih banyak bagian rencana riset (rumusan masalah, tujuan, latar belakang, tinjauan pustaka) agar keselarasan antarunsur dapat dinilai.'
        : checks.map((c) => `${c.pass ? '✓' : '✕'} ${c.name}`).join('; ') + '.';

    // 3. Efektivitas Bahasa
    const fullProposalText = PROPOSAL_STEPS.map((s) => answers[s.key] || '').join(' ');
    const bahasaResult = assessBahasa(fullProposalText);

    if (keselarasanStatus !== 'Baik' && checks.length > 0) {
      revisi.push('Perkuat keterkaitan antarunsur yang belum selaras (lihat rincian pada bagian Kesesuaian Antarunsur).');
    }
    bahasaResult.items.filter((it) => !it.pass).forEach((it) => revisi.push(it.note));
    if (bahasaResult.items.every((it) => it.pass)) {
      strengths.push('Ragam bahasa proposal sudah memenuhi tiga kriteria efektivitas: jelas/objektif, kalimat efektif, dan ejaan sesuai EYD.');
    }

    // 4. KBC on Latar Belakang
    const kPr = assessKbc(answers.latar || '', 'latar', { judul: answers.judul });
    if (!(answers.latar || '').trim()) {
      revisi.push('Insersi KBC belum dapat ditelaah karena Latar Belakang belum diisi.');
    } else {
      if (kPr.score === kPr.total) {
        strengths.push('Insersi nilai KBC pada Latar Belakang memenuhi seluruh kriteria Lampiran 5.');
      }
      kPr.crit.filter((c) => c.pass === false).forEach((c) => revisi.push(`Insersi KBC, Latar Belakang: ${c.note}`));
    }

    setReviewData({
      strengths,
      revisi,
      keselarasanStatus,
      keselarasanNote,
      bahasaStatus: bahasaResult.status,
      bahasaItems: bahasaResult.items,
      metrics: [
        { label: 'Bagian terisi', val: `${validSteps.length}/${PROPOSAL_STEPS.length}` },
        { label: 'Sitasi APA (Kajian+Tinjauan)', val: citCount }
      ]
    });

    setKbcProposalResult((answers.latar || '').trim() ? kPr : null);
    setShowDraft(true);
  };

  const handleDownload = () => {
    let out = `LENTERA KTI — DRAF RENCANA RISET (PROPOSAL)
MAN 1 Nganjuk — Pedoman KTI TA 2026/2027
Diunduh: ${new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
======================================================\n\n`;

    PROPOSAL_STEPS.forEach((s, idx) => {
      out += `${idx + 1}. ${s.title.toUpperCase()}\n`;
      out += `${answers[s.key] || '(belum diisi)'}\n\n`;
    });

    out += `======================================================
Dihasilkan otomatis melalui Simulator Riset Lentera KTI MAN 1 Nganjuk.`;

    downloadTextFile('rencana-riset-kti-man1nganjuk.txt', out);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan semua isian proposal?')) {
      setAnswers({});
      setShowDraft(false);
      setCurrentStep(0);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Feedback calculation for current step
  const validationError = step.validate ? step.validate(currentValue, answers) : null;
  const kbcFeedback =
    step.key === 'latar' && currentValue.trim()
      ? assessKbc(currentValue, 'latar', { judul: answers.judul })
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-600" />
            <span>Simulator Rencana Riset (Proposal)</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Penyusunan rencana riset bertahap dalam 13 langkah sesuai Bab II Pedoman KTI MAN 1 Nganjuk.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-ink-soft hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Isian</span>
        </button>
      </div>

      {/* Main Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-xs space-y-6">
        {/* Step dots navigation */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-ink-soft">
            <span className="font-bold text-ink">
              Langkah {currentStep + 1} dari {PROPOSAL_STEPS.length}: {step.title}
            </span>
            <span className="text-emerald-700 font-semibold">
              {PROPOSAL_STEPS.filter((s) => isStepValid(s)).length} selesai
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PROPOSAL_STEPS.map((s, idx) => {
              const isCurrent = idx === currentStep;
              const isDone = isStepValid(s);
              return (
                <button
                  key={s.key}
                  onClick={() => setCurrentStep(idx)}
                  title={`${idx + 1}. ${s.title}`}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-sm scale-110'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isDone && !isCurrent ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {currentStep + 1}. {step.title}
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 leading-relaxed">
              {step.hint}
            </p>
            {step.limit && (
              <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                Batas maksimal {step.limit} kata.
              </span>
            )}
          </div>

          {/* Input field */}
          {step.type === 'select' ? (
            <div className="space-y-2 pt-2">
              {step.options?.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleInputChange(opt)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    currentValue === opt
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-100'
                      : 'bg-slate-50 border-slate-200 text-ink hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="relative pt-2">
              <textarea
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Tuliskan isi di sini..."
                rows={7}
                className="w-full p-4 text-xs sm:text-sm text-ink bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans transition-all resize-y leading-relaxed"
              />
              <div className="text-right text-[11px] text-ink-soft mt-1">
                {countWords(currentValue)} kata {step.limit ? `/ maks ${step.limit} kata` : ''}
              </div>
            </div>
          )}

          {/* Validation Feedback */}
          {currentValue.trim() && (
            <div className="space-y-2">
              {validationError ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Bagian ini sudah memenuhi kriteria dasar pedoman.</span>
                </div>
              )}

              {/* Special KBC feedback for Step 4 */}
              {kbcFeedback && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Insersi Nilai KBC pada Latar Belakang:</strong>{' '}
                    {kbcFeedback.vals.length > 0 ? (
                      <span>
                        Nilai <strong>{kbcFeedback.vals.map((v) => v.n).join(', ')}</strong> terdeteksi ({kbcFeedback.score}/{kbcFeedback.total} kriteria).
                      </span>
                    ) : (
                      <span>Belum ada nilai KBC yang terdeteksi. Buka menu Review KBC untuk contoh kalimat insersi.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-ink-soft hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < PROPOSAL_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Langkah Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerateDraft}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Lihat Draf Rencana Riset</span>
              </button>
            )}
          </div>
        </div>

        {/* Draf Preview Area */}
        {showDraft && (
          <div className="mt-8 pt-8 border-t-2 border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <span>Draf Rencana Riset (Proposal)</span>
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                  Pratinjau lengkap naskah proposal 13 langkah siap unduh.
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh sebagai .txt</span>
              </button>
            </div>

            {/* Document preview */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 text-xs sm:text-sm leading-relaxed font-sans max-h-[500px] overflow-y-auto">
              {PROPOSAL_STEPS.map((s, idx) => (
                <div key={s.key} className="space-y-1 pb-4 border-b border-slate-200/80 last:border-b-0">
                  <h3 className="font-bold text-brand-900 text-sm">
                    {idx + 1}. {s.title}
                  </h3>
                  <div className="text-ink/90 whitespace-pre-wrap pl-2 border-l-2 border-purple-200">
                    {answers[s.key] ? escapeHtml(answers[s.key]) : <em className="text-slate-400">(belum diisi)</em>}
                  </div>
                </div>
              ))}
            </div>

            {/* Review Card */}
            {reviewData && <ReviewCard title="Hasil Telaah Proposal Riset" subtitle="Telaah otomatis terhadap kelengkapan, keselarasan antarunsur, dan efektivitas bahasa rencana riset sesuai Bab II Pedoman KTI MAN 1 Nganjuk." {...reviewData} />}

            {/* KBC Proposal Detail */}
            {kbcProposalResult && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <span>💛 Review Insersi KBC Latar Belakang</span>
                  </h3>
                  <Badge status={kbcProposalResult.status} />
                </div>
                <p className="text-xs text-indigo-900/80">
                  Kriteria terpenuhi: <strong>{kbcProposalResult.score}/{kbcProposalResult.total}</strong>
                </p>
                <ul className="space-y-1.5 text-xs text-indigo-950">
                  {kbcProposalResult.crit.map((c: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={c.pass ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {c.pass ? '✓' : '✕'}
                      </span>
                      <span>{c.label}: <em>{c.note}</em></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
