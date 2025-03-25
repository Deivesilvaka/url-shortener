import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { UserRepository } from '@src/users/repositories/users.repository';
import { encryptPassword } from '@src/shared/helpers/password.helper';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserMapper: CreateUserMapper,
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
}
