import { useState, useEffect } from 'react';
import { Globe, MapPin, Camera, CheckCircle2, Clock, Trophy, Star, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import WorkerHeader from '@/components/worker/WorkerHeader';
import CheckInModule from '@/components/worker/CheckInModule';
import TaskCard from '@/components/worker/TaskCard';
import PerformanceSnapshot from '@/components/worker/PerformanceSnapshot';
import EvidenceUpload from '@/components/worker/EvidenceUpload';

export type Language = 'en' | 'hi';

export interface Task {
  id: string;
  title: string;
  titleHi: string;
  location: string;
  locationHi: string;
  priority: 'high' | 'medium' | 'low';
  status: 'assigned' | 'in_progress' | 'completed';
  distance: string;
  timeLimit: string;
  points: number;
}

const WorkerPortal = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEvidenceUpload, setShowEvidenceUpload] = useState(false);
  const [evidenceType, setEvidenceType] = useState<'before' | 'after'>('before');
  const { toast } = useToast();

  const translations = {
    en: {
      title: 'MCD Worker Portal',
      subtitle: 'Field Operations',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      checkedIn: 'Checked In',
      outsideZone: 'Outside Work Zone',
      verifyingLocation: 'Verifying Location...',
      myTasks: 'My Tasks',
      noTasks: 'No tasks assigned',
      points: 'Points Today',
      rank: 'Zone Rank',
      startTask: 'Start Task',
      completeTask: 'Complete Task',
      uploadBefore: 'Upload Before Photo',
      uploadAfter: 'Upload After Photo',
      takePhoto: 'Take Photo',
      distance: 'Distance',
      timeLimit: 'Time Limit',
      priority: 'Priority',
      high: 'Urgent',
      medium: 'Normal',
      low: 'Low',
    },
    hi: {
      title: 'MCD कर्मचारी पोर्टल',
      subtitle: 'फील्ड ऑपरेशंस',
      checkIn: 'चेक इन',
      checkOut: 'चेक आउट',
      checkedIn: 'चेक इन हो गया',
      outsideZone: 'कार्य क्षेत्र के बाहर',
      verifyingLocation: 'स्थान सत्यापित हो रहा है...',
      myTasks: 'मेरे कार्य',
      noTasks: 'कोई कार्य नहीं',
      points: 'आज के अंक',
      rank: 'जोन रैंक',
      startTask: 'कार्य शुरू करें',
      completeTask: 'कार्य पूरा करें',
      uploadBefore: 'पहले की फोटो अपलोड करें',
      uploadAfter: 'बाद की फोटो अपलोड करें',
      takePhoto: 'फोटो लें',
      distance: 'दूरी',
      timeLimit: 'समय सीमा',
      priority: 'प्राथमिकता',
      high: 'अत्यावश्यक',
      medium: 'सामान्य',
      low: 'कम',
    },
  };

  const t = translations[language];

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Clear Water Logging at Street 4',
      titleHi: 'स्ट्रीट 4 पर जल भराव साफ करें',
      location: 'Rohini Sector 7, Block C',
      locationHi: 'रोहिणी सेक्टर 7, ब्लॉक C',
      priority: 'high',
      status: 'assigned',
      distance: '0.5 km',
      timeLimit: '30 min',
      points: 50,
    },
    {
      id: '2',
      title: 'Remove Fallen Tree Branch',
      titleHi: 'गिरी हुई पेड़ की शाखा हटाएं',
      location: 'Rohini Sector 8, Main Road',
      locationHi: 'रोहिणी सेक्टर 8, मुख्य सड़क',
      priority: 'medium',
      status: 'assigned',
      distance: '1.2 km',
      timeLimit: '45 min',
      points: 35,
    },
    {
      id: '3',
      title: 'Fix Broken Street Light',
      titleHi: 'टूटी स्ट्रीट लाइट ठीक करें',
      location: 'Rohini Sector 7, Park Area',
      locationHi: 'रोहिणी सेक्टर 7, पार्क क्षेत्र',
      priority: 'low',
      status: 'assigned',
      distance: '0.8 km',
      timeLimit: '60 min',
      points: 25,
    },
  ]);

  // Simulate geofence check
  useEffect(() => {
    const checkGeofence = () => {
      setCheckingLocation(true);
      // Simulate GPS check - in real app, use navigator.geolocation
      setTimeout(() => {
        setIsWithinGeofence(true); // Simulate being within geofence
        setCheckingLocation(false);
      }, 2000);
    };

    checkGeofence();
    
    // Recheck location every 30 seconds
    const interval = setInterval(checkGeofence, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast({
      title: language === 'en' ? 'Check-In Successful!' : 'चेक-इन सफल!',
      description: language === 'en' 
        ? 'You are now on duty. GPS location recorded.' 
        : 'आप अब ड्यूटी पर हैं। GPS स्थान दर्ज किया गया।',
    });
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast({
      title: language === 'en' ? 'Check-Out Successful!' : 'चेक-आउट सफल!',
      description: language === 'en' 
        ? 'Your shift has ended. Total points: 85' 
        : 'आपकी शिफ्ट समाप्त हुई। कुल अंक: 85',
    });
  };

  const handleStartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'in_progress' as const } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask({ ...task, status: 'in_progress' });
      setEvidenceType('before');
      setShowEvidenceUpload(true);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setEvidenceType('after');
      setShowEvidenceUpload(true);
    }
  };

  const handleEvidenceUploaded = () => {
    if (evidenceType === 'after' && selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? { ...task, status: 'completed' as const } : task
      ));
      toast({
        title: language === 'en' ? 'Task Completed!' : 'कार्य पूरा हुआ!',
        description: language === 'en' 
          ? `+${selectedTask.points} points earned` 
          : `+${selectedTask.points} अंक अर्जित`,
      });
    }
    setShowEvidenceUpload(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <WorkerHeader 
        language={language} 
        onLanguageChange={setLanguage}
        isCheckedIn={isCheckedIn}
      />

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Check-In Module */}
        <CheckInModule
          language={language}
          translations={t}
          isCheckedIn={isCheckedIn}
          isWithinGeofence={isWithinGeofence}
          checkingLocation={checkingLocation}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />

        {/* Tasks Section */}
        {isCheckedIn && (
          <section className="space-y-3 animate-fade-in-up">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t.myTasks}
              <Badge variant="secondary" className="ml-2">
                {tasks.filter(t => t.status !== 'completed').length}
              </Badge>
            </h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  language={language}
                  translations={t}
                  onStart={() => handleStartTask(task.id)}
                  onComplete={() => handleCompleteTask(task.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Performance Snapshot - Fixed at bottom */}
      <PerformanceSnapshot 
        language={language}
        translations={t}
        points={85}
        rank={3}
        totalInZone={24}
      />

      {/* Evidence Upload Modal */}
      {showEvidenceUpload && selectedTask && (
        <EvidenceUpload
          language={language}
          type={evidenceType}
          task={selectedTask}
          onClose={() => setShowEvidenceUpload(false)}
          onUpload={handleEvidenceUploaded}
        />
      )}
    </div>
  );
};

export default WorkerPortal;
