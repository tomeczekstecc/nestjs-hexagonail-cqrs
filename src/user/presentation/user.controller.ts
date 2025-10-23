import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../domain/entities/user.entity';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { GetUsersListQuery } from '../application/queries/get-usres-list.query';
import { GetUserQuery } from '../application/queries/get-user.query';
import { DeleteUserCommand } from '../application/commands/delete-user.command';
import { UpdateUserCommand } from '../application/commands/update-user.command';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
  async createUser(
    @Body()
    request: CreateUserCommand, // DTO: bardzo możliwe że to mogą być inne DTO, oddzielne, tu akurat pasują takie
  ) {
    const command = new CreateUserCommand(request.name, request.email);
    const user = await this.commandBus.execute<CreateUserCommand, User>(
      command,
    );
    return this.mapUserToResponse(user);
  }

  @Get()
  async getUsers() {
    const query = new GetUsersListQuery();
    return await this.queryBus.execute<GetUsersListQuery, User[]>(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const user = await this.queryBus.execute<GetUserQuery, User>(query);
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    return await this.commandBus.execute<DeleteUserCommand, string>(command);
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() request: UpdateUserCommand,
  ) {
    const command = new UpdateUserCommand(id, request.email, request.name);
    const user = await this.commandBus.execute<UpdateUserCommand, User>(
      command,
    );
    return this.mapUserToResponse(user);
  }
}
