import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { User } from 'src/user/domain/entities/user.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../ports/user.repository.port';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, User>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new NotFoundException('User not found');

    if (command.email) user.updateEmail(command.email);
    if (command.name) user.updateName(command.name);

    return this.userRepository.save(user);
  }
}
