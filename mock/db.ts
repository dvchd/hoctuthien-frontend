import { User, UserRole, Booking, BookingStatus, PaymentStatus, AvailabilitySlot } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

// --- MOCK DATABASE ---
export const db = {
  users: [
    // --- MENTORS ---
    { 
      id: 'm1', 
      name: 'Nguyễn Văn A', 
      email: 'a@test.com', 
      role: UserRole.MENTOR, 
      isActivated: true, 
      avatarUrl: 'https://picsum.photos/seed/m1/200', 
      topics: ['1', '3', '5'], 
      hourlyRate: 100000, 
      bio: '5 năm kinh nghiệm Fullstack Developer. Từng làm việc tại Google, Facebook.', 
      charityAccountNumber: '2000',
      rating: 4.8,
      reviewCount: 120
    },
    { 
      id: 'm2', 
      name: 'Trần Thị B', 
      email: 'b@test.com', 
      role: UserRole.MENTOR, 
      isActivated: true, 
      avatarUrl: 'https://picsum.photos/seed/m2/200', 
      topics: ['2', '4', '6'], 
      hourlyRate: 50000, 
      bio: 'Marketing Manager tại công ty đa quốc gia. IELTS 8.0.', 
      charityAccountNumber: '1111',
      rating: 4.5,
      reviewCount: 45
    },
    { 
      id: 'm3', 
      name: 'Lê C', 
      email: 'c@test.com', 
      role: UserRole.MENTOR, 
      isActivated: true, 
      avatarUrl: 'https://picsum.photos/seed/m3/200', 
      topics: ['1', '6'], 
      hourlyRate: 200000, 
      bio: 'Chuyên gia AI/ML. Tiến sĩ Đại học Stanford.', 
      charityAccountNumber: '2000',
      rating: 5.0,
      reviewCount: 12
    },
    // Adding Mentors m4-m10 to match Leaderboard
    { id: 'm4', name: 'Phạm Thị D', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m4/200', topics: ['3'], hourlyRate: 70000, rating: 4.2, reviewCount: 30, charityAccountNumber: '2000', email: 'm4@test.com' },
    { id: 'm5', name: 'Hoàng Văn E', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m5/200', topics: ['4'], hourlyRate: 120000, rating: 4.9, reviewCount: 80, charityAccountNumber: '1111', email: 'm5@test.com' },
    { id: 'm6', name: 'Đỗ Thị F', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m6/200', topics: ['5'], hourlyRate: 90000, rating: 4.6, reviewCount: 25, charityAccountNumber: '2000', email: 'm6@test.com' },
    { id: 'm7', name: 'Vũ Văn G', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m7/200', topics: ['1', '2'], hourlyRate: 150000, rating: 4.7, reviewCount: 50, charityAccountNumber: '1111', email: 'm7@test.com' },
    { id: 'm8', name: 'Ngô Thị H', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m8/200', topics: ['3', '6'], hourlyRate: 60000, rating: 4.4, reviewCount: 15, charityAccountNumber: '2000', email: 'm8@test.com' },
    { id: 'm9', name: 'Bùi Văn I', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m9/200', topics: ['4'], hourlyRate: 110000, rating: 4.8, reviewCount: 60, charityAccountNumber: '1111', email: 'm9@test.com' },
    { id: 'm10', name: 'Đặng Thị K', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m10/200', topics: ['2'], hourlyRate: 80000, rating: 4.3, reviewCount: 20, charityAccountNumber: '2000', email: 'm10@test.com' },

    // --- MENTEES ---
    {
      id: 'u1',
      name: 'Phạm Văn Học',
      email: 'hoc@test.com',
      role: UserRole.MENTEE,
      isActivated: true,
      avatarUrl: 'https://picsum.photos/seed/u1/200',
      bio: 'Sinh viên năm cuối ĐH Bách Khoa. Đam mê lập trình và hoạt động xã hội.',
      rating: 0,
      reviewCount: 0
    },
    {
      id: 'u2',
      name: 'Hoàng Thị Chăm',
      email: 'cham@test.com',
      role: UserRole.MENTEE,
      isActivated: true,
      avatarUrl: 'https://picsum.photos/seed/u2/200',
      bio: 'Nhân viên văn phòng muốn học thêm tiếng Anh và kỹ năng mềm.',
      rating: 0,
      reviewCount: 0
    },
    {
      id: 'u3',
      name: 'Lê Tuấn Tú',
      email: 'tu@test.com',
      role: UserRole.MENTEE,
      isActivated: true,
      avatarUrl: 'https://picsum.photos/seed/u3/200',
      bio: 'Designer Freelancer. Muốn tìm hiểu về đầu tư tài chính.',
      rating: 0,
      reviewCount: 0
    },
    {
      id: 'u4',
      name: 'Ngô Bảo Châu',
      email: 'chau@test.com',
      role: UserRole.MENTEE,
      isActivated: true,
      avatarUrl: 'https://picsum.photos/seed/u4/200',
      rating: 0,
      reviewCount: 0
    },
    {
      id: 'u5',
      name: 'Vũ Minh Hiếu',
      email: 'hieu@test.com',
      role: UserRole.MENTEE,
      isActivated: true,
      avatarUrl: 'https://picsum.photos/seed/u5/200',
      rating: 0,
      reviewCount: 0
    },
    // Adding Mentees u6-u10 to match Leaderboard
    { id: 'u6', name: 'Đinh Thị Mai', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u6/200', email: 'u6@test.com' },
    { id: 'u7', name: 'Trịnh Văn Nam', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u7/200', email: 'u7@test.com' },
    { id: 'u8', name: 'Lý Thị Lan', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u8/200', email: 'u8@test.com' },
    { id: 'u9', name: 'Cao Văn Dũng', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u9/200', email: 'u9@test.com' },
    { id: 'u10', name: 'Bạch Thị Tuyết', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u10/200', email: 'u10@test.com' }
  ] as User[],
  slots: [
    { id: 's1', mentorId: 'm1', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), isBooked: false },
    { id: 's2', mentorId: 'm1', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 5400000).toISOString(), isBooked: false },
  ] as AvailabilitySlot[],
  bookings: [
    // Seed some bookings for stats
    {
      id: 'b1', mentorId: 'm1', menteeId: 'u1', 
      startTime: '2025-10-01T09:00:00.000Z', endTime: '2025-10-01T10:00:00.000Z',
      status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, cost: 100000, paymentCode: 'PAY1'
    },
    {
      id: 'b2', mentorId: 'm2', menteeId: 'u1', 
      startTime: '2025-10-05T14:00:00.000Z', endTime: '2025-10-05T15:00:00.000Z',
      status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, cost: 50000, paymentCode: 'PAY2'
    },
    {
      id: 'b3', mentorId: 'm1', menteeId: 'u2', 
      startTime: '2025-10-02T09:00:00.000Z', endTime: '2025-10-02T10:00:00.000Z',
      status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, cost: 100000, paymentCode: 'PAY3'
    },
    {
      id: 'b4', mentorId: 'm3', menteeId: 'u3', 
      startTime: '2025-10-10T20:00:00.000Z', endTime: '2025-10-10T21:30:00.000Z',
      status: BookingStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, cost: 300000, paymentCode: 'PAY4'
    }
  ] as Booking[]
};

// --- HELPER: Generate random history for new users ---
const generateRandomHistory = () => {
  // Generate random past bookings for mentors m4-m10 and mentees u4-u10
  // to populate their profile stats
  const extraBookings: Booking[] = [];
  
  // For Mentors m4-m10
  for (let i = 4; i <= 10; i++) {
    const mentorId = `m${i}`;
    const sessions = Math.floor(Math.random() * 20) + 5; // 5-25 sessions
    const rate = db.users.find(u => u.id === mentorId)?.hourlyRate || 50000;
    
    for (let j = 0; j < sessions; j++) {
      extraBookings.push({
        id: generateId(),
        mentorId: mentorId,
        menteeId: `u${Math.floor(Math.random() * 10) + 1}`,
        startTime: '2025-01-01T00:00:00.000Z', // Dummy past date
        endTime: '2025-01-01T01:00:00.000Z',
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        cost: rate,
        paymentCode: `AUTO-${generateId()}`
      });
    }
  }

  // For Mentees u4-u10 (add some specifically where they are mentees)
  for (let i = 4; i <= 10; i++) {
    const menteeId = `u${i}`;
    const sessions = Math.floor(Math.random() * 10) + 1;
    
    for (let j = 0; j < sessions; j++) {
       // Only add if not already covered by mentor loop (simple heuristic)
       extraBookings.push({
        id: generateId(),
        mentorId: `m${Math.floor(Math.random() * 10) + 1}`,
        menteeId: menteeId,
        startTime: '2025-01-01T00:00:00.000Z',
        endTime: '2025-01-01T01:00:00.000Z',
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        cost: 100000,
        paymentCode: `AUTO-${generateId()}`
      });
    }
  }
  
  db.bookings.push(...extraBookings);
};

// Initialize random history once
generateRandomHistory();
