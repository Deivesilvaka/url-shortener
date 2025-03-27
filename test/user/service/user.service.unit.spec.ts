import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@src/users/services/user.service';
import { UserRepository } from '@src/users/repositories/users.repository';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { encryptPassword } from '@src/shared/helpers/password.helper';
import { CreateUserMapper } from '@src/users/mappers/create-user.mapper';
import { UrlMapper } from '@src/url/mapper/url.mapper';
import { UsersEntity } from '@src/users/entities/user.entity';

jest.mock('@src/shared/helpers/password.helper');
jest.mock('@src/users/mappers/create-user.mapper');
jest.mock('@src/url/mapper/url.mapper');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let createUserMapper: jest.Mocked<CreateUserMapper>;
  let urlMapper: jest.Mocked<UrlMapper>;

  beforeEach(async () => {
    userRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findUserAndUrlsId: jest.fn(),
    } as any;

    createUserMapper = {
      map: jest.fn(),
    } as any;

    urlMapper = {
      mapMany: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepository },
        { provide: CreateUserMapper, useValue: createUserMapper },
        { provide: UrlMapper, useValue: urlMapper },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'aaaaaa',
        phoneNumber: '08007777000',
      };

      const savedUser: UsersEntity = {
        id: 'user123',
        email: createUserDto.email,
        password: 'encryptedPassword',
        name: 'aaaaaa',
        phoneNumber: '08007777000',
      } as UsersEntity;

      userRepository.findUserByEmail.mockResolvedValue(null);

      userRepository.createUser.mockResolvedValue(savedUser);

      (encryptPassword as jest.Mock).mockReturnValue('encryptedPassword');

      createUserMapper.map.mockReturnValue({
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        phoneNumber: savedUser.phoneNumber,
      });

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual({
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        phoneNumber: savedUser.phoneNumber,
      });
      expect(userRepository.createUser).toHaveBeenCalledWith(createUserDto);
      expect(createUserMapper.map).toHaveBeenCalledWith(savedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'aaaaaa',
        phoneNumber: '08007777000',
      };

      const existingUser: UsersEntity = {
        id: 'user123',
        email: createUserDto.email,
        password: 'encryptedPassword',
      } as UsersEntity;

      userRepository.findUserByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getUserUrls', () => {
    it('should return user with URLs', async () => {
      const userId = 'user123';

      const user = {
        id: userId,
        email: 'test@example.com',
        name: 'aaaaaa',
        phoneNumber: '08007777000',
        password: 'aaaaa',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: new Date(),
        deleted_at: new Date(),
        urls: [
          {
            fullLink: 'https://example.com/abc123',
            shortKey: 'abc123',
            visits: 0,
            createdAt: new Date(),
            deletedAt: new Date(),
            deleted_at: new Date(),
            url: 'https://example.com',
            id: 'aaaaa',
            updatedAt: new Date(),
          },
        ],
      };

      const mappedUrls = user.urls.map((url) => ({
        fullLink: url.fullLink,
        shortKey: url.shortKey,
        visits: url.visits,
        createdAt: url.createdAt,
        deletedAt: url.deletedAt,
        deleted_at: url.deleted_at,
        id: url.id,
        updatedAt: url.updatedAt,
        url: url.url,
      }));

      userRepository.findUserAndUrlsId.mockResolvedValue(user);
      urlMapper.mapMany.mockReturnValue(mappedUrls);

      const expectedResult = {
        id: userId,
        email: 'test@example.com',
        name: 'aaaaaa',
        phoneNumber: '08007777000',
        password: 'aaaaa',
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
        deletedAt: user.deletedAt,
        deleted_at: user.deleted_at,
        urls: mappedUrls,
      };

      const result = await userService.getUserUrls(userId);

      // Comparação
      expect(result).toEqual(expectedResult);
      expect(userRepository.findUserAndUrlsId).toHaveBeenCalledWith(userId);
      expect(urlMapper.mapMany).toHaveBeenCalledWith(user.urls);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'user123';

      userRepository.findUserAndUrlsId.mockResolvedValue(null);

      await expect(userService.getUserUrls(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
