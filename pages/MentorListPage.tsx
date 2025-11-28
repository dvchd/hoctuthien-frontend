import React, { useState } from 'react';
import { User, AvailabilitySlot, AVAILABLE_TOPICS } from '../types';
import { Filter, Clock, X } from 'lucide-react';

interface MentorListPageProps {
  mentors: User[];
  slots: AvailabilitySlot[];
  onBook: (mentor: User, slot: AvailabilitySlot) => void;
}

export const MentorListPage: React.FC<MentorListPageProps> = ({ mentors, slots, onBook }) => {
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);

  // Filter Logic
  const filteredMentors = mentors.filter(mentor => {
    // 1. Filter by Topic
    if (topicFilter && !mentor.topics?.includes(topicFilter)) return false;
    
    // 2. Filter by Date Availability
    if (dateFilter) {
      const hasSlotOnDate = slots.some(slot => 
        slot.mentorId === mentor.id && 
        !slot.isBooked && 
        slot.startTime.startsWith(dateFilter)
      );
      if (!hasSlotOnDate) return false;
    }
    
    return true;
  });

  const getAvailableSlots = (mentorId: string) => {
    return slots
      .filter(s => s.mentorId === mentorId && !s.isBooked && new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Tìm kiếm Mentor</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <select 
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-brand-500 w-full"
            >
              <option value="">Tất cả lĩnh vực</option>
              {AVAILABLE_TOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter size={16} />
            </div>
          </div>

          <div className="relative">
             <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:border-brand-500 w-full"
              placeholder="Chọn ngày"
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Không tìm thấy Mentor nào phù hợp với bộ lọc của bạn.
          </div>
        )}
        {filteredMentors.map(mentor => {
          const mentorSlots = getAvailableSlots(mentor.id);
          const slotsCount = mentorSlots.length;

          return (
            <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-6 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <img src={mentor.avatarUrl} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-50" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mentor.topics?.map(tid => {
                        const topic = AVAILABLE_TOPICS.find(t => t.id === tid);
                        return topic ? <span key={tid} className="text-xs bg-brand-50 px-2 py-1 rounded text-brand-700 font-medium">{topic.name}</span> : null;
                      })}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
                <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                   <Clock size={16} /> 
                   {slotsCount > 0 
                    ? <span className="text-green-600 font-medium">{slotsCount} lịch trống sắp tới</span>
                    : <span className="text-orange-500">Chưa có lịch trống</span>
                   }
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Ủng hộ/giờ</span>
                  <p className="font-bold text-brand-600 text-lg">{mentor.hourlyRate?.toLocaleString()} đ</p>
                </div>
                <button 
                  onClick={() => setSelectedMentor(mentor)}
                  disabled={slotsCount === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    slotsCount === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  Đặt lịch
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg">Đặt lịch với {selectedMentor.name}</h3>
                 <button onClick={() => setSelectedMentor(null)} className="hover:bg-brand-700 p-1 rounded"><X size={20}/></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                 <p className="text-sm text-gray-500 mb-4">Chọn khung giờ bạn muốn học. Số tiền ủng hộ sẽ được chuyển trực tiếp cho quỹ từ thiện.</p>
                 <div className="grid grid-cols-2 gap-3">
                    {getAvailableSlots(selectedMentor.id).map(slot => {
                      const start = new Date(slot.startTime);
                      const end = slot.endTime ? new Date(slot.endTime) : new Date(start.getTime() + 60*60000);
                      
                      return (
                        <button 
                          key={slot.id}
                          onClick={() => { onBook(selectedMentor, slot); setSelectedMentor(null); }}
                          className="border border-brand-200 bg-brand-50 p-3 rounded-lg hover:bg-brand-100 hover:border-brand-300 transition-all text-center"
                        >
                           <div className="font-bold text-brand-800 text-sm">
                             {start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                           </div>
                           <div className="text-xs text-brand-600 mt-1">
                             {start.toLocaleDateString('vi-VN', {day: 'numeric', month:'numeric'})}
                           </div>
                        </button>
                      );
                    })}
                    {getAvailableSlots(selectedMentor.id).length === 0 && (
                      <p className="col-span-2 text-center text-gray-500 py-4">Mentor này hiện chưa có thêm lịch trống.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};