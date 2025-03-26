import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@src/users/entities/user.entity';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async findUserById(id: string): Promise<UsersEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(
    email: string,
    findPassword: boolean = false,
  ): Promise<UsersEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        password: findPassword,
      },
    });
  }

  async findUserAndUrlsId(id: string): Promise<UsersEntity | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relationLoadStrategy: 'query',
      relations: ['urls'],
    });
  }

  async createUser(userData: CreateUserDto): Promise<UsersEntity> {
    return this.userRepository.save(userData);
  }
}
