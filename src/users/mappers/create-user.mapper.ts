import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/user.entity';

Injectable();
export class CreateUserMapper {
  map(user: UsersEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }
}
