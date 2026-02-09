import { SeverityLevel, FacilityType, TimeSlot, OutpatientSlotStatus } from '@/types';

export const MAP_CENTER = { lat: 34.7500, lng: 137.3916 } as const;
export const MAP_DEFAULT_ZOOM = 13;

export const SEVERITY_LABELS: Record<SeverityLevel, { label: string; short: string; description: string }> = {
  1: { label: '高度急性期（ICU/HCU）', short: '高度急性期', description: '心停止・多発外傷・脳卒中超急性期' },
  2: { label: '急性期', short: '急性期', description: '肺炎入院・急性腹症・骨折手術' },
  3: { label: '回復期', short: '回復期', description: '脳卒中リハ・術後回復' },
  4: { label: '慢性期', short: '慢性期', description: '長期療養・終末期' },
  5: { label: '介護', short: '介護', description: '介護医療院・介護療養' },
};

export const FACILITY_TYPE_LABELS: Record<FacilityType, { label: string; icon: string; color: string }> = {
  acute: { label: '急性期病院', icon: 'H', color: '#dc2626' },
  recovery: { label: '回復期病院', icon: 'R', color: '#2563eb' },
  clinic: { label: 'クリニック', icon: 'C', color: '#7c3aed' },
  visiting_nurse: { label: '訪問看護', icon: 'VN', color: '#059669' },
  home_care: { label: '訪問介護', icon: 'HC', color: '#0891b2' },
  day_service: { label: 'デイサービス', icon: 'DS', color: '#d97706' },
};

export const AVAILABILITY_COLORS = {
  available: '#22c55e',
  few: '#eab308',
  full: '#ef4444',
} as const;

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  am: '午前',
  pm1: '午後I',
  pm2: '午後II',
};

export const DAY_OF_WEEK_LABELS = ['月', '火', '水', '木', '金', '土'] as const;

export const OUTPATIENT_STATUS_DISPLAY: Record<OutpatientSlotStatus, { symbol: string; color: string; bgColor: string }> = {
  available: { symbol: '◯', color: '#22c55e', bgColor: '#f0fdf4' },
  few:       { symbol: '△', color: '#eab308', bgColor: '#fefce8' },
  full:      { symbol: '×', color: '#ef4444', bgColor: '#fef2f2' },
  closed:    { symbol: '—', color: '#94a3b8', bgColor: 'transparent' },
};
