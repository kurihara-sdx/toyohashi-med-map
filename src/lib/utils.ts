import { Facility, BedInfo, AvailabilityStatus } from '@/types';

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
