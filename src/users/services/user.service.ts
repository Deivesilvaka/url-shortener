import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { UserRepository } from '@src/users/repositories/users.repository';
import { encryptPassword } from '@src/shared/helpers/password.helper';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';
import { UrlMapper } from '@src/url/mapper/url.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserMapper: CreateUserMapper,
    private readonly urlMapper: UrlMapper,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    let user = await this.userRepository.findUserByEmail(createUserDto.email);

    if (user) {
      throw new ConflictException('User with this email already exists!');
    }

    createUserDto.password = encryptPassword(createUserDto.password);

    user = await this.userRepository.createUser(createUserDto);

    return this.createUserMapper.map(user);
  }

  async getUserUrls(userId: string) {
    const user = await this.userRepository.findUserAndUrlsId(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    user.urls = this.urlMapper.mapMany(user.urls ?? []);

    return user;
  }
}
