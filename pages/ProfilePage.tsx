
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, UserRole, AVAILABLE_TOPICS } from '../types';
import { api } from '../services/api';
import { Loader2, Calendar, Star, MapPin, Shield, DollarSign, BookOpen, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<User & { stats: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const data = await api.users.get(userId);
        setProfile(data);
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;
  if (!profile) return <div className="text-center py-20">Không tìm thấy người dùng.</div>;

  const isMentor = profile.role === UserRole.MENTOR;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 relative">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-blue-400"></div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6 gap-6">
             <img 
               src={profile.avatarUrl} 
               alt={profile.name} 
               className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
             />
             <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-1">
                 <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                 {profile.isActivated && (
                   <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                     <Shield size={12} fill="currentColor"/> Đã xác thực
                   </span>
                 )}
               </div>
               <p className="text-gray-500 font-medium">
                 {isMentor ? 'Giảng viên (Mentor)' : 'Học viên (Mentee)'} 
                 <span className="mx-2">•</span> 
                 Tham gia từ {profile.stats.joinDate}
               </p>
             </div>
             
             {isMentor && (
               <div className="shrink-0 mt-4 md:mt-0">
                  <Link to="/mentors" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 shadow-lg shadow-brand-100 transition-transform hover:-translate-y-0.5 inline-block">
                    Đặt lịch ngay
                  </Link>
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
               <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                  <DollarSign size={16}/> Tổng đóng góp
               </div>
               <div className="text-xl font-bold text-brand-600">{profile.stats.totalDonated.toLocaleString()} đ</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
               <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                  <BookOpen size={16}/> Số buổi đã tham gia
               </div>
               <div className="text-xl font-bold text-gray-800">{profile.stats.totalSessions} buổi</div>
            </div>
            {isMentor && (
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                 <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1">
                    <Star size={16}/> Đánh giá
                 </div>
                 <div className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                   {profile.rating} <span className="text-xs text-gray-400 font-normal">({profile.reviewCount} reviews)</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: About */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Giới thiệu</h3>
             <p className="text-gray-600 leading-relaxed whitespace-pre-line">
               {profile.bio || "Thành viên này chưa cập nhật phần giới thiệu."}
             </p>
          </div>

          {isMentor && profile.topics && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="text-lg font-bold text-gray-800 mb-4">Lĩnh vực chuyên môn</h3>
               <div className="flex flex-wrap gap-2">
                 {profile.topics.map(tId => {
                   const t = AVAILABLE_TOPICS.find(topic => topic.id === tId);
                   return t ? (
                     <span key={tId} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium border border-brand-100">
                       {t.icon} {t.name}
                     </span>
                   ) : null;
                 })}
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Activity Stream (Mocked) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
               {/* Mock Activity Items */}
               <div className="flex gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1.5 rounded-full h-fit">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Đã quyên góp <span className="font-bold">50.000đ</span></p>
                    <p className="text-xs text-gray-400">2 ngày trước</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-full h-fit">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Hoàn thành buổi học với Mentor</p>
                    <p className="text-xs text-gray-400">1 tuần trước</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="mt-1 bg-purple-100 text-purple-600 p-1.5 rounded-full h-fit">
                    <Shield size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Kích hoạt tài khoản thành công</p>
                    <p className="text-xs text-gray-400">1 tháng trước</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
