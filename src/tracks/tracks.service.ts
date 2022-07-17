import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ArtistsService } from '../artists/artists.service';
import { Track } from '../interfaces';
import { data } from '../data';
import { v4 } from 'uuid';
import { trackErrors } from './tracks.errors';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';
import { artistErrors } from '../artists/artists.errors';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Track[]> {
    return await new Promise((resolve) => {
      resolve(data.tracks);
    });
  }

  async findOne(id: string): Promise<Track> {
    const track: Track = await new Promise((resolve) => {
      resolve(data.tracks.find((track) => track.id === id));
    });
    if (!track) {
      throw new NotFoundException(trackErrors.NOT_FOUND);
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      await this.artistsService.findOne(createTrackDto.artistId);
    }
    if (createTrackDto.albumId) {
      await this.albumsService.findOne(createTrackDto.albumId);
    }
    return await new Promise((resolve) => {
      const newTrack = {
        id: v4(),
        ...createTrackDto,
      };
      data.tracks.push(newTrack);
      resolve(newTrack);
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);

    if (!track) {
      throw new NotFoundException(trackErrors.NOT_FOUND);
    }

    if (updateTrackDto.artistId) {
      await this.artistsService.findOne(updateTrackDto.artistId);
    }

    if (updateTrackDto.albumId) {
      await this.albumsService.findOne(updateTrackDto.albumId);
    }

    const newTrack = {
      ...track,
      ...updateTrackDto,
    };

    return await new Promise((resolve) => {
      data.tracks = data.tracks.map((track) =>
        track.id === id ? newTrack : track,
      );
      resolve(newTrack);
    });
  }

  async remove(id: string): Promise<void> {
    const tracks = await this.findAll();
    const trackToRemove = await this.findOne(id);
    if (!trackToRemove) {
      throw new NotFoundException(artistErrors.NOT_FOUND);
    }
    await new Promise((resolve) => {
      data.tracks = tracks.filter((album) => album.id !== id);
      resolve(true);
    });

    await new Promise((resolve) => {
      const a = data.favorites.tracks.indexOf(id);
      if (a >= 0) {
        data.favorites.tracks.splice(a, 1);
      }
      resolve(true);
    });
  }
}
