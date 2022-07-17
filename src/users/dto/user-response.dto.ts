import {Exclude} from 'class-transformer';

export class UserResponseDto {
    id: string;
    login: string;

    @Exclude()
    password: string;
    version: number;
    createdAt: number;
    updatedAt: number;
    
    constructor(withoutPass: Omit<UserResponseDto, "password">) {
        Object.assign(this, withoutPass)
    }
}