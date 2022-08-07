import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { v4 } from "uuid";
import { UserResponseDto } from "../users/dto/user-response.dto";
import * as bcrypt from 'bcrypt';
import { AuthDto } from "./dto";
import { Tokens } from "./types";

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService) {
  }

  hashData(data: string) {
    return bcrypt.hash(data,  process.env.CRYPT_SALT);
  }

  async signup(auth: AuthDto): Promise<Tokens>{
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

  }

  async login(){

  }

  async logout(){

  }

  async refreshTokens(){

  }

}
