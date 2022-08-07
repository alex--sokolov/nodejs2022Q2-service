import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserResponseDto } from "../users/dto/user-response.dto";
import { AuthDto } from "./dto";
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() auth: AuthDto): Promise<Tokens> {
    return await this.authService.signup(auth);
  }

  @Post('/login')
  async login() {
    return await this.authService.login();
  }

  @Post('/logout')
  async logout() {
    return await this.authService.logout();
  }

  @Post('/refresh')
  async refresh() {
    return await this.authService.refreshTokens();
  }


}