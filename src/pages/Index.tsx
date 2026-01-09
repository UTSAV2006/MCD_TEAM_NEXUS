import { useState, useEffect } from 'react';
import { Users, UserCheck, Ghost, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import MapWidget from '@/components/dashboard/MapWidget';
import AlertsFeed from '@/components/dashboard/AlertsFeed';
import Leaderboard from '@/components/dashboard/Leaderboard';
import GhostDetectionPanel from '@/components/dashboard/GhostDetectionPanel';
import { useGhostDetection } from '@/hooks/useGhostDetection';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendance, setAttendance] = useState(8920);
  const { stats } = useGhostDetection();

  // Attendance simulation to make it look "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setAttendance(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="lg:ml-64 pt-16 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Real-time workforce monitoring and analytics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  title="Total Workforce"
                  value="12,450"
                  subtitle="Registered Staff"
                  icon={Users}
                />
                <SummaryCard
                  title="Real-Time Attendance"
                  value={attendance.toLocaleString()}
                  subtitle="Currently On-Site (Verified)"
                  icon={UserCheck}
                  valueColor="success"
                  progress={72}
                />
                <SummaryCard
                  title="AI Anomalies Detected"
                  value={stats?.total?.toString() || "0"}
                  subtitle="Potential 'Ghost' Entries Today"
                  icon={Ghost}
                  valueColor="danger"
                  trend={stats?.total && stats.total > 0 ? "up" : "stable"}
                  actionLabel="View List"
                  onAction={() => setActiveTab('ghost')}
                />
                <SummaryCard
                  title="Rapid Tasks Open"
                  value="12"
                  subtitle="Unassigned urgent complaints"
                  icon={Zap}
                  valueColor="warning"
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <MapWidget />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AlertsFeed />
                  <Leaderboard />
                </div>
              </div>
            </div>
          )}

          {/* Ghost Detection View */}
          {activeTab === 'ghost' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">AI Ghost Detection</h2>
                <p className="text-muted-foreground">Manage and resolve system anomalies</p>
              </div>
              <GhostDetectionPanel />
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'dashboard' && activeTab !== 'ghost' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Zap className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium">Module Under Development</h3>
              <p className="text-muted-foreground">The {activeTab} feature will be available in the next update.</p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Index;