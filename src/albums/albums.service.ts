import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../interfaces';
import { albumErrors } from './albums.errors';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private favoritesService: FavoritesService,
  ) {
  }

  async findAll(): Promise<Album[]> {
    try {
      return await this.prisma.album.findMany();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Album> {
    try {
      const album = await this.prisma.album.findFirst({where: {id}});
      if (!album) {
        throw new NotFoundException(albumErrors.NOT_FOUND);
      }
      return album;
    } catch (error) {
      throw error;
    }
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      const album = await this.prisma.album.create({
        data: createAlbumDto
      });
      return album;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      const album = await this.prisma.album.findFirst({where: {id}});
      if (!album) {
        throw new NotFoundException(albumErrors.NOT_FOUND);
      }
      return await this.prisma.album.update({
        where: {id},
        data: {...updateAlbumDto},
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const album = await this.prisma.album.findFirst({where: {id}});
      if (!album) {
        throw new NotFoundException(albumErrors.NOT_FOUND);
      }
      await this.favoritesService.removeAlbumFromFavorites(id)
      await this.prisma.album.delete({where: {id}});
    } catch (error) {
      throw error;
    }
  }
}
