
import { Booking, BookingStatus, PaymentStatus } from '../types';
import { generateId } from './utils';
import { MENTORS_DATA } from './mentors';
import { MENTEES_DATA } from './mentees';
import { SLOTS_DATA } from './slots';
import { BOOKINGS_DATA } from './bookings';

// --- MOCK DATABASE ---
export const db = {
  users: [...MENTORS_DATA, ...MENTEES_DATA],
  slots: [...SLOTS_DATA],
  bookings: [...BOOKINGS_DATA]
};

// --- HELPER: Generate random history for new users ---
const generateRandomHistory = () => {
  // Generate random past bookings for mentors m4-m12 and mentees u4-u10
  // to populate their profile stats
  const extraBookings: Booking[] = [];
  
  // For Mentors (including new Finance experts)
  // We iterate through all mentors in DB to ensure everyone has some data
  const mentors = db.users.filter(u => u.role === 'MENTOR');

  for (const mentor of mentors) {
    // Only generate history if they don't have much (simple check)
    if (['m1', 'm2', 'm3'].includes(mentor.id)) continue; 

    const sessions = Math.floor(Math.random() * 20) + 5; // 5-25 sessions
    const rate = mentor.hourlyRate || 50000;
    
    for (let j = 0; j < sessions; j++) {
      extraBookings.push({
        id: generateId(),
        mentorId: mentor.id,
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
