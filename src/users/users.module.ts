import { Module } from '@nestjs/common';
import { UsersController } from '@src/users/controllers/users.controller';
import { ThrottlerProvider } from '@src/shared/providers/throttler/throttler.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@src/users/entities/user.entity';
import { UserService } from '@src/users/services/user.service';
import { UserRepository } from '@src/users/repositories/users.repository';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';
import { UrlRepository } from '@src/url/repositories/url.repository';
import { UrlEntity } from '@src/url/entities/url.entity';
import { UrlMapper } from '@src/url/mapper/url.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UrlEntity])],
  controllers: [UsersController],
  providers: [
    ThrottlerProvider,
    UserRepository,
    CreateUserMapper,
    UserService,
    UrlRepository,
    UrlMapper,
  ],
  exports: [UserRepository, CreateUserMapper],
})
export class UserModule {}
