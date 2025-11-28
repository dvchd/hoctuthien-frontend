import React from 'react';
import { Link } from 'react-router-dom';
import { User, Booking, BookingStatus } from '../types';
import { Calendar, DollarSign } from 'lucide-react';

interface DashboardPageProps {
  user: User;
  bookings: Booking[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, bookings }) => {
  const upcomingCount = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Xin chào, {user.name}!</h1>
        <p className="opacity-90">Cảm ơn bạn đã đồng hành cùng Học Từ Thiện.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/schedule" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Lịch học sắp tới</p>
              <p className="text-2xl font-bold">{upcomingCount}</p>
            </div>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Đã đóng góp</p>
              <p className="text-2xl font-bold">500.000 đ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};