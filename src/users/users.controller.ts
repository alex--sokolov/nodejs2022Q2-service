import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    ParseUUIDPipe,
    NotFoundException,
    HttpCode
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {userErrors} from "./users.errors";
import {UserResponseDto} from "./dto/user-response.dto";

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string)
    : Promise<UserResponseDto>{
        const user = await this.usersService.findOne(id);
        return user;
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return await this.usersService.create(createUserDto);
    }


    @Put(':id')
    async update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string)
        : Promise<boolean>{
        return await this.usersService.remove(id);
    }
}
