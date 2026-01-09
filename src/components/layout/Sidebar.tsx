import { 
  LayoutDashboard, Fingerprint, Ghost, Zap, Wallet, BarChart3, Settings, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Live Attendance', icon: Fingerprint },
  { id: 'ghost', label: 'AI Ghost Detection', icon: Ghost, badge: 'Beta' },
  { id: 'rapid', label: 'Rapid Task Force', icon: Zap },
  { id: 'payroll', label: 'Payroll Integrity', icon: Wallet },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
];

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed top-16 left-0 bottom-0 w-64 bg-sidebar z-40 transform transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); onClose(); }}
                className={cn(
                  "flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-sm font-medium",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-status-warning/20 text-status-warning text-[10px] px-1">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-sidebar-border">
            <button className="flex items-center gap-3 w-full p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg text-sm">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
