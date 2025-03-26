import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { UserService } from '@src/users/services/user.service';
import { Public } from '@src/auth/decorators/public.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: STATUS_CODES[HttpStatus.CREATED] })
  @ApiConflictResponse({ description: STATUS_CODES[HttpStatus.CONFLICT] })
  @ApiBody({
    type: CreateUserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('urls')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar urls feitar pelo usuário' })
  @ApiOkResponse({ description: STATUS_CODES[HttpStatus.OK] })
  @ApiNotFoundResponse({ description: STATUS_CODES[HttpStatus.NOT_FOUND] })
  async getUserUrls(@CurrentUser() user: { userId: string }) {
    return this.userService.getUserUrls(user.userId);
  }
}
