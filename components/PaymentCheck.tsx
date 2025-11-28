import React, { useState } from 'react';
import { getVietQRUrl, verifyPayment } from '../services/thienNguyenService';
import { Loader2, CheckCircle, RefreshCw } from 'lucide-react';

interface PaymentCheckProps {
  accountNumber: string;
  amount: number;
  syntax: string;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const PaymentCheck: React.FC<PaymentCheckProps> = ({
  accountNumber,
  amount,
  syntax,
  onSuccess,
  title = "Thanh toán",
  description
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qrUrl = getVietQRUrl(accountNumber, amount, syntax);

  const handleCheckPayment = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const isPaid = await verifyPayment(accountNumber, amount, syntax);
      if (isPaid) {
        onSuccess();
      } else {
        setError("Chưa tìm thấy giao dịch phù hợp. Vui lòng thử lại sau 1-2 phút.");
      }
    } catch (e) {
      setError("Lỗi kết nối đến hệ thống Thiện Nguyện.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
      {description && <p className="text-gray-500 text-sm text-center mb-4">{description}</p>}
      
      <div className="flex justify-center mb-6">
        <img 
          src={qrUrl} 
          alt="VietQR Code" 
          className="w-64 h-auto rounded-lg border-2 border-brand-100"
        />
      </div>

      <div className="bg-gray-50 p-3 rounded-md text-sm mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng:</span>
          <span className="font-semibold">MBBank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tài khoản:</span>
          <span className="font-semibold text-brand-600">{accountNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền:</span>
          <span className="font-semibold text-red-500">{amount.toLocaleString('vi-VN')} đ</span>
        </div>
        <div className="flex flex-col mt-2 pt-2 border-t border-gray-200">
          <span className="text-gray-500 mb-1">Nội dung chuyển khoản (Bắt buộc):</span>
          <div className="bg-white border border-gray-300 p-2 rounded font-mono font-bold text-center text-brand-700 select-all">
            {syntax}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckPayment}
        disabled={isChecking}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isChecking ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
        Kiểm tra giao dịch
      </button>
      
      {/* Dev helper to bypass payment in demo */}
      <button 
        onClick={onSuccess}
        className="mt-2 text-xs text-gray-400 underline w-full text-center hover:text-gray-600"
      >
        (Demo: Giả lập thành công)
      </button>
    </div>
  );
};