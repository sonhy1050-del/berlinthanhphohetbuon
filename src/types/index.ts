export type ActiveTab = 'home' | 'faq' | 'ipay' | 'game' | 'savings' | 'loan' | 'products' | 'branches';

export interface FaqStep {
  step: number;
  title: string;
  text: string;
  image: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  icon: string;
  videoUrl: string;
  videoTitle: string;
  steps: FaqStep[];
}

export interface SavingsTerm {
  month: number;
  rate: number;
  label: string;
}

export interface LoanScheduleRow {
  period: number;
  paymentDate: string;
  startBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endBalance: number;
}

export interface ProductItem {
  id: string;
  category: string;
  title: string;
  posterUrl: string;
  badge: string;
  summary: string;
}

export interface BranchOffice {
  id: string;
  name: string;
  address: string;
  hotline: string;
  imageUrl: string;
  mapsUrl: string;
  isHeadquarters: boolean;
}

export interface BranchRegion {
  id: string;
  name: string;
}

export interface VoucherRecord {
  code: string;
  reward: string;
  score: number;
  timestamp: string;
}
