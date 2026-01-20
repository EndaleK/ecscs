import { useCallback, useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, body: string, icon?: string) => void;
  checkPermission: () => NotificationPermission;
}

/**
 * Custom hook for browser notifications
 * Provides functionality to check support, request permission, and send notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Check if notifications are supported on mount
  useEffect(() => {
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  /**
   * Check current notification permission status
   */
  const checkPermission = useCallback((): NotificationPermission => {
    if (!isSupported) {
      return 'denied';
    }
    const currentPermission = Notification.permission as NotificationPermission;
    setPermission(currentPermission);
    return currentPermission;
  }, [isSupported]);

  /**
   * Request notification permission from the user
   */
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      const permissionResult = result as NotificationPermission;
      setPermission(permissionResult);
      return permissionResult;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, [isSupported]);

  /**
   * Send a browser notification
   * @param title - The notification title
   * @param body - The notification body text
   * @param icon - Optional icon URL for the notification
   */
  const sendNotification = useCallback(
    (title: string, body: string, icon?: string) => {
      if (!isSupported) {
        console.warn('Browser notifications are not supported');
        return;
      }

      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: `ecscs-reminder-${Date.now()}`,
          requireInteraction: true,
        });

        // Auto-close notification after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    },
    [isSupported, permission]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    checkPermission,
  };
}
