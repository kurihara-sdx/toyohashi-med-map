export type FacilityType = 'acute' | 'recovery' | 'clinic' | 'visiting_nurse';

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
}

export interface FilterState {
  departments: string[];
  severityLevels: SeverityLevel[];
  facilityTypes: FacilityType[];
}
