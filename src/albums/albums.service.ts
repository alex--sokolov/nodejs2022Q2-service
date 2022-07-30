import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../interfaces';
import { data } from '../data';
import { v4 } from 'uuid';
import { albumErrors } from './albums.errors';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { artistErrors } from '../artists/artists.errors';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {UserResponseDto} from "../users/dto/user-response.dto";

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private favorites: FavoritesService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

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
  //   await new Promise((resolve) => {
  //     const a = data.favorites.albums.indexOf(id);
  //     if (a >= 0) {
  //       data.favorites.albums.splice(a, 1);
  //     }
  //     resolve(true);
  //   });
  //
  //   const albums = await this.findAll();
  //   const albumToRemove = await this.findOne(id);
  //   if (!albumToRemove) {
  //     throw new NotFoundException(artistErrors.NOT_FOUND);
  //   }
  //   await new Promise((resolve) => {
  //     data.albums = albums.filter((album) => album.id !== id);
  //     resolve(true);
  //   });
  //
  //   const tracks = await this.tracksService.findAll();
  //   if (tracks.length > 0) {
  //     const track = tracks.find((track) => track.albumId === id);
  //     if (track) {
  //       await this.tracksService.update(track.id, { albumId: null });
  //     }
  //   }
  // }
}
