import { Injectable } from '@nestjs/common';
import { EmailNotificationPort } from 'src/user/application/ports/email-notification.port';

@Injectable()
export class ConsoleEmailAdapter implements EmailNotificationPort {
  async sendActivationEmail(email: string, name: string): Promise<string> {
    console.log('[EMAIL] sending activation emaol');
    console.log(`[EMAIL] To: ${email}`);
    console.log(`[EMAIL] Name: ${name}`);
    return new Promise((r) => r('done'));
  }
}
