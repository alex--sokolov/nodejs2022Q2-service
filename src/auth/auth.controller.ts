import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { RtGuard } from '../common/guards';
import { GetCurrentUser, Public } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() auth: AuthDto): Promise<Tokens> {
    return await this.authService.signup(auth);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() auth: AuthDto): Promise<Tokens> {
    return await this.authService.login(auth);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser('sub') userId: string) {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
