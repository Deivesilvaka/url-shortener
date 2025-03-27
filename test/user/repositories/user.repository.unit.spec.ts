import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@src/users/repositories/users.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '@src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUserRepository: jest.Mocked<Repository<UsersEntity>>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const userId = 'user123';
      const mockUser = { id: userId, email: 'test@example.com' } as UsersEntity;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return null if no user is found by id', async () => {
      const userId = 'user123';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserById(userId);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const mockUser = { id: 'user123', email } as UsersEntity;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, email: true, phoneNumber: true, password: false },
      });
    });

    it('should return null if no user is found by email', async () => {
      const email = 'test@example.com';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserByEmail(email);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, email: true, phoneNumber: true, password: false },
      });
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Antedeguemon',
        phoneNumber: '08007777000',
      };
      const mockCreatedUser = {
        id: 'user123',
        ...createUserDto,
      } as UsersEntity;

      mockUserRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await userRepository.createUser(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findUserAndUrlsId', () => {
    it('should return a user with URLs', async () => {
      const userId = 'user123';
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        urls: [],
        name: 'Antedeguemon',
        phoneNumber: '08007777000',
        updatedAt: new Date(),
        createdAt: new Date(),
        deleted_at: new Date(),
        password: 'a',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findUserAndUrlsId(userId);

      expect(result).toEqual(mockUser);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          relations: ['urls'],
          relationLoadStrategy: 'query',
        }),
      );
    });

    it('should return null if no user is found with URLs', async () => {
      const userId = 'user123';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserAndUrlsId(userId);

      expect(result).toBeNull();

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          relations: ['urls'],
          relationLoadStrategy: 'query',
        }),
      );
    });
  });
});
