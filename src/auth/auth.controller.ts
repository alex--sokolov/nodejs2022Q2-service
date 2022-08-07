import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from './types';
import { AuthGuard } from "@nestjs/passport";
import { UserResponseDto, UserResponseDtoWithHash } from "../users/dto/user-response.dto";

interface IGetUserAuthInfoRequest extends Request {
  user: {
    sub: string,
    login: string,
    iat: number,
    exp: number,
  }
}

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() auth: AuthDto): Promise<Tokens> {
    return await this.authService.signup(auth);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() auth: AuthDto): Promise<Tokens> {
    return await this.authService.login(auth);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: IGetUserAuthInfoRequest) {
    const user = req.user;
    console.log('user', user);
    return await this.authService.logout(user.sub);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh() {
    return await this.authService.refreshTokens();
  }
}