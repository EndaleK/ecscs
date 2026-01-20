import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Reminder } from '../types';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'sent'>) => string;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => void;
  deleteReminder: (id: string) => void;
  markReminderSent: (id: string) => void;
  getUpcomingReminders: () => Reminder[];
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: (reminderData) => {
        const id = uuidv4();
        const newReminder: Reminder = {
          ...reminderData,
          id,
          sent: false,
        };
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
        return id;
      },

      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      markReminderSent: (id) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, sent: true } : reminder
          ),
        }));
      },

      getUpcomingReminders: () => {
        const now = new Date();
        return get()
          .reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.date);
            return !reminder.sent && reminderDate > now;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
    }),
    {
      name: 'ecscs-reminders',
      partialize: (state) => ({ reminders: state.reminders }),
    }
  )
);
