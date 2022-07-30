import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
  ) {
  }

  async findAll() {
    const favRecord = await this.prisma.favorite.findFirst({
      select: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true
          }
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });

    return {
      artists: favRecord.artists || [],
      albums: favRecord.albums || [],
      tracks: favRecord.tracks || []
    };
  }

  async addArtistToFavorites(id: string): Promise<string> {
    const artist = await this.prisma.artist.findFirst({where: {id}});
    if (!artist) throw new UnprocessableEntityException();
    try {
      const favRecord = await this.prisma.favorite.findFirst() || await this.prisma.favorite.create({data: {}});
      await this.prisma.artist.update({
        where: {id},
        data: {favoriteId: favRecord.id},
      });
      return id;
    } catch (error) {
      return error
    }
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    const artist = await this.prisma.artist.findFirst({where: {id}});
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    await this.prisma.artist.update({
      where: {id},
      data: {favoriteId: {set: null}},
    });
  }

  async addAlbumToFavorites(id: string): Promise<string> {
    const album = await this.prisma.album.findFirst({where: {id}});
    if (!album) throw new UnprocessableEntityException();
    try {
      const favRecord = await this.prisma.favorite.findFirst() || await this.prisma.favorite.create({data: {}});
      await this.prisma.album.update({
        where: {id},
        data: {favoriteId: favRecord.id},
      });
      return id;
    } catch (error) {
      return error
    }
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    const album = await this.prisma.album.findFirst({where: {id}});
    if (!album) {
      throw new UnprocessableEntityException();
    }
    await this.prisma.album.update({
      where: {id},
      data: {favoriteId: {set: null}},
    });
  }

  async addTrackToFavorites(id: string): Promise<string> {
    const track = await this.prisma.track.findFirst({where: {id}});
    if (!track) throw new UnprocessableEntityException();
    try {
      const favRecord = await this.prisma.favorite.findFirst() || await this.prisma.favorite.create({data: {}});
      await this.prisma.track.update({
        where: {id},
        data: {favoriteId: favRecord.id},
      });
      return id;
    } catch (error) {
      return error
    }
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    const track = await this.prisma.track.findFirst({where: {id}});
    if (!track) {
      throw new UnprocessableEntityException();
    }
    await this.prisma.track.update({
      where: {id},
      data: {favoriteId: {set: null}},
    });
  }
}
