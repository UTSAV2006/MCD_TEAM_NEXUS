import { MapPin, Clock, Zap, CheckCircle2, Play, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task, Language } from '@/pages/WorkerPortal';

interface TaskCardProps {
  task: Task;
  language: Language;
  translations: Record<string, string>;
  onStart: () => void;
  onComplete: () => void;
}

const TaskCard = ({ task, language, translations: t, onStart, onComplete }: TaskCardProps) => {
  const priorityConfig = {
    high: {
      bg: 'bg-status-danger/10',
      border: 'border-status-danger/30',
      badge: 'bg-status-danger/15 text-status-danger',
      label: t.high,
    },
    medium: {
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/30',
      badge: 'bg-status-warning/15 text-status-warning',
      label: t.medium,
    },
    low: {
      bg: 'bg-muted/50',
      border: 'border-border',
      badge: 'bg-muted text-muted-foreground',
      label: t.low,
    },
  };

  const config = priorityConfig[task.priority];
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <div className={cn(
      "dashboard-card transition-all duration-300",
      isCompleted && "opacity-60",
      isInProgress && `${config.bg} ${config.border}`,
      task.priority === 'high' && !isCompleted && "ring-2 ring-status-danger/20"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={config.badge}>
              {config.label}
            </Badge>
            {isInProgress && (
              <Badge className="bg-primary/15 text-primary">
                {language === 'en' ? 'In Progress' : 'प्रगति पर'}
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-status-success/15 text-status-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {language === 'en' ? 'Done' : 'पूर्ण'}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-foreground leading-tight">
            {language === 'en' ? task.title : task.titleHi}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">+{task.points}</p>
          <p className="text-xs text-muted-foreground">{language === 'en' ? 'pts' : 'अंक'}</p>
        </div>
      </div>

      {/* Location & Time */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{language === 'en' ? task.location : task.locationHi}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>{task.distance}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{task.timeLimit}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isCompleted && (
        <div className="grid grid-cols-1 gap-2">
          {!isInProgress ? (
            <Button
              onClick={onStart}
              className="h-14 text-lg font-bold bg-primary hover:bg-primary/90"
            >
              <Play className="h-5 w-5 mr-2" />
              {t.startTask}
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="h-14 text-lg font-bold bg-status-success hover:bg-status-success/90 text-status-success-foreground"
            >
              <Camera className="h-5 w-5 mr-2" />
              {t.completeTask}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
