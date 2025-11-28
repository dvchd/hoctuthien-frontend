
import { Booking, BookingStatus, PaymentStatus } from '../types';

export const BOOKINGS_DATA: Booking[] = [
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
];
