import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepositiry } from './infrastructure/adapters/in-memory-user.repositoty';
import { UserController } from './presentation/user.controller';
import { CommandsHandlers } from './application/commands/handlers';
import { QueryHandlers } from './application/queries/handlers';
import { EMAIL_NOTIFICATION_SERVICE } from './application/ports/email-notification.port';
import { ConsoleEmailAdapter } from './infrastructure/adapters/console-email.adapter';
import { EventHandlers } from './application/events';

@Module({
  providers: [
    ...CommandsHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepositiry,
    },
    {
      provide: EMAIL_NOTIFICATION_SERVICE,
      useClass: ConsoleEmailAdapter,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
