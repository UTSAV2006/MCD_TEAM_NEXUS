import { useState, useEffect } from 'react';
import { Users, UserCheck, Ghost, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MapWidget from '@/components/dashboard/MapWidget';
import AlertsFeed from '@/components/dashboard/AlertsFeed';
import ReportIssue from '@/components/dashboard/ReportIssue';
import Leaderboard from '@/components/dashboard/Leaderboard';
import GhostDetectionPanel from '@/components/dashboard/GhostDetectionPanel';
import AttendanceTab from '@/components/dashboard/AttendanceTab';
import { useGhostDetection } from '@/hooks/useGhostDetection';
import EmployeeDirectory from '@/components/dashboard/EmployeeDirectory';
import RapidActionCenter from '@/components/dashboard/RapidActionCenter';


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
        <div className="animate-in fade-in duration-500">
        {/* 1. Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Workforce" value="12,450" subtitle="Registered Staff" icon={Users} />
        <SummaryCard title="Attendance" value="8,920" subtitle="On-Site Today" icon={UserCheck} valueColor="success" />
        <SummaryCard title="AI Anomalies" value={stats?.total?.toString() || "0"} subtitle="Flagged Issues" icon={Ghost} valueColor="danger" />
        <SummaryCard title="Rapid Tasks" value="12" subtitle="Urgent Reports" icon={Zap} valueColor="warning" />
    </div>

    {/* 2. Map Section */}
    <div className="mb-6">
      <MapWidget />
    </div>

    {/* 3. Lower Section: Alerts & Leaderboard */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AlertsFeed />
      <Leaderboard /> 
    </div>
  </div>
)}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'rapid' && (
         <div className="space-y-6">
          <div className="mb-2">
           <h2 className="text-2xl font-bold">Rapid Action Command</h2>
           <p className="text-muted-foreground">Emergency workforce mobilization & dispatch center</p>
        </div>
        <RapidActionCenter />
      </div>
    )}
        {activeTab === 'rapid' && <ReportIssue />}
        {activeTab === 'ghost' && <GhostDetectionPanel />}
        {(activeTab === 'reports' && (user.role === 'admin' || user.role === 'hr')) && (
  <div className="animate-in slide-in-from-right-4 duration-500">
    <EmployeeDirectory />
  </div>
)}
      </main>
    </div>
  );
};

export default Index;