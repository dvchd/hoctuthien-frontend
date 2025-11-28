import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Booking, BookingStatus } from '../types';
import { api } from '../services/api';
import { PaymentCheck } from '../components/PaymentCheck';
import { Loader2 } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      try {
        const data = await api.bookings.get(bookingId);
        if (!data) {
          alert("Không tìm thấy đơn đặt lịch.");
          navigate('/schedule');
          return;
        }
        if (data.status === BookingStatus.CONFIRMED) {
          alert("Đơn này đã được thanh toán.");
          navigate('/schedule');
          return;
        }
        setBooking(data);
      } catch (e) {
        alert("Lỗi tải thông tin.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  const handleSuccess = async () => {
    if (!bookingId) return;
    await api.bookings.pay(bookingId);
    alert("Thanh toán thành công! Lịch học đã được xác nhận.");
    navigate('/schedule');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;
  if (!booking) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/schedule')} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center gap-1">
          &larr; Quay lại
        </button>
        <PaymentCheck
          accountNumber="2000"
          amount={booking.cost}
          syntax={booking.paymentCode}
          onSuccess={handleSuccess}
          title="Thanh toán học phí"
          description={`Thanh toán cho buổi học #${booking.id}`}
        />
      </div>
    </div>
  );
};