import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from '../interfaces';
import { artistErrors } from './artists.errors';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    private favoritesService: FavoritesService
  ) {
  }

  async findAll(): Promise<Artist[]> {
    try {
      return await this.prisma.artist.findMany();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Artist> {
    try {
      const artist = await this.prisma.artist.findFirst({where: {id}});
      if (!artist) {
        throw new NotFoundException(artistErrors.NOT_FOUND);
      }
      return artist;
    } catch (error) {
      throw error;
    }
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    try {
      const artist = await this.prisma.artist.create({
        data: createArtistDto
      });
      return artist;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    try {
      const artist = await this.prisma.artist.findFirst({where: {id}});
      if (!artist) {
        throw new NotFoundException(artistErrors.NOT_FOUND);
      }
      return await this.prisma.artist.update({
        where: {id},
        data: {...updateArtistDto},
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const artist = await this.prisma.artist.findFirst({where: {id}});
      if (!artist) {
        throw new NotFoundException(artistErrors.NOT_FOUND);
      }
      await this.favoritesService.removeArtistFromFavorites(id)
      await this.prisma.artist.delete({where: {id}});
    } catch (error) {
      throw error;
    }
  }
}
