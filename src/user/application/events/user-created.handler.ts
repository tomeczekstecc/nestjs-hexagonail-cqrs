import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from 'src/user/domain/events/user-created.event';
import {
  EMAIL_NOTIFICATION_SERVICE,
  EmailNotificationPort,
} from '../ports/email-notification.port';
import { Inject } from '@nestjs/common';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @Inject(EMAIL_NOTIFICATION_SERVICE)
    private readonly emailService: EmailNotificationPort,
  ) {}

  async handle(event: UserCreatedEvent) {
    await this.emailService.sendActivationEmail(event.email, event.name);
  }
}
