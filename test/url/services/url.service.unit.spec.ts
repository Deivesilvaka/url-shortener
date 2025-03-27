import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UrlService } from '@src/url/services/url.service';
import { UrlRepository } from '@src/url/repositories/url.repository';
import { UserRepository } from '@src/users/repositories/users.repository';
import { UrlMapper } from '@src/url/mapper/url.mapper';
import { CreateUrlDto } from '@src/url/dtos/create-url.dto';
import { UrlEntity } from '@src/url/entities/url.entity';
import { decodeJwtFromRequest } from '@src/shared/helpers/token-decode.helper';

jest.mock('@src/shared/helpers/token-decode.helper');

describe('UrlService', () => {
  let urlService: UrlService;
  let urlRepository: jest.Mocked<UrlRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let urlMapper: jest.Mocked<UrlMapper>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    urlRepository = {
      create: jest.fn(),
      findByShortKey: jest.fn(),
      addNewVisit: jest.fn(),
      deleteById: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findUrlsByUserId: jest.fn(),
    } as any;

    userRepository = {
      findUserById: jest.fn(),
    } as any;

    urlMapper = {
      mapOne: jest.fn(),
    } as any;

    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: UrlRepository, useValue: urlRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: UrlMapper, useValue: urlMapper },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
  });

  describe('createUrl', () => {
    it('should create a URL and return the short URL', async () => {
      const createUrlDto: CreateUrlDto = { url: 'https://example.com' };
      const req = { headers: { authorization: 'Bearer token' } };
      const user = { sub: 'user123' };
      const savedUrl: UrlEntity = {
        id: '1',
        url: createUrlDto.url,
        shortKey: 'abc123',
        visits: 0,
      } as UrlEntity;

      (decodeJwtFromRequest as jest.Mock).mockReturnValue(user);
      userRepository.findUserById!.mockResolvedValue({ id: 'user123' } as any);

      urlRepository.create.mockResolvedValue(savedUrl);

      const result = await urlService.createUrl(createUrlDto, req);

      expect(result).toEqual({ url: 'http://localhost:3000/abc123' });
      expect(urlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: createUrlDto.url }),
      );
    });

    it('should create a URL without a user if token is not provided', async () => {
      const createUrlDto: CreateUrlDto = { url: 'https://example.com' };
      const req = {};
      const savedUrl: UrlEntity = {
        id: '1',
        url: createUrlDto.url,
        shortKey: 'abc123',
        visits: 0,
      } as UrlEntity;

      (decodeJwtFromRequest as jest.Mock).mockReturnValue(null);
      urlRepository.create.mockResolvedValue(savedUrl);

      const result = await urlService.createUrl(createUrlDto, req);

      expect(result).toEqual({ url: 'http://localhost:3000/abc123' });
      expect(urlRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ url: createUrlDto.url }),
      );
    });
  });

  describe('getUrl', () => {
    it('should return the original URL and increment visits', async () => {
      const urlEntity: UrlEntity = {
        shortKey: 'abc123',
        url: 'https://example.com',
        visits: 5,
      } as UrlEntity;
      const updatedUrlEntity: UrlEntity = { ...urlEntity, visits: 6 };

      urlRepository.findByShortKey.mockResolvedValue(urlEntity);
      urlRepository.addNewVisit.mockResolvedValue(updatedUrlEntity);

      const result = await urlService.getUrl('abc123');

      expect(result).toBe('https://example.com');
      expect(urlRepository.findByShortKey).toHaveBeenCalledWith('abc123');
      expect(urlRepository.addNewVisit).toHaveBeenCalledWith(urlEntity);
    });

    it('should throw NotFoundException if URL does not exist', async () => {
      urlRepository.findByShortKey.mockResolvedValue(null);

      await expect(urlService.getUrl('invalidKey')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
