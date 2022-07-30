import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {CreateArtistDto} from './dto/create-artist.dto';
import {UpdateArtistDto} from './dto/update-artist.dto';
import {Artist} from '../interfaces';
import {artistErrors} from './artists.errors';
import {TracksService} from '../tracks/tracks.service';
import {AlbumsService} from '../albums/albums.service';
import {FavoritesService} from '../favorites/favorites.service';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    private favorites: FavoritesService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany()
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

  //   const artists = await this.findAll();
  //   const artistToRemove = await this.findOne(id);
  //   if (!artistToRemove) {
  //     throw new NotFoundException(artistErrors.NOT_FOUND);
  //   }
  //
  //   await new Promise((resolve) => {
  //     data.artists = artists.filter((artist) => artist.id !== id);
  //     resolve(true);
  //   });
  //
  //   const albums = await this.albumsService.findAll();
  //   if (albums.length > 0) {
  //     const album = albums.find((album) => album.artistId === id);
  //     if (album) {
  //       await this.albumsService.update(album.id, {artistId: null});
  //     }
  //   }
  //
  //   const tracks = await this.tracksService.findAll();
  //   if (tracks.length > 0) {
  //     const track = tracks.find((track) => track.artistId === id);
  //     if (track) {
  //       await this.tracksService.update(track.id, {artistId: null});
  //     }
  //   }
  //   await new Promise((resolve) => {
  //     const a = data.favorites.artists.indexOf(id);
  //     if (a >= 0) {
  //       data.favorites.artists.splice(a, 1);
  //     }
  //     resolve(true);
  //   });
  // }
}
