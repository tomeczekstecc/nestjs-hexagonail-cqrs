import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepositiry } from './infrastructure/adapters/in-memory-user.repositoty';
import { UserController } from './presentation/user.controller';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetUsersListUseCase } from './application/use-cases/get-users-list.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';

@Module({
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetUsersListUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepositiry,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
