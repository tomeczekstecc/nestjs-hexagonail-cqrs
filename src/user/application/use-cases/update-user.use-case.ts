import { Inject, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';

export interface UpdateUserDto {
  // in the same file for dimplecity
  name?: string;
  email?: string;
}

export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Uset not found');

    if (dto.email) user.updateEmail(dto.email);
    if (dto.name) user.updateName(dto.name);
  }
}
