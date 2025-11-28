
import { AvailabilitySlot } from '../types';

export const SLOTS_DATA: AvailabilitySlot[] = [
  { id: 's1', mentorId: 'm1', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), isBooked: false },
  { id: 's2', mentorId: 'm1', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 5400000).toISOString(), isBooked: false },
  // Finance Expert Slot
  { id: 's3', mentorId: 'm11', startTime: new Date(Date.now() + 90000000).toISOString(), endTime: new Date(Date.now() + 90000000 + 3600000).toISOString(), isBooked: false },
];
