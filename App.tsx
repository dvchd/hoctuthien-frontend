import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  User, UserRole, Booking, BookingStatus, AvailabilitySlot
} from './types';
import { Navbar } from './components/Navbar';

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

// --- HELPER ---
const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

// Helper to add minutes to a date
const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // --- MOCK DB STATES ---
  // In a real app, these would come from an API/Context
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [mentors, setMentors] = useState<User[]>([
    { id: 'm1', name: 'Nguyễn Văn A', email: 'a@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/100/100', topics: ['1', '3', '5'], hourlyRate: 100000, bio: '5 năm kinh nghiệm Fullstack Developer. Thích chia sẻ về kiến trúc phần mềm.', charityAccountNumber: '2000' },
    { id: 'm2', name: 'Trần Thị B', email: 'b@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/101/101', topics: ['2', '4', '6'], hourlyRate: 50000, bio: 'Marketing Manager tại công ty đa quốc gia. IELTS 8.0.', charityAccountNumber: '1111' },
    { id: 'm3', name: 'Lê C', email: 'c@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/102/102', topics: ['1', '6'], hourlyRate: 200000, bio: 'Chuyên gia AI/ML & Computer Vision.', charityAccountNumber: '2000' },
  ]);

  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    { 
      id: 's1', mentorId: 'm1', 
      startTime: new Date(Date.now() + 86400000).toISOString(), 
      endTime: addMinutes(new Date(Date.now() + 86400000), 60).toISOString(),
      isBooked: false 
    },
    { 
      id: 's2', mentorId: 'm1', 
      startTime: new Date(Date.now() + 172800000).toISOString(), 
      endTime: addMinutes(new Date(Date.now() + 172800000), 90).toISOString(),
      isBooked: false 
    },
    { 
      id: 's3', mentorId: 'm2', 
      startTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), 
      endTime: addMinutes(new Date(Date.now() + 86400000 + 3600000), 60).toISOString(),
      isBooked: false 
    },
  ]);

  // --- ACTIONS ---

  const handleLogin = (asRole: UserRole) => {
    const newUser = {
      id: generateId(),
      name: asRole === UserRole.MENTOR ? 'Demo Giảng Viên' : 'Demo Học Viên',
      email: 'demo@hoctuthien.com',
      role: asRole,
      isActivated: false, // Start unactivated
      avatarUrl: `https://picsum.photos/200/200?random=${Math.random()}`,
      topics: asRole === UserRole.MENTOR ? ['1', '2'] : [],
      hourlyRate: 50000,
      charityAccountNumber: '2000'
    };
    
    if (asRole === UserRole.MENTOR) {
      setMentors(prev => [...prev, newUser]);
    }
    
    setUser(newUser);
    navigate('/activation');
  };

  const handleActivationSuccess = () => {
    if (user) {
      setUser({ ...user, isActivated: true });
      alert("Tài khoản đã được kích hoạt thành công!");
      navigate('/dashboard');
    }
  };

  const handleAddSlot = (date: Date, durationMinutes: number) => {
    if (!user) return;
    const newSlot: AvailabilitySlot = {
      id: generateId(),
      mentorId: user.id,
      startTime: date.toISOString(),
      endTime: addMinutes(date, durationMinutes).toISOString(),
      isBooked: false
    };
    setAvailabilitySlots(prev => [...prev, newSlot]);
  };

  // Add multiple slots at once (for recurring schedules)
  const handleAddMultipleSlots = (dates: Date[], durationMinutes: number) => {
    if (!user) return;
    const newSlots = dates.map(date => ({
      id: generateId(),
      mentorId: user.id,
      startTime: date.toISOString(),
      endTime: addMinutes(date, durationMinutes).toISOString(),
      isBooked: false
    }));
    setAvailabilitySlots(prev => [...prev, ...newSlots]);
  };

  const handleDeleteSlot = (id: string) => {
    setAvailabilitySlots(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateBooking = (mentor: User, slot: AvailabilitySlot) => {
    const pending = bookings.filter(b => b.menteeId === user?.id && b.status === BookingStatus.PENDING_PAYMENT);
    if (pending.length > 0) {
      alert("Bạn còn buổi học chưa thanh toán. Vui lòng thanh toán trước khi đặt lịch mới.");
      navigate('/schedule');
      return;
    }

    setAvailabilitySlots(prev => prev.map(s => s.id === slot.id ? { ...s, isBooked: true } : s));

    const bookingId = generateId();
    // Calculate cost based on duration ratio if needed, but for simplicity assuming hourlyRate is "per session" or normalized elsewhere.
    // Let's normalize cost: (duration in hours) * hourlyRate
    const durationHours = (new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / 3600000;
    const estimatedCost = Math.ceil((mentor.hourlyRate || 0) * durationHours);

    const newBooking: Booking = {
      id: bookingId,
      mentorId: mentor.id,
      menteeId: user!.id,
      startTime: slot.startTime,
      endTime: slot.endTime, // Use slot's explicit end time
      status: BookingStatus.PENDING_PAYMENT,
      cost: estimatedCost,
      paymentCode: `HOCTUTHIEN HOCPHI ${bookingId}`,
    };

    setBookings([...bookings, newBooking]);
    navigate(`/pay/${bookingId}`);
  };

  const handleBookingPaymentSuccess = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: BookingStatus.CONFIRMED,
          meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`
        };
      }
      return b;
    }));
    alert("Thanh toán thành công! Lịch học đã được xác nhận.");
    navigate('/schedule');
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
                <DashboardPage user={user!} bookings={bookings} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/mentors" 
            element={
              <ProtectedRoute>
                <MentorListPage mentors={mentors} slots={availabilitySlots} onBook={handleCreateBooking} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-schedule" 
            element={
              <ProtectedRoute>
                <MentorSchedulePage 
                  user={user!} 
                  slots={availabilitySlots} 
                  onAddSlot={handleAddSlot} 
                  onAddMultipleSlots={handleAddMultipleSlots}
                  onDeleteSlot={handleDeleteSlot} 
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute>
                <SchedulePage user={user!} bookings={bookings} mentors={mentors} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/pay/:bookingId" 
            element={
              <ProtectedRoute>
                 <PaymentPage bookings={bookings} onPaymentSuccess={handleBookingPaymentSuccess} />
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