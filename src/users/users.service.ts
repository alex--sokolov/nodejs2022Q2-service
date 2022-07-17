import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {data} from './../data';
import {v4} from "uuid";
import {UserResponseDto} from "./dto/user-response.dto";
import {User} from "../interfaces";
import {userErrors} from "./users.errors";

@Injectable()
export class UsersService {
    async findAll(): Promise<UserResponseDto[]> {
        const users:User[] =  await new Promise((resolve) => {
            resolve(data.users);
        });
        return users.map(user => new UserResponseDto(user));
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const user: User = await new Promise((resolve) => {
            resolve(data.users.find(user => user.id === id));
        });
        if (!user) {
            throw new NotFoundException(userErrors.NOT_FOUND);
        }
        return new UserResponseDto(user);
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return await new Promise((resolve) => {
            const newUser = {
                id: v4(),
                ...createUserDto,
                version: 1,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            data.users.push(newUser);
            resolve(new UserResponseDto(newUser));
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        console.log('id', id);

        const user: User = await new Promise((resolve) => {
            resolve(data.users.find(user => user.id === id));
        });
        console.log('user to update: ', user);
        console.log('new data for update: ', updateUserDto);

        if (!user) {
            throw new NotFoundException(userErrors.NOT_FOUND);
        };

        if (user.password !== updateUserDto.oldPassword) {
            throw new ForbiddenException(userErrors.INCORRECT_OLD_PASSWORD);
        }

        const newUser = {
            ...user,
            password: updateUserDto.newPassword,
            version: ++user.version,
            updatedAt: Date.now()
        };

        return await new Promise((resolve) => {
            data.users = data.users.map((user) => user.id === id ? newUser : user);
            resolve(new UserResponseDto(newUser));
        });
    }

    async remove(id: string): Promise<boolean> {
        return await new Promise((resolve) => {
            const newUsers: User[] = data.users.filter((user) => user.id !== id);
            if (newUsers.length === data.users.length) {
                throw new NotFoundException(userErrors.NOT_FOUND);
            }
            data.users = newUsers;
            resolve(true);
        });
    }
}
