import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@src/users/repositories/users.repository';
import { LoginDto } from '@src/auth/dtos/login.dto';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';
import { encryptPassword } from '@src/shared/helpers/password.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: CreateUserMapper,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userRepository.findUserByEmail(email, true);
    if (!user) {
      return null;
    }

    try {
      const passwordHash = encryptPassword(password);
      const isMatch = passwordHash === user.password;
      if (!isMatch) {
        return null;
      }
    } catch (error) {
      return null;
    }

    return this.userMapper.map(user);
  }

  async login(user: any) {
    const payload = user ? { email: user.email, sub: user.sub.id } : {};
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET as string,
      }),
    };
  }
}
