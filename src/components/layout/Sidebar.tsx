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
  userRole: 'admin' | 'employee'; // Naya prop
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['admin'] },
  { id: 'attendance', label: 'Attendance & Selfie', icon: Fingerprint, roles: ['admin', 'employee'] },
  { id: 'ghost', label: 'AI Ghost Detection', icon: Ghost, badge: 'Beta', roles: ['admin'] },
  { id: 'rapid', label: 'Report Issue', icon: Zap, roles: ['admin', 'employee'] },
  { id: 'payroll', label: 'My Payroll', icon: Wallet, roles: ['admin', 'employee'] },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['admin'] },
];

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, userRole }: SidebarProps) => {
  // Yaha par filter ho raha hai role ke basis pe
  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        "fixed top-16 left-0 bottom-0 w-64 bg-sidebar z-40 transform transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
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
                {item.badge && <Badge variant="secondary" className="bg-status-warning/20 text-status-warning text-[10px] px-1">{item.badge}</Badge>}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
