import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  valueColor?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  actionLabel?: string;
  onAction?: () => void;
}

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  valueColor = 'default',
  progress,
  actionLabel,
  onAction,
}: SummaryCardProps) => {
  const valueColors = {
    default: 'text-foreground',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-status-success' : trend === 'down' ? 'text-status-danger' : 'text-muted-foreground';

  return (
    <div className="dashboard-card group animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className={cn("kpi-value animate-count-up", valueColors[valueColor])}>
          {value.toLocaleString()}
        </p>
        <p className="kpi-label">{subtitle}</p>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Check-in Rate</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-status-success rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {actionLabel && (
        <button 
          onClick={onAction}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
};

export default SummaryCard;
