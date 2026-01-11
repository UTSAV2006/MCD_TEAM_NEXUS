import { LayoutDashboard, Fingerprint, Ghost, Zap, Wallet, BarChart3, Settings, FastForward } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BarChart } from 'recharts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
  userRole: 'admin' | 'employee'|'hr';
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['admin'] },
  { id: 'attendance', label: 'Attendance & Selfie', icon: Fingerprint, roles: ['admin', 'employee'] },
  { id: 'ghost', label: 'AI Ghost Detection', icon: Ghost, roles: ['admin'], badge: 'Beta' },
  { id: 'rapid', label: 'Report Issue', icon: Zap, roles: ['admin', 'employee'] },
  { id: 'pay', label: 'My Payroll', icon: Wallet, roles: ['admin', 'employee'] },
  { id: 'report', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin','hr'] },
  { id: 'raf', label: 'Rapid Action Force(RAF)', icon: FastForward, roles: ['admin', 'hr']},
  { id: 'leader', label: 'Employee Leaderboard', icon: BarChart, roles: ['admin', 'hr']},
];

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, userRole }: SidebarProps) => {
  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className={cn(
      "fixed top-16 left-0 bottom-0 w-64 bg-sidebar z-40 transform transition-transform lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onTabChange(item.id); onClose(); }}
            className={cn(
              "flex items-center gap-3 w-full p-2 rounded-lg text-sm",
              activeTab === item.id ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && <Badge className="bg-warning text-[10px]">{item.badge}</Badge>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
