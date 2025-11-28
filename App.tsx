import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { api } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ActivationPage } from './pages/ActivationPage';
import { DashboardPage } from './pages/DashboardPage';
import { MentorListPage } from './pages/MentorListPage';
import { MentorSchedulePage } from './pages/MentorSchedulePage';
import { SchedulePage } from './pages/SchedulePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PaymentPage } from './pages/PaymentPage';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // --- ACTIONS ---

  const handleLogin = async (role: UserRole) => {
    try {
      const loggedInUser = await api.auth.login(role);
      setUser(loggedInUser);
      navigate('/activation');
    } catch (e) {
      alert("Đăng nhập thất bại");
    }
  };

  const handleActivationSuccess = async () => {
    if (user) {
      try {
        await api.auth.activate(user.id);
        setUser({ ...user, isActivated: true });
        alert("Tài khoản đã được kích hoạt thành công!");
        navigate('/dashboard');
      } catch (e) {
        alert("Lỗi kích hoạt");
      }
    }
  };

  // --- PROTECTED ROUTE WRAPPER ---
  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (!user.isActivated) return <Navigate to="/activation" replace />;
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-slate-50">
      <Navbar 
        user={user} 
        onLogout={() => setUser(null)} 
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          
          <Route 
            path="/activation" 
            element={
              user ? (
                 <ActivationPage user={user} onActivated={handleActivationSuccess} />
              ) : <Navigate to="/login" />
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage user={user!} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/mentors" 
            element={
              <ProtectedRoute>
                <MentorListPage user={user!} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-schedule" 
            element={
              <ProtectedRoute>
                <MentorSchedulePage user={user!} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute>
                <SchedulePage user={user!} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/pay/:bookingId" 
            element={
              <ProtectedRoute>
                 <PaymentPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/leaderboard" element={<LeaderboardPage />} />
          
          <Route path="*" element={<div className="text-center py-20">404 - Trang không tồn tại</div>} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2025 HocTuThien. Dự án phi lợi nhuận.</p>
          <p className="mt-2">Sử dụng API Thiện Nguyện (MBBank) để minh bạch tài chính.</p>
        </div>
      </footer>
    </div>
  );
}