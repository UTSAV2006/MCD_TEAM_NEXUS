import React from 'react';
import { Trophy, Medal, Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data as per PPT's performance tracking
const topPerformers = [
  { rank: 1, name: "Rajesh Kumar", zone: "Rohini", score: 98, tasks: 142, status: "Elite" },
  { rank: 2, name: "Anita Sharma", zone: "South Delhi", score: 95, tasks: 138, status: "Pro" },
  { rank: 3, name: "Vikram Singh", zone: "Najafgarh", score: 92, tasks: 125, status: "Rising Star" },
  { rank: 4, name: "Suresh Meena", zone: "City-SP", score: 88, tasks: 110, status: "Active" },
  { rank: 5, name: "Pooja Devi", zone: "Shahdara", score: 85, tasks: 105, status: "Active" },
];

const Leaderboard = () => {
  return (
    <div className="dashboard-card animate-fade-in-up bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Field Performance Leaderboard</h3>
            <p className="text-xs text-slate-500">Based on verified work-site reports</p>
          </div>
        </div>
        <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
          Updated Live
        </Badge>
      </div>

      <div className="space-y-4">
        {topPerformers.map((emp) => (
          <div key={emp.rank} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400">
                {emp.rank === 1 ? <Medal className="text-yellow-500" /> : `#${emp.rank}`}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{emp.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{emp.zone} Zone</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-indigo-600">{emp.score}%</p>
                <p className="text-[10px] text-slate-400">Perf. Score</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">{emp.tasks}</p>
                <p className="text-[10px] text-slate-400">Tasks Verified</p>
              </div>
              <div className="flex items-center justify-center bg-indigo-50 p-1 rounded">
                 <ArrowUpRight className="h-3 w-3 text-indigo-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-xs font-semibold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors">
        View Full Workforce Analytics
      </button>
    </div>
  );
};

export default Leaderboard;