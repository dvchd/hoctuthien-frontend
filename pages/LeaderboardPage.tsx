import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserRole, TimePeriod, RankingMetric, LeaderboardEntry } from '../types';
import { api } from '../services/api';
import { Trophy, Crown, Award, Loader2 } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.MENTOR);
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [metric, setMetric] = useState<RankingMetric>('donation');
  
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const result = await api.leaderboard.get(role, period, metric);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [role, period, metric]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const formatValue = (val: number) => {
    if (metric === 'donation') return val.toLocaleString('vi-VN') + ' đ';
    return val + ' buổi';
  };

  const getPeriodLabel = (p: TimePeriod) => {
    switch(p) {
      case 'day': return 'Hôm nay';
      case 'week': return 'Tuần này';
      case 'month': return 'Tháng này';
      case 'quarter': return 'Quý này';
      case 'year': return 'Năm nay';
      default: return p;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-800 flex items-center justify-center gap-3 mb-2">
          <Trophy className="text-yellow-500" size={32} /> Bảng Vinh Danh
        </h2>
        <p className="text-gray-600">Vinh danh những đóng góp tích cực cho cộng đồng Học Từ Thiện</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between">
        
        {/* Role Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button 
            onClick={() => setRole(UserRole.MENTOR)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.MENTOR ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Giảng viên (Mentor)
           </button>
           <button 
            onClick={() => setRole(UserRole.MENTEE)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.MENTEE ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Học viên (Mentee)
           </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
           <select 
             value={period} 
             onChange={(e) => setPeriod(e.target.value as TimePeriod)}
             className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
           >
              <option value="day">Theo Ngày</option>
              <option value="week">Theo Tuần</option>
              <option value="month">Theo Tháng</option>
              <option value="quarter">Theo Quý</option>
              <option value="year">Theo Năm</option>
           </select>

           <select 
             value={metric} 
             onChange={(e) => setMetric(e.target.value as RankingMetric)}
             className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
           >
              <option value="donation">Top Đóng Góp (Tiền)</option>
              <option value="sessions">Top Chăm Chỉ (Buổi học)</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>
      ) : (
        <>
          {/* Podium for Top 3 */}
          <div className="flex justify-center items-end gap-2 sm:gap-4 mb-12 min-h-[280px]">
             {/* Rank 2 */}
             {top3[1] && (
                <div className="flex flex-col items-center w-1/3 max-w-[140px]">
                   <div className="relative mb-2">
                     <Link to={`/profile/${top3[1].user.id}`}>
                       <img src={top3[1].user.avatarUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 shadow-md hover:scale-105 transition-transform cursor-pointer object-cover" />
                     </Link>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded text-xs shadow-sm">#2</div>
                   </div>
                   <div className="bg-gradient-to-t from-slate-100 to-white w-full h-40 rounded-t-lg border-x border-t border-slate-200 flex flex-col items-center justify-start pt-4 px-1 shadow-sm">
                      <Link to={`/profile/${top3[1].user.id}`} className="font-bold text-gray-800 text-center text-sm sm:text-base leading-tight hover:text-brand-600 mb-1">
                        {top3[1].user.name}
                      </Link>
                      <div className="text-brand-600 font-bold text-sm">{formatValue(top3[1].value)}</div>
                   </div>
                </div>
             )}
             
             {/* Rank 1 */}
             {top3[0] && (
                <div className="flex flex-col items-center z-10 w-1/3 max-w-[160px]">
                   <Crown className="text-yellow-500 mb-1 animate-bounce" size={32} />
                   <div className="relative mb-2">
                     <Link to={`/profile/${top3[0].user.id}`}>
                        <img src={top3[0].user.avatarUrl} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 shadow-lg hover:scale-105 transition-transform cursor-pointer object-cover" />
                     </Link>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-3 py-0.5 rounded text-sm shadow-sm">#1</div>
                   </div>
                   <div className="bg-gradient-to-t from-yellow-50 to-white w-full h-52 rounded-t-lg border-x border-t border-yellow-200 flex flex-col items-center justify-start pt-6 px-1 shadow-md">
                      <Link to={`/profile/${top3[0].user.id}`} className="font-bold text-gray-900 text-base sm:text-lg text-center leading-tight hover:text-brand-600 mb-1">
                        {top3[0].user.name}
                      </Link>
                      <div className="text-brand-600 font-bold text-lg sm:text-xl">{formatValue(top3[0].value)}</div>
                      <div className="mt-2 text-[10px] sm:text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full flex items-center gap-1 text-center">
                        <Award size={12} className="shrink-0"/> <span>Quán quân {getPeriodLabel(period)}</span>
                      </div>
                   </div>
                </div>
             )}

             {/* Rank 3 */}
             {top3[2] && (
                <div className="flex flex-col items-center w-1/3 max-w-[140px]">
                   <div className="relative mb-2">
                     <Link to={`/profile/${top3[2].user.id}`}>
                        <img src={top3[2].user.avatarUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-300 shadow-md hover:scale-105 transition-transform cursor-pointer object-cover" />
                     </Link>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-900 font-bold px-2 py-0.5 rounded text-xs shadow-sm">#3</div>
                   </div>
                   <div className="bg-gradient-to-t from-orange-50 to-white w-full h-32 rounded-t-lg border-x border-t border-orange-200 flex flex-col items-center justify-start pt-4 px-1 shadow-sm">
                      <Link to={`/profile/${top3[2].user.id}`} className="font-bold text-gray-800 text-center text-sm sm:text-base leading-tight hover:text-brand-600 mb-1">
                        {top3[2].user.name}
                      </Link>
                      <div className="text-brand-600 font-bold text-sm">{formatValue(top3[2].value)}</div>
                   </div>
                </div>
             )}
          </div>

          {/* Rest of the list */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <table className="w-full">
               <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                 <tr>
                   <th className="px-4 sm:px-6 py-4 text-left w-16 sm:w-20">Hạng</th>
                   <th className="px-4 sm:px-6 py-4 text-left">Thành viên</th>
                   <th className="px-4 sm:px-6 py-4 text-right">Thành tích</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {rest.map((entry) => (
                   <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-gray-400">#{entry.rank}</td>
                      <td className="px-4 sm:px-6 py-4 flex items-center gap-3">
                        <Link to={`/profile/${entry.user.id}`}>
                           <img src={entry.user.avatarUrl} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 object-cover hover:opacity-80 transition-opacity" />
                        </Link>
                        <Link to={`/profile/${entry.user.id}`} className="font-medium text-gray-800 hover:text-brand-600">
                          {entry.user.name}
                        </Link>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right font-mono font-medium text-brand-600 whitespace-nowrap">
                        {formatValue(entry.value)}
                      </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};