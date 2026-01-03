import { useState } from 'react';
import { Camera, X, MapPin, Clock, Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task, Language } from '@/pages/WorkerPortal';

interface EvidenceUploadProps {
  language: Language;
  type: 'before' | 'after';
  task: Task;
  onClose: () => void;
  onUpload: () => void;
}

const EvidenceUpload = ({ language, type, task, onClose, onUpload }: EvidenceUploadProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  const handleCapture = () => {
    // Simulate camera capture
    setShowCamera(true);
    setTimeout(() => {
      // Simulate captured image (in real app, use camera API)
      setCapturedImage('captured');
      setShowCamera(false);
    }, 1500);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      onUpload();
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div>
            <h3 className="font-bold text-lg text-foreground">
              {type === 'before' 
                ? (language === 'en' ? 'Before Photo' : 'पहले की फोटो')
                : (language === 'en' ? 'After Photo' : 'बाद की फोटो')
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? task.title : task.titleHi}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Auto-tagged Info */}
        <div className="flex items-center gap-4 px-4 py-3 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{language === 'en' ? task.location : task.locationHi}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{currentTime} IST</span>
          </div>
        </div>

        {/* Camera / Preview Area */}
        <div className="p-4">
          {!capturedImage && !showCamera && (
            <div 
              onClick={handleCapture}
              className="aspect-[4/3] bg-muted rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <p className="font-semibold text-foreground">
                {language === 'en' ? 'Tap to Take Photo' : 'फोटो लेने के लिए टैप करें'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' 
                  ? 'GPS & timestamp will be auto-tagged' 
                  : 'GPS और समय स्वचालित रूप से जोड़ा जाएगा'
                }
              </p>
            </div>
          )}

          {showCamera && (
            <div className="aspect-[4/3] bg-foreground/90 rounded-xl flex items-center justify-center">
              <div className="text-center text-header-foreground">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-3" />
                <p>{language === 'en' ? 'Capturing...' : 'कैप्चर हो रहा है...'}</p>
              </div>
            </div>
          )}

          {capturedImage && !showCamera && (
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Simulated captured image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-status-success/10 to-primary/10" />
                <div className="relative text-center">
                  <CheckCircle2 className="h-12 w-12 text-status-success mx-auto mb-2" />
                  <p className="font-semibold text-foreground">
                    {language === 'en' ? 'Photo Captured!' : 'फोटो कैप्चर हो गई!'}
                  </p>
                </div>
                {/* GPS Tag Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-status-success" />
                    28.7041° N, 77.1025° E
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-status-success" />
                    {currentTime}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleRetake} className="h-12">
                  <Camera className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Retake' : 'फिर से लें'}
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="h-12 bg-status-success hover:bg-status-success/90 text-status-success-foreground"
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Upload' : 'अपलोड करें'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="px-4 pb-4">
          <div className="p-3 bg-status-warning/10 rounded-lg border border-status-warning/30">
            <p className="text-sm text-status-warning font-medium">
              {type === 'before'
                ? (language === 'en' 
                    ? '📸 Capture the issue clearly before starting work' 
                    : '📸 काम शुरू करने से पहले समस्या को स्पष्ट रूप से कैप्चर करें')
                : (language === 'en'
                    ? '📸 Show the completed work clearly for verification'
                    : '📸 सत्यापन के लिए पूर्ण कार्य स्पष्ट रूप से दिखाएं')
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceUpload;
