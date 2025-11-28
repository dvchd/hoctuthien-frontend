import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Booking, BookingStatus } from '../types';
import { PaymentCheck } from '../components/PaymentCheck';

interface PaymentPageProps {
  bookings: Booking[];
  onPaymentSuccess: (bookingId: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ bookings, onPaymentSuccess }) => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const booking = bookings.find(b => b.id === bookingId);

  useEffect(() => {
    if (!booking) {
      alert("Không tìm thấy đơn đặt lịch.");
      navigate('/schedule');
    } else if (booking.status === BookingStatus.CONFIRMED) {
       alert("Đơn này đã được thanh toán.");
       navigate('/schedule');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/schedule')} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center gap-1">
          &larr; Quay lại
        </button>
        <PaymentCheck
          accountNumber="2000" // Hardcoded for demo, usually from mentor's selection
          amount={booking.cost}
          syntax={booking.paymentCode}
          onSuccess={() => onPaymentSuccess(booking.id)}
          title="Thanh toán học phí"
          description={`Thanh toán cho buổi học #${booking.id}`}
        />
      </div>
    </div>
  );
};