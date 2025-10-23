import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepositiry } from './infrastructure/adapters/in-memory-user.repositoty';
import { UserController } from './presentation/user.controller';
import { CommandsHandlers } from './application/commands/handlers';
import { QueryHandlers } from './application/queries/handlers';

@Module({
  providers: [
    ...CommandsHandlers,
    ...QueryHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepositiry,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
