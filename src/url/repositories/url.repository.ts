import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from '@src/url/entities/url.entity';
import { Repository } from 'typeorm';
Injectable();
export class UrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async create(urlDto: Partial<UrlEntity>): Promise<UrlEntity> {
    return this.urlRepository.save(urlDto);
  }

  async findByShortKey(shortKey: string) {
    return this.urlRepository.findOne({
      where: {
        shortKey,
      },
    });
  }

  async findById(id: string) {
    return this.urlRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(url: UrlEntity) {
    return this.urlRepository.save(url);
  }

  async addNewVisit(url: UrlEntity) {
    url.visits += 1;
    await this.urlRepository.update(
      { shortKey: url.shortKey },
      { visits: url.visits },
    );

    return this.findByShortKey(url.shortKey);
  }

  async deleteById(id: string) {
    return this.urlRepository.softDelete(id);
  }

  async findUrlsByUserId(id: string) {
    return this.urlRepository.find({
      select: {
        url: true,
        shortKey: true,
        visits: true,
      },
      where: {
        user: {
          id,
        },
      },
    });
  }
}
