import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { v4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt(+process.env.CRYPT_SALT);
    return await bcrypt.hash(data, salt);
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        login
      }, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,

      }),
      this.jwtService.signAsync({
        sub: userId,
        login
      }, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      })
    ]);
    return {access_token, refresh_token};
  }

  async updateRtHash(userId: string, refreshToken: string): Promise<void> {
    const hash = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async signup(auth: AuthDto): Promise<Tokens> {
    const date: Date = new Date();
    const hash = await this.hashData(auth.password);
    const newUser = await this.prisma.user.create({
      data: {
        login: auth.login,
        password: hash,
        createdAt: date,
        updatedAt: date,
        id: v4(),
        version: 1,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async login() {

  }

  async logout() {

  }

  async refreshTokens() {

  }

}
