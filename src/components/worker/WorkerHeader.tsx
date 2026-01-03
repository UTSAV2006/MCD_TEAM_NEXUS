import { Globe, Shield, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Language } from '@/pages/WorkerPortal';

interface WorkerHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isCheckedIn: boolean;
}

const WorkerHeader = ({ language, onLanguageChange, isCheckedIn }: WorkerHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-header text-header-foreground shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary">
              <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold">
                {language === 'en' ? 'MCD Worker' : 'MCD कर्मचारी'}
              </h1>
              <p className="text-xs text-sidebar-foreground/70">
                {language === 'en' ? 'Field Ops' : 'फील्ड ऑप्स'}
              </p>
            </div>
          </div>

          {/* Status and Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Online Status */}
            <Badge 
              variant="outline" 
              className={`gap-1.5 ${isCheckedIn ? 'border-status-success text-status-success' : 'border-muted-foreground text-muted-foreground'}`}
            >
              {isCheckedIn ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="hidden sm:inline">{language === 'en' ? 'On Duty' : 'ड्यूटी पर'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Off Duty' : 'छुट्टी पर'}</span>
                </>
              )}
            </Badge>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground font-semibold min-w-[70px]"
            >
              <Globe className="h-4 w-4 mr-1.5" />
              {language === 'en' ? 'हिंदी' : 'ENG'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkerHeader;
