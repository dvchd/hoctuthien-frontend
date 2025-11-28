import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
        Học Từ Thiện
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Nền tảng kết nối tri thức nơi 100% chi phí học tập được chuyển trực tiếp vào 
        các tài khoản thiện nguyện minh bạch.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl">
          Tham gia ngay
        </Link>
      </div>
      
      {/* Landing page Leaderboard Snippet */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="text-3xl font-bold text-brand-600 mb-2">1.2 Tỷ+</div>
           <div className="text-gray-500">Đã quyên góp</div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="text-3xl font-bold text-orange-500 mb-2">5,000+</div>
           <div className="text-gray-500">Giờ học đã thực hiện</div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="text-3xl font-bold text-green-500 mb-2">200+</div>
           <div className="text-gray-500">Dự án được hỗ trợ</div>
         </div>
      </div>
    </div>
  );
};