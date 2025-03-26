import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlEntity } from '@src/url/entities/url.entity';

@Injectable()
export class UrlMapper {
  constructor(private readonly configService: ConfigService) {}
  mapOne(url: UrlEntity) {
    return {
      ...url,
      fullLink: `${this.configService.get('SOURCE')}/${url.shortKey}`,
    };
  }

  mapMany(urls: UrlEntity[]) {
    return urls.map((url) => this.mapOne(url));
  }
}
