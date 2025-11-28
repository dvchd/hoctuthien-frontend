import client from '../lib/axios';
import { User, UserRole, Booking, BookingStatus, AvailabilitySlot } from '../types';

// --- MOCK DATABASE ---
const db = {
  users: [
    { id: 'm1', name: 'Nguyễn Văn A', email: 'a@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/100/100', topics: ['1', '3', '5'], hourlyRate: 100000, bio: '5 năm kinh nghiệm Fullstack Developer.', charityAccountNumber: '2000' },
    { id: 'm2', name: 'Trần Thị B', email: 'b@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/101/101', topics: ['2', '4', '6'], hourlyRate: 50000, bio: 'Marketing Manager tại công ty đa quốc gia.', charityAccountNumber: '1111' },
    { id: 'm3', name: 'Lê C', email: 'c@test.com', role: UserRole.MENTOR, isActivated: true, avatarUrl: 'https://picsum.photos/102/102', topics: ['1', '6'], hourlyRate: 200000, bio: 'Chuyên gia AI/ML.', charityAccountNumber: '2000' },
  ] as User[],
  slots: [
    { id: 's1', mentorId: 'm1', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), isBooked: false },
    { id: 's2', mentorId: 'm1', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 5400000).toISOString(), isBooked: false },
  ] as AvailabilitySlot[],
  bookings: [] as Booking[]
};

const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

// --- INITIALIZE INTERCEPTORS ---
export const initMockServer = () => {
  client.interceptors.request.use(async (config) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    return config;
  });

  client.interceptors.response.use(undefined, (error) => {
    if (error.config && error.config.url) {
      const { method, url, data: bodyStr, params } = error.config;
      const body = bodyStr ? JSON.parse(bodyStr) : {};
      
      console.log(`[MOCK SERVER] ${method.toUpperCase()} ${url}`, body || params);

      // --- AUTH ---
      if (url === '/auth/login' && method === 'post') {
        const newUser: User = {
          id: generateId(),
          name: body.role === UserRole.MENTOR ? 'Demo Giảng Viên' : 'Demo Học Viên',
          email: 'demo@hoctuthien.com',
          role: body.role,
          isActivated: false,
          avatarUrl: `https://picsum.photos/200/200?random=${Math.random()}`,
          topics: body.role === UserRole.MENTOR ? ['1', '2'] : [],
          hourlyRate: 50000,
          charityAccountNumber: '2000'
        };
        db.users.push(newUser);
        return Promise.resolve({ data: newUser, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (url === '/auth/activate' && method === 'post') {
        const user = db.users.find(u => u.id === body.userId);
        if (user) user.isActivated = true;
        return Promise.resolve({ data: user, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- MENTORS ---
      if (url === '/mentors' && method === 'get') {
        const mentors = db.users.filter(u => u.role === UserRole.MENTOR);
        return Promise.resolve({ data: mentors, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- SLOTS ---
      if (url === '/slots' && method === 'get') {
        let results = db.slots;
        if (params?.mentorId) {
          results = results.filter(s => s.mentorId === params.mentorId);
        }
        return Promise.resolve({ data: results, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (url === '/slots' && method === 'post') {
        const newSlot = { ...body, id: generateId(), isBooked: false };
        db.slots.push(newSlot);
        return Promise.resolve({ data: newSlot, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      if (url === '/slots/batch' && method === 'post') {
        const newSlots = body.slots.map((s: any) => ({ ...s, id: generateId(), isBooked: false }));
        db.slots.push(...newSlots);
        return Promise.resolve({ data: newSlots, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      if (url.match(/\/slots\/.+/) && method === 'delete') {
        const id = url.split('/').pop();
        db.slots = db.slots.filter(s => s.id !== id);
        return Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- BOOKINGS ---
      if (url === '/bookings' && method === 'get') {
        const userId = params?.userId;
        const results = db.bookings.filter(b => b.menteeId === userId || b.mentorId === userId);
        return Promise.resolve({ data: results, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (url.match(/\/bookings\/.+/) && method === 'get') {
        const id = url.split('/')[2];
        const booking = db.bookings.find(b => b.id === id);
        return Promise.resolve({ data: booking, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (url === '/bookings' && method === 'post') {
        const newBooking = { ...body, id: generateId(), status: BookingStatus.PENDING_PAYMENT, paymentCode: `HOCTUTHIEN HOCPHI ${generateId()}` };
        // Update slot status
        const slotIndex = db.slots.findIndex(s => s.startTime === newBooking.startTime && s.mentorId === newBooking.mentorId);
        if (slotIndex >= 0) db.slots[slotIndex].isBooked = true;
        
        db.bookings.push(newBooking);
        return Promise.resolve({ data: newBooking, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      if (url.match(/\/bookings\/.+\/pay/) && method === 'post') {
        const id = url.split('/')[2];
        const booking = db.bookings.find(b => b.id === id);
        if (booking) {
          booking.status = BookingStatus.CONFIRMED;
          booking.meetLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}`;
        }
        return Promise.resolve({ data: booking, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }
    }
    return Promise.reject(error);
  });
};