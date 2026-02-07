'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Facility, FilterState, SeverityLevel, FacilityType } from '@/types';
import { facilities as allFacilities } from '@/data/hospitals';

interface DashboardContextType {
  facilities: Facility[];
  filteredFacilities: Facility[];
  selectedFacilityId: string | null;
  setSelectedFacilityId: (id: string | null) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  toggleDepartment: (id: string) => void;
  toggleSeverityLevel: (level: SeverityLevel) => void;
  toggleFacilityType: (type: FacilityType) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  departments: [],
  severityLevels: [],
  facilityTypes: [],
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const toggleDepartment = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      departments: prev.departments.includes(id)
        ? prev.departments.filter((d) => d !== id)
        : [...prev.departments, id],
    }));
  };

  const toggleSeverityLevel = (level: SeverityLevel) => {
    setFilters((prev) => ({
      ...prev,
      severityLevels: prev.severityLevels.includes(level)
        ? prev.severityLevels.filter((l) => l !== level)
        : [...prev.severityLevels, level],
    }));
  };

  const toggleFacilityType = (type: FacilityType) => {
    setFilters((prev) => ({
      ...prev,
      facilityTypes: prev.facilityTypes.includes(type)
        ? prev.facilityTypes.filter((t) => t !== type)
        : [...prev.facilityTypes, type],
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredFacilities = useMemo(() => {
    return allFacilities.filter((facility) => {
      if (filters.facilityTypes.length > 0 && !filters.facilityTypes.includes(facility.type)) {
        return false;
      }
      if (filters.departments.length > 0) {
        const facilityDeptIds = facility.departments.map((d) => d.id);
        if (!filters.departments.some((d) => facilityDeptIds.includes(d))) {
          return false;
        }
      }
      if (filters.severityLevels.length > 0) {
        const facilityLevels = facility.beds.map((b) => b.severityLevel);
        if (!filters.severityLevels.some((l) => facilityLevels.includes(l))) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return (
    <DashboardContext.Provider
      value={{
        facilities: allFacilities,
        filteredFacilities,
        selectedFacilityId,
        setSelectedFacilityId,
        filters,
        setFilters,
        toggleDepartment,
        toggleSeverityLevel,
        toggleFacilityType,
        resetFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
