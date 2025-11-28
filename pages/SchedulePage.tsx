
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Booking, BookingStatus, UserRole, PaymentStatus } from '../types';
import { api } from '../services/api';
import { Calendar, Clock, Video, DollarSign, Loader2, AlertTriangle, CheckCircle, Hourglass, XCircle, X } from 'lucide-react';

interface SchedulePageProps {
  user: User;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [bookingsData, mentorsData] = await Promise.all([
        api.bookings.list(user.id),
        api.mentors.list()
      ]);
      setBookings(bookingsData.sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
      setMentors(mentorsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handlePay = (bookingId: string) => {
    navigate(`/pay/${bookingId}`);
  };

  const confirmCancel = async () => {
    if (!cancelBookingId) return;
    
    try {
      await api.bookings.cancel(cancelBookingId);
      // Optimistically remove the booking from the UI
      setBookings(prev => prev.filter(b => b.id !== cancelBookingId));
      alert("Đã hủy lịch thành công.");
    } catch (e) {
      alert("Không thể hủy lịch. Có thể lịch đã được thanh toán hoặc đã diễn ra.");
      fetchData(); // Sync with server if failed
    } finally {
      setCancelBookingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Lịch học của tôi</h2>
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Bạn chưa có lịch học nào.
          </div>
        ) : (
            bookings.map(booking => {
              const isMentee = user.role === UserRole.MENTEE;
              const otherPerson = mentors.find(m => m.id === (isMentee ? booking.mentorId : booking.menteeId));
              const otherPersonName = otherPerson ? otherPerson.name : (isMentee ? 'Mentor' : 'Mentee');
              
              const start = new Date(booking.startTime);
              const end = new Date(booking.endTime);
              const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
              
              const now = new Date();
              const isFinished = end < now;
              const isStarted = start < now;
              const isPaid = booking.paymentStatus === PaymentStatus.PAID;
              const isDebt = isFinished && !isPaid;
              
              // Logic to allow cancellation: Must be NOT PAID and NOT STARTED yet (with a small buffer if needed, but for now simple)
              const canCancel = !isPaid && !isStarted && isMentee;

              return (
                <div key={booking.id} className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow ${isDebt ? 'border-orange-200 ring-1 ring-orange-200' : 'border-gray-200'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isPaid ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                        {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                      {isDebt && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded animate-pulse">Cần thanh toán</span>}
                      {isFinished && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Đã kết thúc</span>}
                      <span className="text-xs text-gray-400">ID: {booking.id}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {isMentee ? `Học với Mentor ${otherPersonName}` : `Dạy cho Mentee ${otherPersonName}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                        <Calendar size={16} className="text-brand-500"/>
                        <span className="font-medium">
                          {start.toLocaleDateString('vi-VN', {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'})}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                        <Clock size={16} className="text-brand-500"/>
                        <span className="font-medium">
                          {start.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                        <Hourglass size={16} className="text-brand-500"/>
                        <span>{durationMinutes} phút</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 min-w-[200px]">
                    {!isFinished && (
                      <a 
                        href={booking.meetLink} 
                        target="_blank"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                      >
                        <Video size={16} /> Vào lớp Google Meet
                      </a>
                    )}

                    {!isPaid && isMentee && (
                      <button 
                        onClick={() => handlePay(booking.id)}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                          isDebt 
                          ? 'bg-orange-600 text-white hover:bg-orange-700 border-orange-600' 
                          : 'bg-white text-brand-600 border-brand-200 hover:bg-brand-50'
                        }`}
                      >
                        {isDebt ? <AlertTriangle size={16}/> : <DollarSign size={16} />}
                        {isDebt ? 'Thanh toán nợ' : 'Thanh toán ngay'}
                      </button>
                    )}

                    {canCancel && (
                      <button 
                        onClick={() => setCancelBookingId(booking.id)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={16}/> Hủy lịch
                      </button>
                    )}
                    
                    {isPaid && (
                       <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                         <CheckCircle size={16}/> Đã thanh toán xong
                       </div>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Xác nhận hủy lịch
              </h3>
              <button onClick={() => setCancelBookingId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy buổi học này không? Hành động này sẽ giải phóng lịch trống cho Mentor và không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setCancelBookingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md transition-all hover:shadow-lg"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
