import { Facility, BedInfo, AvailabilityStatus, ServiceCapacity, OutpatientSlotCell, OutpatientSlotStatus } from '@/types';

export function getOccupancyRate(beds: BedInfo[]): number {
  const totalBeds = beds.reduce((sum, b) => sum + b.totalBeds, 0);
  const inUse = beds.reduce((sum, b) => sum + b.inUse, 0);
  if (totalBeds === 0) return 0;
  return (inUse / totalBeds) * 100;
}

export function getAvailabilityStatus(beds: BedInfo[]): AvailabilityStatus {
  const rate = getOccupancyRate(beds);
  if (rate >= 90) return 'full';
  if (rate >= 70) return 'few';
  return 'available';
}

export function getVNAvailabilityStatus(cap: ServiceCapacity): AvailabilityStatus {
  if (cap.availableSlots <= 0) return 'full';
  if (cap.availableSlots <= 2) return 'few';
  return 'available';
}

export function getFacilityAvailabilityStatus(facility: Facility): AvailabilityStatus {
  if (facility.serviceCapacity) return getVNAvailabilityStatus(facility.serviceCapacity);
  if (facility.beds.length > 0) return getAvailabilityStatus(facility.beds);
  return 'available';
}

export function getTotalAvailableBeds(facilities: Facility[]): number {
  return facilities.reduce(
    (sum, f) => sum + f.beds.reduce((s, b) => s + b.available, 0),
    0
  );
}

export function getTotalScheduledDischarges(facilities: Facility[]): number {
  return facilities.reduce(
    (sum, f) => sum + f.beds.reduce((s, b) => s + b.scheduledDischarges, 0),
    0
  );
}

export function getOverallOccupancyRate(facilities: Facility[]): number {
  const allBeds = facilities.flatMap((f) => f.beds);
  return getOccupancyRate(allBeds);
}

export function getOutpatientSlotStatus(cell: OutpatientSlotCell | null): OutpatientSlotStatus {
  if (cell === null) return 'closed';
  const remaining = cell.totalSlots - cell.bookedSlots;
  if (remaining <= 0) return 'full';
  if (remaining <= 2) return 'few';
  return 'available';
}

export function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekRange(monday: Date): string {
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  const m1 = monday.getMonth() + 1;
  const d1 = monday.getDate();
  const m2 = saturday.getMonth() + 1;
  const d2 = saturday.getDate();
  if (m1 === m2) {
    return `${m1}/${d1}〜${d2}`;
  }
  return `${m1}/${d1}〜${m2}/${d2}`;
}
