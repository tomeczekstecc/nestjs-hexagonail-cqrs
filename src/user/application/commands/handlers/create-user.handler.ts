import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { User } from 'src/user/domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../ports/user.repository.port';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) throw new Error('User already exists');

    const user = User.create(command.name, command.email);
    const savedUser = await this.userRepository.save(user);

    const userWithEvents = this.publisher.mergeObjectContext(savedUser);
    userWithEvents.commit();

    return savedUser;
  }
}
