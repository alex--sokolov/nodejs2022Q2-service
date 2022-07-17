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

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
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
    const album = await this.findOne(id);

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
      const a = data.favorites.albums.indexOf(id);
      if (a >= 0) {
        data.favorites.albums.splice(a, 1);
      }
      resolve(true);
    });

    const albums = await this.findAll();
    const albumToRemove = await this.findOne(id);
    if (!albumToRemove) {
      throw new NotFoundException(artistErrors.NOT_FOUND);
    }
    await new Promise((resolve) => {
      data.albums = albums.filter((album) => album.id !== id);
      resolve(true);
    });

    const tracks = await this.tracksService.findAll();
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.albumId === id);
      if (track) {
        await this.tracksService.update(track.id, { albumId: null });
      }
    }
  }
}
