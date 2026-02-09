export type FacilityType = 'acute' | 'recovery' | 'clinic' | 'visiting_nurse' | 'home_care' | 'day_service';

export type AvailabilityStatus = 'available' | 'few' | 'full';

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export interface BedInfo {
  severityLevel: SeverityLevel;
  totalBeds: number;
  inUse: number;
  available: number;
  scheduledDischarges: number;
}

export interface Department {
  id: string;
  name: string;
  hasOutpatient: boolean;
  outpatientSlots?: number;
  weeklySchedules?: WeeklyOutpatientSchedule[];
}

export interface ServiceCapacity {
  totalStaff: number;
  currentPatients: number;
  maxPatients: number;
  availableSlots: number;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  phone: string;
  fax?: string;
  lat: number;
  lng: number;
  beds: BedInfo[];
  departments: Department[];
  emergencyAccepting: boolean;
  notes?: string;
  lastUpdated: string;
  serviceCapacity?: ServiceCapacity;
}

export type TimeSlot = 'am' | 'pm1' | 'pm2';
export type OutpatientSlotStatus = 'available' | 'few' | 'full' | 'closed';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5; // 月〜土

export interface OutpatientSlotCell {
  totalSlots: number;
  bookedSlots: number;
}

export interface DailyOutpatientSchedule {
  date: string; // ISO "2026-02-09"
  slots: Record<TimeSlot, OutpatientSlotCell | null>; // null = 休診
}

export interface WeeklyOutpatientSchedule {
  departmentId: string;
  weekStartDate: string; // 月曜日のISO日付
  days: DailyOutpatientSchedule[]; // 6要素（月〜土）
}

export interface FilterState {
  departments: string[];
  severityLevels: SeverityLevel[];
  facilityTypes: FacilityType[];
}
