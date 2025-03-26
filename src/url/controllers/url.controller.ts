import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Param,
  Res,
  Req,
  ParseUUIDPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@src/auth/decorators/public.decorator';
import { UrlService } from '@src/url/services/url.service';
import { STATUS_CODES } from 'http';
import { CreateUrlDto } from '@src/url/dtos/create-url.dto';
import { Response } from 'express';

@ApiTags('Urls')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiBearerAuth()
  @Post('urls')
  @Public()
  @ApiOperation({ summary: 'Create a new short url' })
  @ApiCreatedResponse({ description: STATUS_CODES[HttpStatus.CREATED] })
  async createUrl(@Req() req: Express.Request, @Body() urlDto: CreateUrlDto) {
    return this.urlService.createUrl(urlDto, req);
  }

  @Get(':shortKey')
  @Public()
  @ApiOperation({ summary: 'Redirect to url' })
  @ApiOkResponse({ description: STATUS_CODES[HttpStatus.MOVED_PERMANENTLY] })
  @ApiNotFoundResponse({ description: STATUS_CODES[HttpStatus.NOT_FOUND] })
  async getUrl(@Param('shortKey') shortKey: string, @Res() res: Response) {
    const url = await this.urlService.getUrl(shortKey);

    res.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Delete('urls/:urlId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar urls feitar pelo usuário' })
  @ApiOkResponse({ description: STATUS_CODES[HttpStatus.OK] })
  async deleteUserUrl(@Param('urlId', new ParseUUIDPipe()) urlId: string) {
    return this.urlService.deleteUrlById(urlId);
  }

  @Patch('urls/:urlId/origin/:origin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar urls feitar pelo usuário' })
  @ApiOkResponse({ description: STATUS_CODES[HttpStatus.OK] })
  @ApiNotFoundResponse({ description: STATUS_CODES[HttpStatus.NOT_FOUND] })
  async updateUserUrl(
    @Param('urlId', new ParseUUIDPipe()) urlId: string,
    @Param('origin') origin: string,
  ) {
    return this.urlService.updateUrlById(urlId, origin);
  }
}
