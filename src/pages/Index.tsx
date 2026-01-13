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
import ReportsAnalytics from '@/components/dashboard/ReportsInsights';
import Leaderboard from '@/components/dashboard/Leaderboard';
import ReportIssue from '@/components/dashboard/ReportIssue';
import EmployeePayroll from '@/components/dashboard/EmployeePayroll';
import EmployeeAttendance from '@/components/dashboard/EmployeeAttendance';
import { LoggedInEmployee } from '@/types/employee';

interface IndexProps {
  employee: LoggedInEmployee;
  onLogout: () => void;
}

const Index = ({ employee, onLogout }: IndexProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { stats } = useGhostDetection();

  // For employees, show their personalized dashboard
  const isEmployee = employee.userRole === 'employee';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        employee={employee}
        onLogout={onLogout}
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={employee.userRole} 
      />

      <main className="lg:ml-64 pt-20 p-6">
        {/* Admin Dashboard */}
        {activeTab === 'dashboard' && !isEmployee && (
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

        {/* Employee Personal Dashboard */}
        {activeTab === 'dashboard' && isEmployee && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-2">Welcome, {employee.name}!</h2>
              <p className="text-muted-foreground">
                {employee.role} • {employee.department} • {employee.zone} Zone
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <EmployeeAttendance employeeId={employee.id} />
              <EmployeePayroll employeeId={employee.id} />
            </div>
          </div>
        )}

        {/* Employee's own attendance view */}
        {activeTab === 'attendance' && isEmployee && (
          <EmployeeAttendance employeeId={employee.id} fullView />
        )}

        {/* Admin attendance management */}
        {activeTab === 'attendance' && !isEmployee && <AttendanceTab />}

        {activeTab === 'rapid' && <ReportIssue employeeId={employee.id} />}
        {activeTab === 'ghost' && <GhostDetectionPanel />}
        {activeTab === 'raf' && <RapidActionForce />}
        
        {/* Employee's own payroll */}
        {activeTab === 'pay' && isEmployee && (
          <EmployeePayroll employeeId={employee.id} fullView />
        )}
        
        {/* Admin payroll management */}
        {activeTab === 'pay' && !isEmployee && <MyPayroll />}
        
        {activeTab === 'report' && <ReportsAnalytics />}
        {activeTab === 'leader' && <Leaderboard />}
      </main>
    </div>
  );
};

export default Index;
