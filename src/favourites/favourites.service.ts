import {forwardRef, Inject, Injectable, UnprocessableEntityException} from '@nestjs/common';
import {ArtistsService} from "../artists/artists.service";
import {AlbumsService} from "../albums/albums.service";
import {TracksService} from "../tracks/tracks.service";
import {data} from "../data";
import {Favourites} from '../interfaces';
@Injectable()
export class FavouritesService {
  constructor(
      @Inject(forwardRef(() => ArtistsService))
      private artistsService: ArtistsService,
      @Inject(forwardRef(() => AlbumsService))
      private albumsService: AlbumsService,
      @Inject(forwardRef(() => TracksService))
      private tracksService: TracksService,
  ) {}

  async findAll() {

    const {artists, albums, tracks }: Favourites = await new Promise((resolve) => {
      resolve(data.favourites)
    });

    console.log('artists', artists);
    console.log('albums', albums);
    console.log('tracks', tracks);

    const artistsInstances = await Promise.all(
            artists.map(async (artistId) => {
              console.log('artistId', artistId);
              return await this.artistsService.findOne(artistId)
            }));
    console.log('artistsInstances', artistsInstances);
    // const albumIds:string[] = await new Promise((resolve) => {
    //   resolve(data.favourites.albums)
    // });

    const albumsInstances = await Promise.all(
        albums.map(async (albumId) => {
          return await this.albumsService.findOne(albumId)
        }));

    // const trackIds:string[] = await new Promise((resolve) => {
    //   resolve(data.favourites.tracks)
    // });

    const tracksInstances = await Promise.all(
        tracks.map(async (trackId) => {
          return await this.tracksService.findOne(trackId)
        }));

    // const artists = artistIds.length > 0
    //   ? await Promise.all(
    //     artistIds.map(async (artistId) => {
    //       await this.artistsService.findOne(artistId)
    //     }))
    //   : [];

    return {
      artists: artistsInstances,
      albums: albumsInstances,
      tracks: tracksInstances,
    };
  }

  async addArtistToFavourites(id: string) {
    const artist = await this.artistsService.findOne(id);
    if (!artist) throw new UnprocessableEntityException();

    return new Promise((resolve) => {
      data.favourites.artists.push(artist.id);
      resolve(artist);
    });
  }

  async removeArtistFromFavourites(id: string) {
    const artist = await this.artistsService.findOne(id);
    if (!artist) throw new UnprocessableEntityException();
    return new Promise((resolve) => {
      data.favourites.artists.splice(data.favourites.artists.indexOf(id),1);
      resolve(true);
    });
  }

  async addAlbumToFavourites(id: string) {
    const album = await this.albumsService.findOne(id);
    if (!album) throw new UnprocessableEntityException();
    return new Promise((resolve) => {
      data.favourites.albums.push(album.id);
      resolve(album);
    });
  }

  async removeAlbumFromFavourites(id: string) {
    const album = await this.albumsService.findOne(id);
    if (!album) throw new UnprocessableEntityException();
    return new Promise((resolve) => {
      data.favourites.albums.splice(data.favourites.albums.indexOf(id),1);
      resolve(true);
    });
  }

  async addTrackToFavourites(id: string) {
    const track = await this.tracksService.findOne(id);
    if (!track) throw new UnprocessableEntityException();
    return new Promise((resolve) => {
      data.favourites.tracks.push(track.id);
      resolve(track);
    });
  }

  async removeTrackFromFavourites(id: string) {
    const track = await this.tracksService.findOne(id);
    if (!track) throw new UnprocessableEntityException();
    return new Promise((resolve) => {
      data.favourites.tracks.splice(data.favourites.tracks.indexOf(id),1);
      resolve(true);
    });
  }
}
