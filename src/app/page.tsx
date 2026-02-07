import { DashboardProvider } from '@/context/DashboardContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import MainContent from '@/components/dashboard/MainContent';
import FacilityDetailPanel from '@/components/detail/FacilityDetailPanel';

export default function Home() {
  return (
    <DashboardProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="px-4 py-3 bg-slate-50">
          <StatsOverview />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <FacilityDetailPanel />
      </div>
    </DashboardProvider>
  );
}
