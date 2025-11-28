import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Booking, BookingStatus, UserRole } from '../types';
import { Calendar, Clock, Video, DollarSign } from 'lucide-react';

interface SchedulePageProps {
  user: User;
  bookings: Booking[];
  mentors: User[];
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ user, bookings, mentors }) => {
  const navigate = useNavigate();
  const myBookings = bookings.filter(b => b.menteeId === user.id || b.mentorId === user.id)
    .sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()); // Newest first

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'text-green-600 bg-green-50 border-green-200';
      case BookingStatus.PENDING_PAYMENT: return 'text-orange-600 bg-orange-50 border-orange-200';
      case BookingStatus.COMPLETED: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handlePay = (bookingId: string) => {
    navigate(`/pay/${bookingId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Lịch học của tôi</h2>
      <div className="space-y-4">
        {myBookings.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Bạn chưa có lịch học nào.
          </div>
        ) : (
            myBookings.map(booking => {
              const isMentee = user.role === UserRole.MENTEE;
              // Simple ID lookup for demo
              const otherPerson = mentors.find(m => m.id === (isMentee ? booking.mentorId : booking.menteeId));
              const otherPersonName = otherPerson ? otherPerson.name : (isMentee ? 'Mentor' : 'Mentee');

              return (
                <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                        {booking.status === BookingStatus.CONFIRMED ? 'Sẵn sàng' : 
                         booking.status === BookingStatus.PENDING_PAYMENT ? 'Chờ thanh toán' : booking.status}
                      </span>
                      <span className="text-xs text-gray-400">ID: {booking.id}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {isMentee ? `Học với Mentor ${otherPersonName}` : `Dạy cho Mentee ${otherPersonName}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                        <Calendar size={14} className="text-brand-500"/>
                        {new Date(booking.startTime).toLocaleDateString('vi-VN', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                        <Clock size={14} className="text-brand-500"/>
                        {new Date(booking.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {booking.status === BookingStatus.CONFIRMED && (
                      <a 
                        href={booking.meetLink} 
                        target="_blank"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                      >
                        <Video size={16} /> Vào lớp Google Meet
                      </a>
                    )}
                    {booking.status === BookingStatus.PENDING_PAYMENT && isMentee && (
                      <button 
                        onClick={() => handlePay(booking.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200"
                      >
                        <DollarSign size={16} /> Thanh toán {booking.cost.toLocaleString()}đ
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};