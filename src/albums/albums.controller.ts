import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete, ParseUUIDPipe, Put, HttpCode,
} from '@nestjs/common';
import {AlbumsService} from "../albums/albums.service";
import {Album} from "../interfaces";
import {CreateAlbumDto} from "../albums/dto/create-album.dto";
import {UpdateAlbumDto} from "../albums/dto/update-album.dto";

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<Album[]> {
    return await this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<Album> {
    return await this.albumsService.findOne(id);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return await this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<boolean> {
    return await this.albumsService.remove(id);
  }
}
