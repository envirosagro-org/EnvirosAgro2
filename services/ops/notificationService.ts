
import { useUserStore } from '../../store/userStore';
import { audioManager } from '../audioService';

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
   * Checks if a notification type is allowed by the user.
   */
  private isNotificationAllowed(type: 'email' | 'whatsapp' | 'browser'): boolean {
    const user = useUserStore.getState().user;
    if (!user || user.settings?.notificationsEnabled === false) return false;

    if (type === 'email') return !!user.settings?.emailNotifications;
    if (type === 'whatsapp') return !!user.settings?.whatsappNotifications;
    return true; // Browser defaults to true if master switch is on
  }

  /**
   * Requests permission to show browser notifications.
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
   */
  public sendNotification(title: string, options?: NotificationOptions) {
    // Play the Agromusika synthesized acoustic alert chime
    try {
      audioManager.playNotificationPing();
    } catch (e) {
      console.warn('Notification audio trigger failed:', e);
    }

    if (!('Notification' in window) || !this.isNotificationAllowed('browser')) return;

    if (Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          icon: '/logo.png',
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

  /**
   * Sends an email notification.
   */
  public async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    if (!this.isNotificationAllowed('email')) {
      console.log(`[NotificationService] Email to ${to} blocked by user settings.`);
      return false;
    }
    console.log(`[NotificationService] Sending Simulated Email to ${to}: ${subject}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 800));
  }

  /**
   * Sends a WhatsApp notification.
   */
  public async sendWhatsApp(to: string, message: string): Promise<boolean> {
    if (!this.isNotificationAllowed('whatsapp')) {
      console.log(`[NotificationService] WhatsApp to ${to} blocked by user settings.`);
      return false;
    }
    console.log(`[NotificationService] Sending Simulated WhatsApp to ${to}: ${message}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
  }

  /**
   * Sends a system-wide app update notification.
   */
  public async broadcastAppUpdate(version: string, changelog: string) {
    const user = useUserStore.getState().user;
    const title = `EnvirosAgro Update v${version}`;
    const message = `A new organizational shard has been successfully merged: ${changelog}`;

    // 1. Browser Notification
    this.sendNotification(title, { body: message });

    // 2. Email if allowed
    if (user?.email) {
      this.sendEmail(user.email, title, message);
    }

    // 3. WhatsApp if allowed and phone exists
    if (user?.phone) {
      this.sendWhatsApp(user.phone, message);
    }
  }
}

export const notificationService = NotificationService.getInstance();
