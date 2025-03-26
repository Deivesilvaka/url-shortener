import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '@src/url/repositories/url.repository';
import { CreateUrlDto } from '@src/url/dtos/create-url.dto';
import { generateRandomCode } from '@src/shared/helpers/shortUrl.helper';
import { UrlEntity } from '@src/url/entities/url.entity';
import { ConfigService } from '@nestjs/config';
import { decodeJwtFromRequest } from '@src/shared/helpers/token-decode.helper';
import { UserRepository } from '@src/users/repositories/users.repository';
import { UrlMapper } from '@src/url/mapper/url.mapper';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRespository: UrlRepository,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly urlMapper: UrlMapper,
  ) {}
  async createUrl(urlDto: CreateUrlDto, req: any) {
    const user = decodeJwtFromRequest(req);

    const url: Partial<UrlEntity> = {
      ...urlDto,
      shortKey: generateRandomCode(6),
    };

    if (user) {
      const currentUser = await this.userRepository.findUserById(
        user.sub as string,
      );
      url.user = currentUser ?? undefined;
    }

    const urlCreated = await this.urlRespository.create(url);
    return {
      url: `${this.configService.get('SOURCE')}/${urlCreated.shortKey}`,
    };
  }

  async getUrl(shortKey: string) {
    const url = await this.urlRespository.findByShortKey(shortKey);
    if (!url) {
      throw new NotFoundException('Url not found!');
    }

    const updatedUrl = await this.urlRespository.addNewVisit(url);

    if (!updatedUrl) {
      throw new NotFoundException('Url not found!');
    }

    return updatedUrl.url;
  }

  async deleteUrlById(id: string) {
    return this.urlRespository.deleteById(id);
  }

  async updateUrlById(id: string) {
    const url = await this.urlRespository.findById(id);

    if (!url) {
      throw new NotFoundException('Url not found!');
    }

    url.shortKey = generateRandomCode(6);

    const updatedUrl = await this.urlRespository.update(url);

    return this.urlMapper.mapOne(updatedUrl);
  }
}
