import client from '../lib/axios';
import { User, UserRole, Booking, AvailabilitySlot } from '../types';

export const api = {
  auth: {
    login: async (role: UserRole) => {
      const { data } = await client.post<User>('/auth/login', { role });
      return data;
    },
    activate: async (userId: string) => {
      const { data } = await client.post<User>(`/auth/activate`, { userId });
      return data;
    }
  },
  users: {
    get: async (id: string) => {
      const { data } = await client.get<User & { stats: any }>(`/users/${id}`);
      return data;
    }
  },
  mentors: {
    list: async () => {
      const { data } = await client.get<User[]>('/mentors');
      return data;
    }
  },
  slots: {
    list: async (mentorId?: string) => {
      const params = mentorId ? { mentorId } : {};
      const { data } = await client.get<AvailabilitySlot[]>('/slots', { params });
      return data;
    },
    create: async (slot: Partial<AvailabilitySlot>) => {
      const { data } = await client.post<AvailabilitySlot>('/slots', slot);
      return data;
    },
    createMultiple: async (slots: Partial<AvailabilitySlot>[]) => {
      const { data } = await client.post<AvailabilitySlot[]>('/slots/batch', { slots });
      return data;
    },
    delete: async (id: string) => {
      await client.delete(`/slots/${id}`);
    }
  },
  bookings: {
    list: async (userId: string) => {
      const { data } = await client.get<Booking[]>('/bookings', { params: { userId } });
      return data;
    },
    get: async (id: string) => {
      const { data } = await client.get<Booking>(`/bookings/${id}`);
      return data;
    },
    create: async (bookingData: Partial<Booking>) => {
      const { data } = await client.post<Booking>('/bookings', bookingData);
      return data;
    },
    cancel: async (id: string) => {
      await client.delete(`/bookings/${id}`);
    },
    pay: async (id: string) => {
      const { data } = await client.post<Booking>(`/bookings/${id}/pay`);
      return data;
    }
  }
};