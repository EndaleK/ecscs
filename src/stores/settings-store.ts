import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Theme, Settings } from '../types';

export type ReminderTime = '1hour' | '1day' | '1week';

interface SettingsState extends Settings {
  sidebarOpen: boolean;
  // Additional notification settings
  notificationPermission: NotificationPermission | 'default';
  defaultReminderTime: ReminderTime;
  soundEnabled: boolean;

  // Actions
  setLanguage: (language: Language) => void;
  setNotifications: (enabled: boolean) => void;
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setNotificationPermission: (permission: NotificationPermission | 'default') => void;
  setDefaultReminderTime: (time: ReminderTime) => void;
  setSoundEnabled: (enabled: boolean) => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      notificationsEnabled: false,
      theme: 'light',
      sidebarOpen: true,
      notificationPermission: 'default',
      defaultReminderTime: '1day',
      soundEnabled: true,

      setLanguage: (language) => {
        set({ language });
      },

      setNotifications: (enabled) => {
        set({ notificationsEnabled: enabled });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setNotificationPermission: (permission) => {
        set({ notificationPermission: permission });
      },

      setDefaultReminderTime: (time) => {
        set({ defaultReminderTime: time });
      },

      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
      },

      requestNotificationPermission: async () => {
        if (!('Notification' in window)) {
          console.warn('This browser does not support notifications');
          return 'denied';
        }

        const permission = await Notification.requestPermission();
        set({
          notificationPermission: permission,
          notificationsEnabled: permission === 'granted'
        });
        return permission;
      },
    }),
    {
      name: 'ecscs-settings',
      partialize: (state) => ({
        language: state.language,
        notificationsEnabled: state.notificationsEnabled,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        defaultReminderTime: state.defaultReminderTime,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
