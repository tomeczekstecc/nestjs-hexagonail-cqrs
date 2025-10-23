import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [UserModule, CqrsModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
