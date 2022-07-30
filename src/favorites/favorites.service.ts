import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { data } from '../data';
import { Favorites } from '../interfaces';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  async findAll() {
    const { artists, albums, tracks }: Favorites = data.favorites;
    const artistsInstances = await Promise.all(
      artists.map(async (artistId) => {
        return await this.artistsService.findOne(artistId);
      }),
    );

    const albumsInstances = await Promise.all(
      albums.map(async (albumId) => {
        return await this.albumsService.findOne(albumId);
      }),
    );

    const tracksInstances = await Promise.all(
      tracks.map(async (trackId) => {
        return await this.tracksService.findOne(trackId);
      }),
    );

    return {
      artists: artistsInstances,
      albums: albumsInstances,
      tracks: tracksInstances,
    };
  }

  async addArtistToFavorites(id: string): Promise<string> {
    const artist = data.artists.find((artist) => artist.id === id);
    if (!artist) throw new UnprocessableEntityException();
    return await new Promise((resolve) => {
      data.favorites.artists.push(artist.id);
      resolve(id);
    });
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    this.prisma.artist.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });

    // const artist = data.artists.find((artist) => artist.id === id);
    // if (!artist) throw new UnprocessableEntityException();
    // await new Promise((resolve) => {
    //   data.favorites.artists.splice(data.favorites.artists.indexOf(id), 1);
    //   resolve(true);
    // });
  }

  async addAlbumToFavorites(id: string): Promise<string> {
    const album = data.albums.find((album) => album.id === id);
    if (!album) throw new UnprocessableEntityException();
    return await new Promise((resolve) => {
      data.favorites.albums.push(album.id);
      resolve(id);
    });
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    this.prisma.album.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });


    // const album = data.albums.find((album) => album.id === id);
    // if (!album) throw new UnprocessableEntityException();
    // console.log('BEFORE', data.favorites.albums);
    // await new Promise((resolve) => {
    //   data.favorites.albums.splice(data.favorites.albums.indexOf(id), 1);
    //   console.log('AFTER', data.favorites.albums);
    //   resolve(true);
    // });
  }

  async addTrackToFavorites(id: string): Promise<string> {
    const track = data.tracks.find((track) => track.id === id);
    if (!track) throw new UnprocessableEntityException();
    return await new Promise((resolve) => {
      data.favorites.tracks.push(track.id);
      resolve(id);
    });
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    this.prisma.track.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });
  }
  //   const track = data.tracks.find((track) => track.id === id);
  //   if (!track) throw new UnprocessableEntityException();
  //   await new Promise((resolve) => {
  //     data.favorites.tracks.splice(data.favorites.tracks.indexOf(id), 1);
  //     resolve(true);
  //   });
  // }
}
