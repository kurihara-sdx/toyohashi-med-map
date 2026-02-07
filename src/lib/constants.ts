import { SeverityLevel, FacilityType } from '@/types';

export const MAP_CENTER = { lat: 34.7500, lng: 137.3916 } as const;
export const MAP_DEFAULT_ZOOM = 14;

export const SEVERITY_LABELS: Record<SeverityLevel, { label: string; short: string; description: string }> = {
  1: { label: '超急性期（ICU/HCU）', short: 'ICU', description: '心停止・多発外傷・脳卒中超急性期' },
  2: { label: '急性期', short: '急性期', description: '肺炎入院・急性腹症・骨折手術' },
  3: { label: '回復期', short: '回復期', description: '脳卒中リハ・術後回復' },
  4: { label: '慢性期/療養', short: '療養', description: '長期療養・終末期' },
  5: { label: '精神科', short: '精神科', description: '精神科救急・措置入院' },
};

export const FACILITY_TYPE_LABELS: Record<FacilityType, { label: string; icon: string; color: string }> = {
  acute: { label: '急性期病院', icon: 'H', color: '#dc2626' },
  recovery: { label: '回復期病院', icon: 'R', color: '#2563eb' },
  clinic: { label: 'クリニック', icon: 'C', color: '#7c3aed' },
  visiting_nurse: { label: '訪問看護', icon: 'VN', color: '#059669' },
};

export const AVAILABILITY_COLORS = {
  available: '#22c55e',
  few: '#eab308',
  full: '#ef4444',
} as const;
