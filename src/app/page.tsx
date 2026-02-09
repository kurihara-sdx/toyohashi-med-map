import { DashboardProvider } from '@/context/DashboardContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MainContent from '@/components/dashboard/MainContent';
import FacilityDetailPanel from '@/components/detail/FacilityDetailPanel';
import DisclaimerModal from '@/components/DisclaimerModal';

export default function Home() {
  return (
    <DashboardProvider>
      <DisclaimerModal />
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <FacilityDetailPanel />
      </div>
    </DashboardProvider>
  );
}
