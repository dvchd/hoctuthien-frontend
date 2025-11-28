
import { User, UserRole } from '../types';

export const MENTORS_DATA: User[] = [
  { 
    id: 'm1', 
    name: 'Nguyễn Văn A', 
    email: 'a@test.com', 
    role: UserRole.MENTOR, 
    isActivated: true, 
    avatarUrl: 'https://picsum.photos/seed/m1/200', 
    topics: ['1', '3'], 
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
  // --- PERSONAL FINANCE EXPERTS (Topic ID: 5) ---
  { 
    id: 'm11', 
    name: 'Võ Tấn Phát', 
    role: UserRole.MENTOR, 
    isActivated: true, 
    avatarUrl: 'https://picsum.photos/seed/m11/200', 
    topics: ['5'], 
    hourlyRate: 300000, 
    bio: 'Chuyên gia hoạch định tài chính cá nhân (CFP). 10 năm kinh nghiệm quản lý quỹ đầu tư.',
    rating: 4.9, 
    reviewCount: 42, 
    charityAccountNumber: '2000', 
    email: 'phat@test.com' 
  },
  { 
    id: 'm12', 
    name: 'Shark Hưng (Fake)', 
    role: UserRole.MENTOR, 
    isActivated: true, 
    avatarUrl: 'https://picsum.photos/seed/m12/200', 
    topics: ['5', '3'], 
    hourlyRate: 500000, 
    bio: 'Nhà đầu tư thiên thần, chia sẻ kiến thức về khởi nghiệp và quản lý dòng tiền cá nhân.',
    rating: 5.0, 
    reviewCount: 200, 
    charityAccountNumber: '1111', 
    email: 'hung@test.com' 
  },
  // --- OTHER MENTORS ---
  { id: 'm4', name: 'Phạm Thị D', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m4/200', topics: ['3'], hourlyRate: 70000, rating: 4.2, reviewCount: 30, charityAccountNumber: '2000', email: 'm4@test.com' },
  { id: 'm5', name: 'Hoàng Văn E', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m5/200', topics: ['4'], hourlyRate: 120000, rating: 4.9, reviewCount: 80, charityAccountNumber: '1111', email: 'm5@test.com' },
  { id: 'm6', name: 'Đỗ Thị F', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m6/200', topics: ['5'], hourlyRate: 90000, rating: 4.6, reviewCount: 25, charityAccountNumber: '2000', email: 'm6@test.com', bio: 'Hướng dẫn đầu tư chứng khoán cơ bản cho người mới bắt đầu.' },
  { id: 'm7', name: 'Vũ Văn G', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m7/200', topics: ['1', '2'], hourlyRate: 150000, rating: 4.7, reviewCount: 50, charityAccountNumber: '1111', email: 'm7@test.com' },
  { id: 'm8', name: 'Ngô Thị H', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m8/200', topics: ['3', '6'], hourlyRate: 60000, rating: 4.4, reviewCount: 15, charityAccountNumber: '2000', email: 'm8@test.com' },
  { id: 'm9', name: 'Bùi Văn I', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m9/200', topics: ['4'], hourlyRate: 110000, rating: 4.8, reviewCount: 60, charityAccountNumber: '1111', email: 'm9@test.com' },
  { id: 'm10', name: 'Đặng Thị K', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/seed/m10/200', topics: ['2'], hourlyRate: 80000, rating: 4.3, reviewCount: 20, charityAccountNumber: '2000', email: 'm10@test.com' },
];
