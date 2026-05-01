
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Requests permission to show browser notifications.
   * @returns A promise that resolves to the permission status ('granted', 'denied', or 'default').
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Returns the current notification permission status.
   */
  public getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Displays a browser notification.
   * @param title The title of the notification.
   * @param options Notification options (body, icon, etc.).
   */
  public sendNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          icon: '/logo.png', // Fallback icon path if available
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }
}

export const notificationService = NotificationService.getInstance();
