import React from 'react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
       <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-6 text-brand-700">Đăng Nhập</h2>
          <div className="space-y-4">
            <button onClick={() => onLogin(UserRole.MENTEE)} className="w-full bg-brand-600 text-white p-3 rounded-lg hover:bg-brand-700 transition-colors">
              Đăng nhập vai trò Học viên (Mentee)
            </button>
            <button onClick={() => onLogin(UserRole.MENTOR)} className="w-full border border-brand-600 text-brand-600 p-3 rounded-lg hover:bg-brand-50 transition-colors">
              Đăng nhập vai trò Giảng viên (Mentor)
            </button>
          </div>
       </div>
    </div>
  );
};