import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { User } from 'src/user/domain/entities/user.entity';

export class GetUsersListUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
