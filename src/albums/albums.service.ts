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
import {FavouritesService} from "../favourites/favourites.service";

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
  ) {}

  async findAll(): Promise<Album[]> {
    return await new Promise((resolve) => {
      resolve(data.albums);
    });
  }

  async findOne(id: string): Promise<Album> {
    const album: Album = await new Promise((resolve) => {
      resolve(data.albums.find((album) => album.id === id));
    });
    if (!album) {
      throw new NotFoundException(albumErrors.NOT_FOUND);
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      await this.artistsService.findOne(createAlbumDto.artistId);
    }

    return await new Promise((resolve) => {
      const newAlbum = {
        id: v4(),
        ...createAlbumDto,
      };
      data.albums.push(newAlbum);
      resolve(newAlbum);
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    // console.log('id', id);
    const album = await this.findOne(id);

    // console.log('album to update: ', album);
    // console.log('new data for update: ', updateAlbumDto);

    if (!album) {
      throw new NotFoundException(albumErrors.NOT_FOUND);
    }

    if (updateAlbumDto.artistId) {
      await this.artistsService.findOne(updateAlbumDto.artistId);
    }

    const newAlbum = {
      ...album,
      ...updateAlbumDto,
    };

    return await new Promise((resolve) => {
      data.albums = data.albums.map((album) =>
        album.id === id ? newAlbum : album,
      );
      resolve(newAlbum);
    });
  }

  async remove(id: string): Promise<void> {
    await new Promise((resolve) => {
      const newAlbums: Album[] = data.albums.filter((album) => album.id !== id);
      if (newAlbums.length === data.albums.length) {
        throw new NotFoundException(albumErrors.NOT_FOUND);
      }
      data.albums = newAlbums;
      resolve(true);
    });

    const tracks = await this.tracksService.findAll();
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.albumId === id);
      await this.tracksService.update(track.id, { albumId: null });
    }


    // const fav = await this.favouritesService.findAll();
    // if (fav.albums.length > 0) {
    //   const deleted = await this.favouritesService.removeAlbumFromFavourites(id);
    //   console.log('deleted', deleted);
    // }
  }
}
