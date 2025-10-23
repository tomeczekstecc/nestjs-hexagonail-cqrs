import { DeleteUserHandler } from './delete-user.hander';
import { CreateUserHandler } from './create-user.handler';
import { UpdateUserHandler } from './update-user.handler';

export const CommandsHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
];
