import { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, Shield, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LoggedInEmployee } from '@/types/employee';

interface HeaderProps {
  onMenuToggle: () => void;
  employee?: LoggedInEmployee;
  onLogout?: () => void;
}

const Header = ({ onMenuToggle, employee, onLogout }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'hr': return 'HR Manager';
      default: return 'Employee';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-header text-header-foreground z-50 border-b border-sidebar-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side - Logo and Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-header-foreground hover:bg-sidebar-accent"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary">
              <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">MCD Workforce Command Center</h1>
              <p className="text-xs text-sidebar-foreground/70">Smart Monitoring System</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold">MCD Command</h1>
            </div>
          </div>
        </div>

        {/* Right Side - Clock, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Clock */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{formatTime(currentTime)} IST</span>
            </div>
            <span className="text-xs text-sidebar-foreground/70">{formatDate(currentTime)}</span>
          </div>

          {/* Mobile Time */}
          <div className="md:hidden text-sm font-semibold tabular-nums">
            {formatTime(currentTime)}
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-header-foreground hover:bg-sidebar-accent"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-status-danger text-status-danger-foreground text-xs font-bold">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-card">
              <div className="px-3 py-2 border-b">
                <h4 className="font-semibold text-sm">System Alerts</h4>
              </div>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <span className="text-xs text-status-danger font-medium">High Priority</span>
                <span className="text-sm">5 Ghost entries detected in Rohini Zone</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <span className="text-xs text-status-warning font-medium">Warning</span>
                <span className="text-sm">12 workers late check-in - Dwarka Sector</span>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <span className="text-xs text-status-success font-medium">System</span>
                <span className="text-sm">RFID sync completed successfully</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary font-medium cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-header-foreground hover:bg-sidebar-accent px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
                    {employee ? getInitials(employee.name) : 'RK'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{employee?.name || 'R. Kumar'}</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {employee ? getRoleBadge(employee.userRole) : 'Administrator'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card">
              {employee && (
                <>
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.id} • {employee.zone}</p>
                  </div>
                </>
              )}
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                System Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-status-danger gap-2"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
