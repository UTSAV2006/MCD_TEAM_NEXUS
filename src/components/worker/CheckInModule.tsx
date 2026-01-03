import { useState } from 'react';
import { MapPin, Fingerprint, CreditCard, Camera, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Language } from '@/pages/WorkerPortal';

interface CheckInModuleProps {
  language: Language;
  translations: Record<string, string>;
  isCheckedIn: boolean;
  isWithinGeofence: boolean;
  checkingLocation: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

const CheckInModule = ({
  language,
  translations: t,
  isCheckedIn,
  isWithinGeofence,
  checkingLocation,
  onCheckIn,
  onCheckOut,
}: CheckInModuleProps) => {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'face' | 'rfid' | null>(null);
  const [rfidInput, setRfidInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCheckInClick = () => {
    if (!isWithinGeofence) return;
    setShowVerification(true);
  };

  const handleVerification = (method: 'face' | 'rfid') => {
    setVerificationMethod(method);
    if (method === 'face') {
      // Simulate face verification
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setShowVerification(false);
        setVerificationMethod(null);
        onCheckIn();
      }, 2000);
    }
  };

  const handleRfidSubmit = () => {
    if (rfidInput.length >= 4) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setShowVerification(false);
        setVerificationMethod(null);
        setRfidInput('');
        onCheckIn();
      }, 1500);
    }
  };

  if (isCheckedIn) {
    return (
      <div className="dashboard-card bg-gradient-to-br from-status-success/10 to-status-success/5 border-status-success/30 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-status-success" />
          </div>
          <div>
            <p className="font-bold text-status-success text-lg">{t.checkedIn}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Since 9:00 AM • Rohini Sector 7' : '9:00 AM से • रोहिणी सेक्टर 7'}
            </p>
          </div>
        </div>

        <Button
          onClick={onCheckOut}
          variant="outline"
          className="w-full h-14 text-lg font-bold border-status-danger/50 text-status-danger hover:bg-status-danger hover:text-status-danger-foreground"
        >
          {t.checkOut}
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard-card animate-fade-in-up">
      {/* Location Status */}
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg mb-4 border",
        checkingLocation 
          ? "bg-muted/50 border-muted" 
          : isWithinGeofence 
            ? "bg-status-success/10 border-status-success/30" 
            : "bg-status-danger/10 border-status-danger/30"
      )}>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          checkingLocation 
            ? "bg-muted" 
            : isWithinGeofence 
              ? "bg-status-success/20" 
              : "bg-status-danger/20"
        )}>
          {checkingLocation ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : isWithinGeofence ? (
            <MapPin className="h-5 w-5 text-status-success" />
          ) : (
            <XCircle className="h-5 w-5 text-status-danger" />
          )}
        </div>
        <div className="flex-1">
          <p className={cn(
            "font-semibold",
            checkingLocation ? "text-muted-foreground" : isWithinGeofence ? "text-status-success" : "text-status-danger"
          )}>
            {checkingLocation 
              ? t.verifyingLocation 
              : isWithinGeofence 
                ? (language === 'en' ? 'Inside Work Zone ✓' : 'कार्य क्षेत्र में ✓')
                : t.outsideZone
            }
          </p>
          {!checkingLocation && (
            <p className="text-xs text-muted-foreground">
              {isWithinGeofence 
                ? (language === 'en' ? 'Rohini Sector 7 • GPS Verified' : 'रोहिणी सेक्टर 7 • GPS सत्यापित')
                : (language === 'en' ? 'Move to your assigned zone' : 'अपने निर्धारित क्षेत्र में जाएं')
              }
            </p>
          )}
        </div>
      </div>

      {/* Check-In Button or Verification */}
      {!showVerification ? (
        <Button
          onClick={handleCheckInClick}
          disabled={!isWithinGeofence || checkingLocation}
          className={cn(
            "w-full h-20 text-xl font-bold transition-all duration-300",
            isWithinGeofence && !checkingLocation
              ? "bg-status-success hover:bg-status-success/90 text-status-success-foreground shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Fingerprint className="h-8 w-8 mr-3" />
          {t.checkIn}
        </Button>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <p className="text-center font-semibold text-foreground">
            {language === 'en' ? 'Choose Verification Method' : 'सत्यापन विधि चुनें'}
          </p>

          {verificationMethod === null && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleVerification('face')}
                className="h-24 flex-col gap-2 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-8 w-8" />
                <span className="font-bold">{language === 'en' ? 'Face ID' : 'फेस ID'}</span>
              </Button>
              <Button
                onClick={() => setVerificationMethod('rfid')}
                variant="outline"
                className="h-24 flex-col gap-2 border-2"
              >
                <CreditCard className="h-8 w-8" />
                <span className="font-bold">{language === 'en' ? 'RFID Card' : 'RFID कार्ड'}</span>
              </Button>
            </div>
          )}

          {verificationMethod === 'face' && (
            <div className="aspect-[4/3] bg-foreground/5 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-primary/50">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-primary/50 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-50" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {language === 'en' ? 'Scanning face...' : 'चेहरा स्कैन हो रहा है...'}
              </p>
            </div>
          )}

          {verificationMethod === 'rfid' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-status-warning/10 rounded-lg border border-status-warning/30">
                <AlertTriangle className="h-5 w-5 text-status-warning flex-shrink-0" />
                <p className="text-sm text-status-warning">
                  {language === 'en' ? 'Tap your RFID card or enter ID' : 'अपना RFID कार्ड टैप करें या ID दर्ज करें'}
                </p>
              </div>
              <Input
                type="text"
                placeholder={language === 'en' ? 'Enter RFID / Employee ID' : 'RFID / कर्मचारी ID दर्ज करें'}
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                className="h-14 text-lg text-center font-mono tracking-widest"
                maxLength={10}
              />
              <Button
                onClick={handleRfidSubmit}
                disabled={rfidInput.length < 4 || isVerifying}
                className="w-full h-14 text-lg font-bold bg-primary"
              >
                {isVerifying ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  language === 'en' ? 'Verify' : 'सत्यापित करें'
                )}
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              setShowVerification(false);
              setVerificationMethod(null);
            }}
            className="w-full"
          >
            {language === 'en' ? 'Cancel' : 'रद्द करें'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInModule;
