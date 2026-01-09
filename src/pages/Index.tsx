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
  const { stats } = useGhostDetection();

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-muted-foreground">Real-time workforce monitoring and analytics</p>
          </div>

          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Total Workforce"
              value="12,450"
              subtitle="Registered Staff"
              icon={Users}
              trend="stable"
              trendValue="0.2%"
            />
            <SummaryCard
              title="Real-Time Attendance"
              value="8,920"
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
              trendValue={stats?.by_severity.critical ? `+${stats.by_severity.critical} critical` : ""}
              actionLabel="View List"
              onAction={() => document.getElementById('ghost-panel')?.scrollIntoView({ behavior: 'smooth' })}
            />
            <SummaryCard
              title="Rapid Tasks Open"
              value="12"
              subtitle="Unassigned urgent complaints"
              icon={Zap}
              valueColor="warning"
              trend="down"
              trendValue="-3"
            />
          </div>

          {/* Row 2: Map Widget */}
          <div className="mb-6">
            <MapWidget />
          </div>

          {/* Row 3: Ghost Detection Panel */}
          <div className="mb-6" id="ghost-panel">
            <GhostDetectionPanel />
          </div>

          {/* Row 4: Alerts Feed & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsFeed />
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
