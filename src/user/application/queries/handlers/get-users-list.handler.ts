import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../ports/user.repository.port';
import { User } from 'src/user/domain/entities/user.entity';
import { GetUsersListQuery } from '../get-usres-list.query';

@QueryHandler(GetUsersListQuery)
export class GerUsersListHandler implements IQueryHandler<GerUsersListHandler> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
