
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Booking, PaymentStatus } from '../types';
import { api } from '../services/api';
import { PaymentCheck } from '../components/PaymentCheck';
import { Loader2, AlertCircle } from 'lucide-react';

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
        if (data.paymentStatus === PaymentStatus.PAID) {
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
    alert("Thanh toán thành công! Cảm ơn bạn đã đóng góp.");
    navigate('/schedule');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600"/></div>;
  if (!booking) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/schedule')} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center gap-1">
          &larr; Quay lại lịch học
        </button>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3 text-sm text-yellow-800 mb-6">
           <AlertCircle className="shrink-0 mt-0.5" size={18}/>
           <div>
             <strong>Lưu ý quan trọng:</strong>
             <ul className="list-disc ml-4 mt-1 space-y-1">
               <li>Đây là giao dịch thiện nguyện trực tiếp.</li>
               <li>Nếu bạn thanh toán trước và buổi học bị huỷ vì lý do bất khả kháng, số tiền <strong>sẽ không thể hoàn lại</strong>.</li>
               <li>Chúng tôi khuyến khích bạn thanh toán sau khi buổi học kết thúc.</li>
             </ul>
           </div>
        </div>

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
