import { AggregateRoot } from '@nestjs/cqrs';
import { Email, UserId } from '../value-objects';
import { UserCreatedEvent } from '../events/user-created.event';

export class User extends AggregateRoot {
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }
  static create(name: string, email: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    const userId = new UserId();

    const user = new User(
      userId,
      name.trim(),
      new Email(email),
      new Date(),
      new Date(),
    );
    user.apply(new UserCreatedEvent(userId.getValue(), user.getName(), email));

    return user;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  updateEmail(email: string) {
    this.email = new Email(email);
    this.updatedAt = new Date();
  }

  getAccountAge(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
