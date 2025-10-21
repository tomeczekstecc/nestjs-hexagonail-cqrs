import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserUseCase,
} from '../application/use-cases/create-user.use-case';
import { User } from '../domain/entities/user.entity';
import { GetUsersListUseCase } from '../application/use-cases/get-users-list.use-case';
import { GetUserUseCase } from '../application/use-cases/get-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import {
  UpdateUserDto,
  UpdateUserUseCase,
} from '../application/use-cases/update-user.use-case';

@Controller('users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUsersList: GetUsersListUseCase,
    private getUserWithId: GetUserUseCase,
    private deleteUserWithId: DeleteUserUseCase,
    private updateUserWithId: UpdateUserUseCase,
  ) {}
  private mapUserToResponse(user: User) {
    console.log({ email: user.getEmail() });

    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      accountAge: user.getAccountAge(),
    };
  }

  @Post()
  async createUser(@Body() request: CreateUserDto) {
    const user = await this.createUserUseCase.execute(request);
    return this.mapUserToResponse(user);
  }

  @Get()
  async getUsers() {
    return await this.getUsersList.execute();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.getUserWithId.execute(id);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.deleteUserWithId.execute(id);
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() request: UpdateUserDto,
  ) {
    return await this.updateUserWithId.execute(id, request);
  }
}
