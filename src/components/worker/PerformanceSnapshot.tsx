import { Trophy, Star, TrendingUp, Users } from 'lucide-react';
import type { Language } from '@/pages/WorkerPortal';

interface PerformanceSnapshotProps {
  language: Language;
  translations: Record<string, string>;
  points: number;
  rank: number;
  totalInZone: number;
}

const PerformanceSnapshot = ({ 
  language, 
  translations: t,
  points, 
  rank, 
  totalInZone 
}: PerformanceSnapshotProps) => {
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Points */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-status-warning/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{points}</p>
              <p className="text-xs text-muted-foreground">{t.points}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-border" />

          {/* Rank */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground flex items-center gap-1">
                <span>{getRankEmoji(rank)}</span>
                <span>#{rank}</span>
              </p>
              <p className="text-xs text-muted-foreground">{t.rank}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-px bg-border" />

          {/* Zone Workers */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">{totalInZone}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'in zone' : 'क्षेत्र में'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress to next rank */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {language === 'en' ? 'Next rank: #2' : 'अगला रैंक: #2'}
            </span>
            <span>15 {language === 'en' ? 'pts needed' : 'अंक और'}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-status-warning to-status-success rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSnapshot;
