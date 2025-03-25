import { Module } from '@nestjs/common';
import { UsersController } from '@src/users/controllers/users.controller';
import { ThrottlerProvider } from '@src/shared/providers/throttler/throttler.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@src/users/entities/user.entity';
import { UserService } from '@src/users/services/user.service';
import { UserRepository } from '@src/users/repositories/users.repository';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [ThrottlerProvider, UserRepository, CreateUserMapper, UserService],
  exports: [UserRepository, CreateUserMapper],
})
export class UserModule {}
