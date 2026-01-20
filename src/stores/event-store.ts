import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Event } from '../types';

interface EventState {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => string;
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  getEventsByCategory: (categoryId: string) => Event[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (eventData) => {
        const id = uuidv4();
        const newEvent: Event = {
          ...eventData,
          id,
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
        return id;
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      getEventsByDate: (date) => {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        return get().events.filter((event) => {
          const eventStartDate = new Date(event.startDate);
          eventStartDate.setHours(0, 0, 0, 0);
          const eventEndDate = new Date(event.endDate);
          eventEndDate.setHours(0, 0, 0, 0);

          return targetDate >= eventStartDate && targetDate <= eventEndDate;
        });
      },

      getEventsByCategory: (categoryId) => {
        return get().events.filter((event) => event.categoryId === categoryId);
      },
    }),
    {
      name: 'ecscs-events',
      partialize: (state) => ({ events: state.events }),
    }
  )
);
