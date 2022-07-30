import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {userErrors} from './users.errors';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.prisma.user.findMany()
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findFirst({where: {id}});
      if (!user) {
        throw new NotFoundException('There is no user with specified id');
      }
      return new UserResponseDto(user);
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto
      });
      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(userErrors.LOGIN_ALREADY_EXISTS);
        }
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Find user by id
    try {
      const user = await this.prisma.user.findFirst({where: {id}});
      if (!user) {
        throw new NotFoundException(userErrors.NOT_FOUND);
      }
      if (user.password !== updateUserDto.oldPassword) {
        throw new ForbiddenException(userErrors.INCORRECT_OLD_PASSWORD);
      }
      if (user.password === updateUserDto.newPassword) {
        throw new ForbiddenException(userErrors.SAME_PASSWORD);
      }
      const userUpdated = await this.prisma.user.update({
        where: {id},
        data: {
          password: updateUserDto.newPassword,
          version: {increment: 1},
        },
      });
      return new UserResponseDto(userUpdated)
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return await this.prisma.user.delete({where: {id}}) && true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException(userErrors.NOT_FOUND);
        }
      }
      throw error;
    }
  }
}
