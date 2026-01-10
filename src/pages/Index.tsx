import { useState } from 'react';
import { Users, UserCheck, Ghost, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MapWidget from '@/components/dashboard/MapWidget';
import GhostDetectionPanel from '@/components/dashboard/GhostDetectionPanel';
import AttendanceTab from '@/components/dashboard/AttendanceTab';
import { useGhostDetection } from '@/hooks/useGhostDetection';
import EmployeeDirectory from '@/components/dashboard/EmployeeDirectory';
import AttendanceAnalytics from '@/components/dashboard/AttendanceAnalytics';
import PayrollSection from '@/components/dashboard/PayrollSection';
import RAFCenter from '@/components/dashboard/RAFCenter';
import { employeeDatabase, getGhostAnomalies, attendanceDatabase } from '@/lib/mockdata';

const Index = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { stats } = useGhostDetection();
  
  const ghostAnomalies = getGhostAnomalies(attendanceDatabase);
  const presentToday = attendanceDatabase.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Present').length;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar 
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab} onTabChange={setActiveTab} userRole={user.role} 
      />

      <main className="lg:ml-64 pt-16 p-4 md:p-6">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <SummaryCard title="Total Workforce" value={employeeDatabase.length.toLocaleString()} subtitle="Registered Staff" icon={Users} />
              <SummaryCard title="Attendance" value={presentToday > 0 ? presentToday.toString() : "8,920"} subtitle="On-Site Now" icon={UserCheck} valueColor="success" />
              <SummaryCard title="AI Anomalies" value={ghostAnomalies.length.toString()} subtitle="Ghost Entries" icon={Ghost} valueColor="danger" />
              <SummaryCard title="Rapid Tasks" value="12" subtitle="Urgent Alerts" icon={Zap} valueColor="warning" />
            </div>
            <MapWidget />
          </>
        )}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'rapid' && <RAFCenter />}
        {activeTab === 'ghost' && <GhostDetectionPanel />}
        {activeTab === 'payroll' && <PayrollSection />}
        {(activeTab === 'reports' && (user.role === 'admin' || user.role === 'hr')) && (
          <div className="space-y-6">
            <AttendanceAnalytics />
            <EmployeeDirectory />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;