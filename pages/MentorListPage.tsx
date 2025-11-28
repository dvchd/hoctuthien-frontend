
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, AvailabilitySlot, AVAILABLE_TOPICS, PaymentStatus } from '../types';
import { api } from '../services/api';
import { Filter, Clock, X, Loader2, Star, SlidersHorizontal, ChevronDown, ChevronUp, Calendar as CalendarIcon, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface MentorListPageProps {
  user: User;
}

type AvailabilityFrame = 'all' | 'today' | 'week';

export const MentorListPage: React.FC<MentorListPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<User[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>(''); // Exact date
  const [availabilityFrame, setAvailabilityFrame] = useState<AvailabilityFrame>('all'); // Range
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minRating, setMinRating] = useState<number>(0);
  
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  
  // Booking Confirmation State
  const [confirmSlot, setConfirmSlot] = useState<AvailabilitySlot | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorsData, slotsData] = await Promise.all([
          api.mentors.list(),
          api.slots.list()
        ]);
        setMentors(mentorsData);
        setSlots(slotsData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initiateBooking = async (mentor: User, slot: AvailabilitySlot) => {
    // 1. Activation Check
    if (!user.isActivated) {
      alert("Bạn cần kích hoạt tài khoản (ủng hộ 10.000đ) để có thể đặt lịch.");
      navigate('/activation');
      return;
    }

    // 2. Debt Check (Unpaid finished sessions)
    const myBookings = await api.bookings.list(user.id);
    const now = new Date();
    const unpaidDebt = myBookings.filter(b => {
      const isFinished = new Date(b.endTime) < now;
      return isFinished && b.paymentStatus === PaymentStatus.UNPAID;
    });
    
    if (unpaidDebt.length > 0) {
      alert(`Bạn có ${unpaidDebt.length} buổi học đã kết thúc nhưng chưa thanh toán. Vui lòng thanh toán trước khi đặt lịch mới.`);
      navigate('/schedule');
      return;
    }

    // Open Confirmation Modal
    setConfirmSlot(slot);
  };

  const confirmBooking = async () => {
    if (!selectedMentor || !confirmSlot) return;

    try {
      const durationHours = (new Date(confirmSlot.endTime).getTime() - new Date(confirmSlot.startTime).getTime()) / 3600000;
      const estimatedCost = Math.ceil((selectedMentor.hourlyRate || 0) * durationHours);

      await api.bookings.create({
        mentorId: selectedMentor.id,
        menteeId: user.id,
        startTime: confirmSlot.startTime,
        endTime: confirmSlot.endTime,
        cost: estimatedCost
      });

      // Refresh slots
      const newSlots = await api.slots.list();
      setSlots(newSlots);
      
      // Close Modals
      setConfirmSlot(null);
      setSelectedMentor(null);

      // Navigate
      alert("Đặt lịch thành công! Bạn có thể xem lịch trong mục 'Lịch đã đặt'.");
      navigate(`/schedule`);
    } catch (error) {
      alert("Đặt lịch thất bại. Vui lòng thử lại.");
    }
  };

  // Filter Logic
  const filteredMentors = mentors.filter(mentor => {
    // 1. Topic
    if (topicFilter && !mentor.topics?.includes(topicFilter)) return false;
    
    // 2. Exact Date (from Date Picker)
    if (dateFilter) {
      const hasSlotOnDate = slots.some(slot => 
        slot.mentorId === mentor.id && 
        !slot.isBooked && 
        slot.startTime.startsWith(dateFilter)
      );
      if (!hasSlotOnDate) return false;
    }

    // 3. Availability Frame (Dropdown)
    if (availabilityFrame !== 'all') {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + 7);

      const hasSlotInFrame = slots.some(slot => {
        if (slot.mentorId !== mentor.id || slot.isBooked) return false;
        const slotDate = new Date(slot.startTime);
        
        if (availabilityFrame === 'today') {
          return slotDate.toDateString() === now.toDateString();
        }
        if (availabilityFrame === 'week') {
          return slotDate >= now && slotDate <= endOfWeek;
        }
        return false;
      });

      if (!hasSlotInFrame) return false;
    }

    // 4. Price Range
    const rate = mentor.hourlyRate || 0;
    if (rate < minPrice || rate > maxPrice) return false;

    // 5. Rating
    const rating = mentor.rating || 0;
    if (rating < minRating) return false;
    
    return true;
  });

  const getAvailableSlots = (mentorId: string) => {
    // POLICY: Only show slots starting at least 30 minutes from now
    // This gives mentors a buffer to prepare and prevents "surprise" bookings
    const minBookingTime = new Date(Date.now() + 30 * 60000);

    return slots
      .filter(s => s.mentorId === mentorId && !s.isBooked && new Date(s.startTime) > minBookingTime)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  // Helper to group slots by date for the modal
  const groupSlotsByDate = (mentorSlots: AvailabilitySlot[]) => {
    const groups: { [key: string]: AvailabilitySlot[] } = {};
    mentorSlots.forEach(slot => {
      const dateKey = new Date(slot.startTime).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  };

  const resetFilters = () => {
    setTopicFilter('');
    setDateFilter('');
    setAvailabilityFrame('all');
    setMinPrice(0);
    setMaxPrice(500000);
    setMinRating(0);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Activation Warning Banner */}
      {!user.isActivated && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between mb-8">
           <div className="flex items-center gap-3 text-orange-800">
             <Lock size={20} />
             <span>Bạn chưa kích hoạt tài khoản. Bạn có thể xem danh sách Mentor nhưng cần kích hoạt để đặt lịch.</span>
           </div>
           <button 
             onClick={() => navigate('/activation')}
             className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700"
           >
             Kích hoạt ngay
           </button>
        </div>
      )}

      {/* Header & Main Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Tìm kiếm Mentor</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Topic Filter */}
            <div className="relative min-w-[200px] w-full sm:w-auto flex items-center">
              <select 
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:outline-none focus:border-brand-500 w-full shadow-sm"
              >
                <option value="">Tất cả lĩnh vực</option>
                {AVAILABLE_TOPICS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Quick Availability */}
            <div className="relative min-w-[180px] w-full sm:w-auto flex items-center">
              <select
                value={availabilityFrame}
                onChange={(e) => setAvailabilityFrame(e.target.value as AvailabilityFrame)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:border-brand-500 w-full"
              >
                <option value="all">Thời gian: Tất cả</option>
                <option value="today">Rảnh hôm nay</option>
                <option value="week">Rảnh tuần này</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all shadow-sm ${showFilters ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <SlidersHorizontal size={18} />
              Bộ lọc
              {showFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Date Specific */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày cụ thể</label>
                <input 
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức ủng hộ: {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ
                </label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="0" max="500000" step="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0đ</span>
                  <span>500k+</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá tối thiểu</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinRating(star)}
                      className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors flex items-center gap-1 ${minRating === star ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {star === 0 ? 'Tất cả' : <>{star} <Star size={12} fill="currentColor" /></>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button onClick={resetFilters} className="text-gray-500 text-sm hover:text-gray-800 underline">
                Xoá bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Filter className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-500 text-lg">Không tìm thấy Mentor nào phù hợp với bộ lọc của bạn.</p>
            <button onClick={resetFilters} className="mt-2 text-brand-600 font-medium hover:underline">Xoá bộ lọc để xem tất cả</button>
          </div>
        )}
        
        {filteredMentors.map(mentor => {
          const mentorSlots = getAvailableSlots(mentor.id);
          const slotsCount = mentorSlots.length;
          const nextSlots = mentorSlots.slice(0, 3);

          return (
            <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-4">
                    <Link to={`/profile/${mentor.id}`}>
                      <img src={mentor.avatarUrl} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-50 hover:border-brand-200 transition-colors" />
                    </Link>
                    <div>
                      <Link to={`/profile/${mentor.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 hover:text-brand-600 transition-colors">{mentor.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                        <Star size={14} fill="currentColor" />
                        <span>{mentor.rating?.toFixed(1) || 'New'}</span>
                        <span className="text-gray-400 font-normal text-xs ml-1">({mentor.reviewCount || 0} đánh giá)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                  {mentor.topics?.map(tid => {
                    const topic = AVAILABLE_TOPICS.find(t => t.id === tid);
                    return topic ? <span key={tid} className="text-xs bg-brand-50 px-2 py-0.5 rounded text-brand-700 font-medium">{topic.name}</span> : null;
                  })}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">{mentor.bio}</p>
                
                {/* Visual Schedule Preview */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium">Lịch trống tiếp theo:</span>
                    {slotsCount > 3 && <span className="text-brand-600">+{slotsCount - 3} buổi khác</span>}
                  </div>
                  {nextSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {nextSlots.map(slot => {
                         const d = new Date(slot.startTime);
                         return (
                           <button 
                             key={slot.id}
                             onClick={() => { setSelectedMentor(mentor); }} 
                             className="text-xs border border-green-200 bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                           >
                             {d.getDate()}/{d.getMonth() + 1} {d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                           </button>
                         )
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block">
                      Hiện chưa có lịch trống
                    </div>
                  )}
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
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-200'
                  }`}
                >
                  Đặt lịch
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Schedule Selection */}
      {selectedMentor && !confirmSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-brand-600 p-4 flex justify-between items-center text-white shrink-0">
                 <div>
                   <h3 className="font-bold text-lg">Đặt lịch với {selectedMentor.name}</h3>
                   <div className="text-brand-100 text-xs flex items-center gap-1">
                     <Star size={12} fill="currentColor"/> {selectedMentor.rating} ({selectedMentor.reviewCount} đánh giá)
                   </div>
                 </div>
                 <button onClick={() => setSelectedMentor(null)} className="hover:bg-brand-700 p-1.5 rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                 <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 text-sm text-blue-800 flex items-start gap-2">
                    <Clock size={16} className="mt-0.5 shrink-0"/>
                    <div>
                       Chi phí cho mỗi giờ học là <strong>{selectedMentor.hourlyRate?.toLocaleString()}đ</strong>. 
                       <br/>Bạn có thể thanh toán trước hoặc sau buổi học.
                    </div>
                 </div>

                 {getAvailableSlots(selectedMentor.id).length === 0 ? (
                    <div className="text-center py-10">
                      <CalendarIcon size={48} className="mx-auto text-gray-300 mb-2"/>
                      <p className="text-gray-500">Mentor này hiện chưa có lịch trống phù hợp.</p>
                      <p className="text-xs text-gray-400 mt-1">(Lưu ý: Chỉ hiển thị các khung giờ bắt đầu sau ít nhất 30 phút)</p>
                      <button onClick={() => setSelectedMentor(null)} className="mt-4 text-brand-600 hover:underline">
                        Quay lại tìm kiếm
                      </button>
                    </div>
                 ) : (
                   <div className="space-y-6">
                      {Object.entries(groupSlotsByDate(getAvailableSlots(selectedMentor.id))).map(([dateStr, daySlots]) => (
                        <div key={dateStr}>
                           <h4 className="font-bold text-gray-800 mb-3 sticky top-0 bg-white py-1 border-b border-gray-100">
                             {dateStr}
                           </h4>
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                             {daySlots.map(slot => {
                                const start = new Date(slot.startTime);
                                const end = slot.endTime ? new Date(slot.endTime) : new Date(start.getTime() + 60*60000);
                                const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);

                                return (
                                  <button 
                                    key={slot.id}
                                    onClick={() => { initiateBooking(selectedMentor, slot); }}
                                    className="relative border border-brand-200 bg-white p-3 rounded-lg hover:bg-brand-50 hover:border-brand-500 transition-all text-left group shadow-sm"
                                  >
                                     <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-brand-700 text-lg">
                                         {start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                       </span>
                                       <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                         {durationMin}p
                                       </span>
                                     </div>
                                     <div className="text-xs text-gray-400 group-hover:text-brand-600 flex items-center gap-1">
                                       Đến {end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} <ArrowRight size={10}/>
                                     </div>
                                  </button>
                                );
                             })}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* MODAL 2: Confirmation */}
      {selectedMentor && confirmSlot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Xác nhận đặt lịch</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Mentor:</span>
                <span className="font-semibold">{selectedMentor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày:</span>
                <span className="font-semibold">{new Date(confirmSlot.startTime).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="font-semibold text-brand-600">
                  {new Date(confirmSlot.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} - 
                  {new Date(confirmSlot.endTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-500">Dự kiến ủng hộ:</span>
                <span className="font-bold text-lg text-brand-700">
                  {Math.ceil((selectedMentor.hourlyRate || 0) * ((new Date(confirmSlot.endTime).getTime() - new Date(confirmSlot.startTime).getTime()) / 3600000)).toLocaleString()} đ
                </span>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-6 flex gap-2">
               <AlertCircle size={16} className="shrink-0 mt-0.5"/>
               <p>Bằng việc xác nhận, bạn cam kết tham gia buổi học đúng giờ. Bạn có thể hủy lịch miễn phí nếu buổi học chưa bắt đầu và chưa thanh toán.</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmSlot(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md transition-all hover:shadow-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
