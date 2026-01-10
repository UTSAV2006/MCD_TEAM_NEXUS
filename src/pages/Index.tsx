import { useState } from 'react';
import { Users, UserCheck, Ghost, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MapWidget from '@/components/dashboard/MapWidget';
import GhostDetectionPanel from '@/components/dashboard/GhostDetectionPanel';
import AttendanceTab from '@/components/dashboard/AttendanceTab';
import { useGhostDetection } from '@/hooks/useGhostDetection';
import RapidActionForce from '@/components/dashboard/RapidActionForce';
import MyPayroll from '@/components/dashboard/MyPayroll';

import ReportIssue from '@/components/dashboard/ReportIssue';



const Index = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { stats } = useGhostDetection();
  
  

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar 
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab} onTabChange={setActiveTab} userRole={user.role} 
      />

      <main className="lg:ml-64 pt-20 p-6">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <SummaryCard title="Total Workforce" value="12,450" subtitle="Registered Staff" icon={Users} />
              <SummaryCard title="Attendance" value="8,920" subtitle="On-Site Now" icon={UserCheck} valueColor="success" />
              <SummaryCard title="AI Anomalies" value={stats?.total?.toString() || "0"} subtitle="Ghost Entries" icon={Ghost} valueColor="danger" />
              <SummaryCard title="Rapid Tasks" value="12" subtitle="Urgent Alerts" icon={Zap} valueColor="warning" />
            </div>
            <MapWidget />
          </>
        )}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'rapid' && <ReportIssue />}
        {activeTab === 'ghost' && <GhostDetectionPanel />}
        {activeTab === 'raf' && <RapidActionForce />}
        {activeTab === 'pay' && <MyPayroll />}
        
        {(activeTab === 'reports' && (user.role === 'admin' || user.role === 'hr')) && (
          <div className="space-y-6">
            
            
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;