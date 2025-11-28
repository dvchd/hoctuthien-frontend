import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Booking, BookingStatus } from '../types';
import { api } from '../services/api';
import { Calendar, DollarSign, Loader2 } from 'lucide-react';

interface DashboardPageProps {
  user: User;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.bookings.list(user.id);
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const upcomingCount = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;

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