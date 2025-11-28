import React, { useState, useMemo, useEffect } from 'react';
import { User, AvailabilitySlot } from '../types';
import { api } from '../services/api';
import { Plus, Calendar as CalendarIcon, Trash2, Repeat, ChevronLeft, ChevronRight, Check, Clock, Loader2 } from 'lucide-react';

interface MentorSchedulePageProps {
  user: User;
}

const DAYS_OF_WEEK = [
  { id: 1, name: 'Thứ 2', short: 'T2' },
  { id: 2, name: 'Thứ 3', short: 'T3' },
  { id: 3, name: 'Thứ 4', short: 'T4' },
  { id: 4, name: 'Thứ 5', short: 'T5' },
  { id: 5, name: 'Thứ 6', short: 'T6' },
  { id: 6, name: 'Thứ 7', short: 'T7' },
  { id: 0, name: 'Chủ Nhật', short: 'CN' },
];

const DURATIONS = [
  { value: 30, label: '30 phút' },
  { value: 45, label: '45 phút' },
  { value: 60, label: '60 phút' },
  { value: 90, label: '90 phút' },
  { value: 120, label: '120 phút' },
];

export const MentorSchedulePage: React.FC<MentorSchedulePageProps> = ({ user }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'recurring'>('calendar');
  
  // --- CALENDAR LOGIC ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [singleTime, setSingleTime] = useState("09:00");
  const [singleDuration, setSingleDuration] = useState(60);

  // --- RECURRING LOGIC ---
  const [recurringPattern, setRecurringPattern] = useState<{[key: number]: string[]}>({});
  const [recurringDuration, setRecurringDuration] = useState(60);

  useEffect(() => {
    fetchSlots();
  }, [user.id]);

  const fetchSlots = async () => {
    try {
      const data = await api.slots.list(user.id);
      setSlots(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (date: Date, durationMinutes: number) => {
    const endTime = new Date(date.getTime() + durationMinutes * 60000);
    await api.slots.create({
      mentorId: user.id,
      startTime: date.toISOString(),
      endTime: endTime.toISOString()
    });
    fetchSlots();
  };

  const handleDeleteSlot = async (id: string) => {
    await api.slots.delete(id);
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleAddMultipleSlots = async (dates: Date[], durationMinutes: number) => {
    const newSlots = dates.map(date => ({
      mentorId: user.id,
      startTime: date.toISOString(),
      endTime: new Date(date.getTime() + durationMinutes * 60000).toISOString()
    }));
    await api.slots.createMultiple(newSlots);
    fetchSlots();
  };

  // --- HELPERS ---
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getSlotsForDay = (date: Date) => {
    return slots.filter(s => {
      const sDate = new Date(s.startTime);
      return sDate.getDate() === date.getDate() && 
             sDate.getMonth() === date.getMonth() && 
             sDate.getFullYear() === date.getFullYear();
    }).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddSingleSlot = () => {
    const [hours, minutes] = singleTime.split(':').map(Number);
    const newDate = new Date(selectedDay);
    newDate.setHours(hours, minutes, 0, 0);
    handleAddSlot(newDate, singleDuration);
  };

  const toggleRecurringTime = (dayId: number, time: string) => {
    setRecurringPattern(prev => {
      const current = prev[dayId] || [];
      return current.includes(time) 
        ? { ...prev, [dayId]: current.filter(t => t !== time) }
        : { ...prev, [dayId]: [...current, time].sort() };
    });
  };

  const applyRecurringSchedule = () => {
    const datesToAdd: Date[] = [];
    const weeksToGenerate = 4; 
    const today = new Date();
    
    for (let i = 0; i < weeksToGenerate * 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayId = futureDate.getDay();
      
      const timesForDay = recurringPattern[dayId];
      if (timesForDay && timesForDay.length > 0) {
        timesForDay.forEach(time => {
          const [h, m] = time.split(':').map(Number);
          const newSlotDate = new Date(futureDate);
          newSlotDate.setHours(h, m, 0, 0);
          
          const exists = slots.some(s => new Date(s.startTime).getTime() === newSlotDate.getTime());
          if (!exists) {
            datesToAdd.push(newSlotDate);
          }
        });
      }
    }
    
    if (datesToAdd.length > 0) {
      handleAddMultipleSlots(datesToAdd, recurringDuration);
      alert(`Đã tạo thành công ${datesToAdd.length} buổi học trong 4 tuần tới!`);
      setActiveTab('calendar');
    } else {
      alert("Không có lịch mới nào được tạo.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Lịch dạy</h2>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <CalendarIcon size={16} /> Lịch chi tiết
          </button>
          <button 
            onClick={() => setActiveTab('recurring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'recurring' ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Repeat size={16} /> Cài đặt định kỳ
          </button>
        </div>
      </div>

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft /></button>
              <h3 className="font-bold text-lg capitalize">
                Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
              </h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} className="text-xs font-semibold text-gray-400 py-2">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {daysInMonth.map((date) => {
                const daySlots = getSlotsForDay(date);
                const isSelected = date.getDate() === selectedDay.getDate() && date.getMonth() === selectedDay.getMonth();
                const isToday = new Date().toDateString() === date.toDateString();
                const hasBooked = daySlots.some(s => s.isBooked);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDay(date)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all border
                      ${isSelected ? 'border-brand-600 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}
                      ${isToday ? 'bg-blue-50 font-bold text-blue-600' : ''}
                    `}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold' : 'text-gray-700'}`}>{date.getDate()}</span>
                    <div className="flex gap-1 mt-1">
                      {daySlots.length > 0 && (
                        <div className={`w-1.5 h-1.5 rounded-full ${hasBooked ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                      )}
                      {daySlots.length > 1 && <span className="text-[10px] text-gray-400">+{daySlots.length - 1}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Detail Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h3 className="font-bold text-lg mb-1">
              {selectedDay.toLocaleDateString('vi-VN', {weekday: 'long', day: 'numeric', month: 'long'})}
            </h3>
            <p className="text-gray-500 text-sm mb-6">Quản lý lịch trong ngày</p>

            <div className="flex flex-col gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                 <Clock size={16} className="text-gray-500"/>
                 <span className="text-sm font-medium text-gray-700">Thêm khung giờ:</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="time" 
                  value={singleTime}
                  onChange={(e) => setSingleTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={singleDuration}
                  onChange={(e) => setSingleDuration(Number(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  {DURATIONS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <button 
                  onClick={handleAddSingleSlot}
                  className="bg-brand-600 text-white p-2 px-3 rounded-lg hover:bg-brand-700"
                  title="Thêm giờ"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {getSlotsForDay(selectedDay).length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-4 border border-dashed rounded-lg">Chưa có lịch</div>
              ) : (
                getSlotsForDay(selectedDay).map(slot => {
                  const start = new Date(slot.startTime);
                  const end = new Date(slot.endTime);
                  return (
                    <div key={slot.id} className={`flex items-center justify-between p-3 rounded-lg border ${slot.isBooked ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                      <div>
                         <div className="font-mono font-bold text-gray-700 flex items-center gap-1">
                           {start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                           <span className="text-gray-400">-</span>
                           {end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                         </div>
                         <div className="text-xs text-gray-500 mt-1">
                           {(end.getTime() - start.getTime()) / 60000} phút
                         </div>
                      </div>
                      {slot.isBooked ? (
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">Đã đặt</span>
                      ) : (
                        <button onClick={() => handleDeleteSlot(slot.id)} className="text-gray-400 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recurring' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           {/* Same recurring UI logic but now calling API wrappers */}
           {/* (Simplified for brevity, assuming existing recurring UI code is preserved but calls new handlers) */}
           <div className="mb-6 border-b border-gray-100 pb-4">
             <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                <Repeat className="text-brand-600"/> Tạo lịch lặp lại
             </h3>
             <p className="text-gray-600 mt-1">
               Chọn các khung giờ cố định trong tuần. Hệ thống sẽ tự động tạo lịch trống cho <strong>4 tuần tiếp theo</strong>.
             </p>
          </div>

          <div className="mb-6 flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
             <Clock className="text-brand-600" size={20}/>
             <span className="font-medium text-gray-800">Thời lượng cho tất cả các buổi:</span>
             <select
                value={recurringDuration}
                onChange={(e) => setRecurringDuration(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-white font-medium"
              >
                {DURATIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {DAYS_OF_WEEK.map(day => (
              <div key={day.id} className="border border-gray-200 rounded-lg p-4 hover:border-brand-200 transition-colors">
                <div className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                  {day.name}
                </div>
                
                <div className="flex gap-2 mb-3">
                   <input 
                    type="time" 
                    className="flex-1 p-1.5 text-sm border border-gray-300 rounded"
                    id={`time-${day.id}`}
                    defaultValue="09:00"
                   />
                   <button 
                    onClick={() => {
                       const input = document.getElementById(`time-${day.id}`) as HTMLInputElement;
                       if(input) toggleRecurringTime(day.id, input.value);
                    }}
                    className="text-brand-600 hover:bg-brand-50 p-1.5 rounded"
                   >
                     <Plus size={16}/>
                   </button>
                </div>

                <div className="flex flex-wrap gap-2">
                   {recurringPattern[day.id]?.map(time => (
                     <div key={time} className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                       {time}
                       <button onClick={() => toggleRecurringTime(day.id, time)} className="hover:text-red-500">
                         <Trash2 size={12}/>
                       </button>
                     </div>
                   ))}
                   {!recurringPattern[day.id]?.length && <span className="text-xs text-gray-400 italic">Chưa chọn giờ</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
               onClick={applyRecurringSchedule}
               className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 flex items-center gap-2 shadow-lg shadow-brand-100"
             >
               <Check size={20} /> Áp dụng lịch mẫu cho 4 tuần tới
             </button>
          </div>
        </div>
      )}
    </div>
  )
};