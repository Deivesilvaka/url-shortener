import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@src/auth/services/auth.service';
import { Public } from '@src/auth/decorators/public.decorator';
import { LocalAuthGuard } from '@src/auth/guards/local-auth.guard';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: STATUS_CODES[HttpStatus.OK] })
  @ApiUnauthorizedResponse({
    description: STATUS_CODES[HttpStatus.UNAUTHORIZED],
  })
  @Post('login')
  async login(@Request() req: Express.Request, @Body() user: LoginDto) {
    return this.authService.login({
      ...user,
      sub: req?.user,
    });
  }
}
