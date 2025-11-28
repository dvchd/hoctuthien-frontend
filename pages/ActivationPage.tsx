import React, { useMemo } from 'react';
import { User } from '../types';
import { PaymentCheck } from '../components/PaymentCheck';

interface ActivationPageProps {
  user: User;
  onActivated: () => void;
}

export const ActivationPage: React.FC<ActivationPageProps> = ({ user, onActivated }) => {
  const activationCode = useMemo(() => `HOCTUTHIEN KICHHOAT ${user.id.substring(0,6)}`, [user.id]);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Kích hoạt tài khoản</h2>
        <p className="text-gray-600">
          Để đảm bảo môi trường học tập chất lượng và tránh tài khoản ảo, 
          bạn vui lòng ủng hộ <span className="font-bold text-brand-600">10.000 VNĐ</span> vào quỹ từ thiện.
          <br/>Toàn bộ số tiền sẽ được chuyển trực tiếp đến tài khoản minh bạch trên Thiện Nguyện App.
        </p>
      </div>

      <PaymentCheck 
        accountNumber="2000" 
        amount={10000} 
        syntax={activationCode}
        onSuccess={onActivated}
        title="Quét mã để kích hoạt"
        description="Số tiền ủng hộ: 10.000đ"
      />
    </div>
  );
};