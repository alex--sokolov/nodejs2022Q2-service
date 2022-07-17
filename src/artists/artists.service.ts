import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from '../interfaces';
import { data } from '../data';
import { artistErrors } from './artists.errors';
import { v4 } from 'uuid';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import {FavouritesService} from "../favourites/favourites.service";

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavouritesService))
    private readonly favouritesService: FavouritesService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return await new Promise((resolve) => {
      resolve(data.artists);
    });
  }

  async findOne(id: string): Promise<Artist> {
    const artist: Artist = await new Promise((resolve) => {
      resolve(data.artists.find((artist) => artist.id === id));
    });
    if (!artist) {
      throw new NotFoundException(artistErrors.NOT_FOUND);
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await new Promise((resolve) => {
      const newArtist = {
        id: v4(),
        ...createArtistDto,
      };
      data.artists.push(newArtist);
      resolve(newArtist);
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);

    if (!artist) {
      throw new NotFoundException(artistErrors.NOT_FOUND);
    }

    const newArtist = {
      ...artist,
      ...updateArtistDto,
    };

    return await new Promise((resolve) => {
      data.artists = data.artists.map((artist) =>
        artist.id === id ? newArtist : artist,
      );
      resolve(newArtist);
    });
  }

  async remove(id: string): Promise<void> {
    await new Promise((resolve) => {
      const newArtists: Artist[] = data.artists.filter(
        (artist) => artist.id !== id,
      );
      if (newArtists.length === data.artists.length) {
        throw new NotFoundException(artistErrors.NOT_FOUND);
      }
      data.artists = newArtists;
      resolve(true);
    });

    const albums = await this.albumsService.findAll();
    if (albums.length > 0) {
      const album = albums.find((album) => album.artistId === id);
      await this.albumsService.update(album.id, { artistId: null });
    }

    const tracks = await this.tracksService.findAll();
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.artistId === id);
      await this.tracksService.update(track.id, { artistId: null });
    }

    // const fav = await this.favouritesService.findAll();
    // if (fav.artists.length > 0) {
    //   const deleted = await this.favouritesService.removeArtistFromFavourites(id);
    //   console.log('deleted', deleted);
    // }

  }
}
