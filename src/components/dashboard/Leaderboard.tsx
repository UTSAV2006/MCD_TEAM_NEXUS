import { Trophy, TrendingUp, Medal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ZoneData {
  rank: number;
  zone: string;
  supervisor: string;
  attendance: number;
  tasksCleared: number;
  efficiency: number;
}

const leaderboardData: ZoneData[] = [
  { rank: 1, zone: 'South Delhi', supervisor: 'A. Singh', attendance: 98.5, tasksCleared: 156, efficiency: 97 },
  { rank: 2, zone: 'Rohini', supervisor: 'P. Verma', attendance: 96.2, tasksCleared: 142, efficiency: 94 },
  { rank: 3, zone: 'Dwarka', supervisor: 'M. Kumar', attendance: 94.8, tasksCleared: 138, efficiency: 92 },
  { rank: 4, zone: 'Shahdara', supervisor: 'R. Gupta', attendance: 93.1, tasksCleared: 125, efficiency: 89 },
  { rank: 5, zone: 'Karol Bagh', supervisor: 'S. Sharma', attendance: 91.4, tasksCleared: 118, efficiency: 86 },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-status-warning" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
    return <span className="text-sm font-medium text-muted-foreground">{rank}</span>;
  };

  const getAttendanceColor = (value: number) => {
    if (value >= 95) return 'text-status-success';
    if (value >= 90) return 'text-status-warning';
    return 'text-status-danger';
  };

  return (
    <div className="dashboard-card h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Daily Performance Leaderboard</h3>
          <p className="text-sm text-muted-foreground">Top zones by efficiency</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-status-success font-medium">
          <TrendingUp className="h-3 w-3" />
          <span>+5% avg</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto -mx-5">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12 text-center pl-5">Rank</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead className="hidden sm:table-cell">Supervisor</TableHead>
              <TableHead className="text-right">Attendance</TableHead>
              <TableHead className="text-right pr-5 hidden md:table-cell">Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((zone) => (
              <TableRow 
                key={zone.rank} 
                className={cn(
                  "cursor-pointer transition-colors",
                  zone.rank === 1 && "bg-status-warning/5"
                )}
              >
                <TableCell className="text-center pl-5">
                  <div className="flex items-center justify-center w-6 h-6">
                    {getRankIcon(zone.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{zone.zone}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{zone.supervisor}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {zone.supervisor}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn("font-semibold", getAttendanceColor(zone.attendance))}>
                    {zone.attendance}%
                  </span>
                </TableCell>
                <TableCell className="text-right pr-5 hidden md:table-cell">
                  <span className="font-medium text-foreground">{zone.tasksCleared}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <button className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-center">
        View Full Rankings →
      </button>
    </div>
  );
};

export default Leaderboard;
