import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from '@src/url/entities/url.entity';
import { UrlController } from '@src/url/controllers/url.controller';
import { UrlRepository } from '@src/url/repositories/url.repository';
import { UrlService } from '@src/url/services/url.service';
import { UserRepository } from '@src/users/repositories/users.repository';
import { UsersEntity } from '@src/users/entities/user.entity';
import { UrlMapper } from '@src/url/mapper/url.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity, UsersEntity])],
  controllers: [UrlController],
  providers: [UrlRepository, UrlService, UserRepository, UrlMapper],
})
export class UrlModule {}
