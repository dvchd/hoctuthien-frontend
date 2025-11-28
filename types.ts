
export enum UserRole {
  MENTEE = 'MENTEE',
  MENTOR = 'MENTOR'
}

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActivated: boolean; // True if paid 10k
  avatarUrl: string;
  // Mentor specific
  bio?: string;
  topics?: string[];
  hourlyRate?: number; // Donation amount required
  charityAccountNumber?: string; // The 4-digit account (e.g. 2000)
}

export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String - New field to define specific end time
  isBooked: boolean;
}

export interface Booking {
  id: string;
  mentorId: string;
  menteeId: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: BookingStatus;
  meetLink?: string;
  cost: number;
  paymentCode: string; // The content syntax for transfer
}

export interface Transaction {
  id: string;
  transactionTime: string;
  amount: number;
  description: string;
  accountNumber: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
}

// Leaderboard Types
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type RankingMetric = 'donation' | 'sessions';

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    role: UserRole;
  };
  value: number; // Could be money or count
  change?: number; // Rank change (optional for visual flair)
}

export const CHARITY_ACCOUNTS = [
  { code: '2000', name: 'Hoàng Hoa Trung - Dự án Nuôi Em', bank: 'MBBank' },
  { code: '1111', name: 'Quỹ Trò Nghèo Vùng Cao', bank: 'MBBank' }
];

export const AVAILABLE_TOPICS: Topic[] = [
  { id: '1', name: 'Công nghệ thông tin', icon: '💻' },
  { id: '2', name: 'Marketing', icon: '📢' },
  { id: '3', name: 'Kỹ năng mềm', icon: '🤝' },
  { id: '4', name: 'Ngoại ngữ', icon: '🗣️' },
  { id: '5', name: 'Tài chính cá nhân', icon: '💰' },
  { id: '6', name: 'Design / Nghệ thuật', icon: '🎨' },
];