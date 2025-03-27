import { UrlRepository } from '@src/url/repositories/url.repository';
import { UrlEntity } from '@src/url/entities/url.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UrlRepository', () => {
  let urlRepository: UrlRepository;
  let repository: Repository<UrlEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlRepository,
        {
          provide: getRepositoryToken(UrlEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    urlRepository = module.get<UrlRepository>(UrlRepository);
    repository = module.get<Repository<UrlEntity>>(
      getRepositoryToken(UrlEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(urlRepository).toBeDefined();
  });

  it('should create a new URL entity', async () => {
    const urlDto = {
      url: 'https://example.com',
      shortKey: 'abc123',
    } as UrlEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(urlDto);

    const result = await urlRepository.create(urlDto);
    expect(result).toEqual(urlDto);
    expect(repository.save).toHaveBeenCalledWith(urlDto);
  });

  it('should find a URL by shortKey', async () => {
    const shortKey = 'abc123';
    const urlEntity = { shortKey, url: 'https://example.com' } as UrlEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(urlEntity);

    const result = await urlRepository.findByShortKey(shortKey);
    expect(result).toEqual(urlEntity);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { shortKey } });
  });

  it('should find a URL by id', async () => {
    const id = '1';
    const urlEntity = { id, url: 'https://example.com' } as UrlEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(urlEntity);

    const result = await urlRepository.findById(id);
    expect(result).toEqual(urlEntity);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
  });

  it('should update a URL entity', async () => {
    const urlEntity = { id: '1', shortKey: 'abc123', visits: 10 } as UrlEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(urlEntity);

    const result = await urlRepository.update(urlEntity);
    expect(result).toEqual(urlEntity);
    expect(repository.save).toHaveBeenCalledWith(urlEntity);
  });

  it('should increment visit count and return updated entity', async () => {
    const initialVisits = 10;
    const urlEntity = {
      id: '1',
      shortKey: 'abc123',
      visits: initialVisits,
    } as UrlEntity;
    const updatedUrlEntity = { ...urlEntity, visits: initialVisits + 1 };

    jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUrlEntity);

    const result = await urlRepository.addNewVisit(urlEntity);

    expect(result).toEqual(updatedUrlEntity);
    expect(repository.update).toHaveBeenCalledWith(
      { shortKey: urlEntity.shortKey },
      { visits: initialVisits + 1 },
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { shortKey: urlEntity.shortKey },
    });
  });

  it('should delete a URL by id', async () => {
    const id = '1';
    jest
      .spyOn(repository, 'softDelete')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await urlRepository.deleteById(id);
    expect(result).toEqual({ affected: 1 });
    expect(repository.softDelete).toHaveBeenCalledWith(id);
  });

  it('should find URLs by user id', async () => {
    const userId = 'user123';
    const urls = [
      { shortKey: 'abc123', url: 'https://example.com', visits: 10 },
      { shortKey: 'xyz789', url: 'https://test.com', visits: 5 },
    ] as UrlEntity[];

    jest.spyOn(repository, 'find').mockResolvedValue(urls);

    const result = await urlRepository.findUrlsByUserId(userId);
    expect(result).toEqual(urls);
    expect(repository.find).toHaveBeenCalledWith({
      select: { url: true, shortKey: true, visits: true },
      where: { user: { id: userId } },
    });
  });
});
