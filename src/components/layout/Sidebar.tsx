import { 
  LayoutDashboard, 
  Fingerprint, 
  Ghost, 
  Zap, 
  Wallet, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard Overview', 
    icon: LayoutDashboard, 
    active: true 
  },
  { 
    id: 'attendance', 
    label: 'Live Attendance (RFID/Face)', 
    icon: Fingerprint 
  },
  { 
    id: 'ghost', 
    label: 'AI Ghost Detection', 
    icon: Ghost, 
    badge: 'Beta' 
  },
  { 
    id: 'rapid', 
    label: 'Rapid Task Force', 
    icon: Zap 
  },
  { 
    id: 'payroll', 
    label: 'Payroll Integrity', 
    icon: Wallet 
  },
  { 
    id: 'reports', 
    label: 'Reports & Analytics', 
    icon: BarChart3 
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 bottom-0 w-64 bg-sidebar z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "nav-item w-full text-left",
                  item.active ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-status-warning/20 text-status-warning text-xs px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Settings at Bottom */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <button className="nav-item nav-item-inactive w-full text-left">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>

          {/* System Status */}
          <div className="px-4 py-3 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
