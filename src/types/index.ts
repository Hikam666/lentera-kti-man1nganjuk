export type ActiveTab = 'dashboard' | 'analisis' | 'simulator' | 'similaritas' | 'kbc';

export interface StructureSection {
  key: string;
  label: string;
  kw: string[];
  limit: number | null;
}

export interface BahasaItem {
  label: string;
  pass: boolean;
  note: string;
}

export interface BahasaAssessment {
  status: 'Sangat Efektif' | 'Efektif' | 'Cukup' | 'Perlu Ditingkatkan';
  avgLen: number;
  items: BahasaItem[];
}

export interface ReviewMetric {
  label: string;
  val: string | number;
}

export interface ReviewCardProps {
  title: string;
  subtitle: string;
  strengths: string[];
  revisi: string[];
  keselarasanStatus: string;
  keselarasanNote: string;
  bahasaStatus: string;
  bahasaItems: BahasaItem[];
  metrics: ReviewMetric[];
}

export interface StepDefinition {
  key: string;
  title: string;
  hint: string;
  limit?: number;
  type?: 'select' | 'text';
  options?: string[];
  validate?: (val: string, allAnswers: Record<string, string>) => string | null;
}

export interface KbcValueItem {
  k: string;
  n: string;
  re: RegExp;
  d: string;
  ind: string[];
  hits?: string[];
}

export interface KbcCriterion {
  label: string;
  pass: boolean | null;
  note: string;
}

export interface KbcAssessmentResult {
  mode: 'latar' | 'pembahasan';
  vals: KbcValueItem[];
  kSents: string[];
  crit: KbcCriterion[];
  score: number;
  total: number;
  status: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Diperbaiki' | 'Belum Ada Insersi KBC';
}

export interface SimilarityResult {
  percent: number;
  html: string;
  tooShort: boolean;
  tokACount: number;
  tokBCount: number;
}
