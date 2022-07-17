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
import {FavouritesService} from "../favourites/favourites.service";

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
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
    console.log('id', id);
    const track = await this.findOne(id);

    console.log('track to update: ', track);
    console.log('new data for update: ', updateTrackDto);

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
    await new Promise((resolve) => {
      const newTracks: Track[] = data.tracks.filter((track) => track.id !== id);
      if (newTracks.length === data.tracks.length) {
        throw new NotFoundException(trackErrors.NOT_FOUND);
      }
      data.tracks = newTracks;
      // const tracks = await this.trackService.findAll();
      // const tracks = await this.trackService.findAll();
      // this.trackService.update(track.id, { ...track, trackId: null });

      resolve(true);
    });

    const fav = await this.favouritesService.findAll();
    if (fav.tracks.length > 0) {
      const deleted = await this.favouritesService.removeArtistFromFavourites(id);
      console.log('deleted', deleted);
    }
  }
}
