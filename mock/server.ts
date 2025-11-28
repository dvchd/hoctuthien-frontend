
import client from '../lib/axios';
import { User, UserRole, Booking, BookingStatus, PaymentStatus, AvailabilitySlot } from '../types';

// --- MOCK DATABASE ---
const db = {
  users: [
    { 
      id: 'm1', 
      name: 'Nguyễn Văn A', 
      email: 'a@test.com', 
      role: UserRole.MENTOR, 
      isActivated: true, 
      avatarUrl: 'https://picsum.photos/100/100', 
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
      avatarUrl: 'https://picsum.photos/101/101', 
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
      avatarUrl: 'https://picsum.photos/102/102', 
      topics: ['1', '6'], 
      hourlyRate: 200000, 
      bio: 'Chuyên gia AI/ML. Tiến sĩ Đại học Stanford.', 
      charityAccountNumber: '2000',
      rating: 5.0,
      reviewCount: 12
    },
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
      
      // Normalize URL: Remove /api prefix, remove Query Params, and ensure leading slash
      // Example: "/api/bookings/123?foo=bar" -> "/bookings/123"
      let route = url.replace(/^\/?api/, '');
      const queryIndex = route.indexOf('?');
      if (queryIndex !== -1) {
        route = route.substring(0, queryIndex);
      }
      if (!route.startsWith('/')) route = '/' + route;

      console.log(`[MOCK SERVER] ${method.toUpperCase()} ${url} -> ${route}`, body || params);

      // --- AUTH ---
      if (route === '/auth/login' && method === 'post') {
        const newUser: User = {
          id: generateId(),
          name: body.role === UserRole.MENTOR ? 'Demo Giảng Viên' : 'Demo Học Viên',
          email: 'demo@hoctuthien.com',
          role: body.role,
          isActivated: false,
          avatarUrl: `https://picsum.photos/200/200?random=${Math.random()}`,
          topics: body.role === UserRole.MENTOR ? ['1', '2'] : [],
          hourlyRate: 50000,
          charityAccountNumber: '2000',
          rating: 0,
          reviewCount: 0
        };
        db.users.push(newUser);
        return Promise.resolve({ data: newUser, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (route === '/auth/activate' && method === 'post') {
        const user = db.users.find(u => u.id === body.userId);
        if (user) user.isActivated = true;
        return Promise.resolve({ data: user, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- MENTORS ---
      if (route === '/mentors' && method === 'get') {
        const mentors = db.users.filter(u => u.role === UserRole.MENTOR);
        return Promise.resolve({ data: mentors, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- SLOTS ---
      if (route === '/slots' && method === 'get') {
        let results = db.slots;
        if (params?.mentorId) {
          results = results.filter(s => s.mentorId === params.mentorId);
        }
        return Promise.resolve({ data: results, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      if (route === '/slots' && method === 'post') {
        const newSlot = { ...body, id: generateId(), isBooked: false };
        db.slots.push(newSlot);
        return Promise.resolve({ data: newSlot, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      if (route === '/slots/batch' && method === 'post') {
        const newSlots = body.slots.map((s: any) => ({ ...s, id: generateId(), isBooked: false }));
        db.slots.push(...newSlots);
        return Promise.resolve({ data: newSlots, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      // DELETE /slots/:id
      const slotDeleteMatch = route.match(/^\/slots\/([^\/]+)$/);
      if (slotDeleteMatch && method === 'delete') {
        const id = slotDeleteMatch[1];
        db.slots = db.slots.filter(s => s.id !== id);
        return Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // --- BOOKINGS ---
      // LIST
      if (route === '/bookings' && method === 'get') {
        const userId = params?.userId;
        const results = db.bookings.filter(b => b.menteeId === userId || b.mentorId === userId);
        return Promise.resolve({ data: results, status: 200, statusText: 'OK', headers: {}, config: error.config });
      }

      // CREATE
      if (route === '/bookings' && method === 'post') {
        const newBooking = { 
          ...body, 
          id: generateId(), 
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.UNPAID,
          paymentCode: `HOCTUTHIEN HOCPHI ${generateId()}`,
          meetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}`
        };
        // Update slot status
        const slotIndex = db.slots.findIndex(s => s.startTime === newBooking.startTime && s.mentorId === newBooking.mentorId);
        if (slotIndex >= 0) db.slots[slotIndex].isBooked = true;
        
        db.bookings.push(newBooking);
        return Promise.resolve({ data: newBooking, status: 201, statusText: 'Created', headers: {}, config: error.config });
      }

      // HANDLE SINGLE BOOKING (GET, DELETE)
      const bookingMatch = route.match(/^\/bookings\/([^\/]+)$/);
      if (bookingMatch) {
        const id = bookingMatch[1];
        
        if (method === 'get') {
          const booking = db.bookings.find(b => b.id === id);
          if (booking) {
            return Promise.resolve({ data: booking, status: 200, statusText: 'OK', headers: {}, config: error.config });
          }
          return Promise.reject({ response: { status: 404 } });
        }

        if (method === 'delete') {
          const bookingIndex = db.bookings.findIndex(b => b.id === id);
          if (bookingIndex !== -1) {
            const booking = db.bookings[bookingIndex];
            
            if (booking.paymentStatus === PaymentStatus.PAID) {
               return Promise.reject({ response: { status: 400, data: { message: "Cannot cancel paid booking" } } });
            }

            // Free up the slot logic
            const slot = db.slots.find(s => 
              s.mentorId === booking.mentorId && 
              new Date(s.startTime).getTime() === new Date(booking.startTime).getTime()
            );
            
            if (slot) {
              slot.isBooked = false;
            }

            db.bookings.splice(bookingIndex, 1);
            return Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: error.config });
          }
          return Promise.reject({ response: { status: 404 } });
        }
      }

      // PAY /bookings/:id/pay
      const bookingPayMatch = route.match(/^\/bookings\/([^\/]+)\/pay$/);
      if (bookingPayMatch && method === 'post') {
        const id = bookingPayMatch[1];
        const booking = db.bookings.find(b => b.id === id);
        if (booking) {
          booking.paymentStatus = PaymentStatus.PAID;
          return Promise.resolve({ data: booking, status: 200, statusText: 'OK', headers: {}, config: error.config });
        }
        return Promise.reject({ response: { status: 404 } });
      }
    }
    return Promise.reject(error);
  });
};
