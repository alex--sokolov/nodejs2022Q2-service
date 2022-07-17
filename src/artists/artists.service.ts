import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {Artist} from "../interfaces";
import {data} from "../data";
import {artistErrors} from "./artists.errors";
import {v4} from "uuid";

@Injectable()
export class ArtistsService {
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
        ...createArtistDto
      };
      data.artists.push(newArtist);
      resolve(newArtist);
    });
  }

  async update(
      id: string,
      updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {

    const artist = await this.findOne(id);

    if (!artist) {
      throw new NotFoundException(artistErrors.NOT_FOUND);
    }

    const newArtist = {
      ...artist,
      ...updateArtistDto
    };

    return await new Promise((resolve) => {
      data.artists = data.artists.map((artist) => (artist.id === id ? newArtist : artist));
      resolve(newArtist);
    });
  }

  async remove(id: string): Promise<boolean> {
    return await new Promise((resolve) => {
      const newArtists: Artist[] = data.artists.filter((artist) => artist.id !== id);
      if (newArtists.length === data.artists.length) {
        throw new NotFoundException(artistErrors.NOT_FOUND);
      }
      data.artists = newArtists;
      // const albums = await this.albumService.findAll();
      // const tracks = await this.trackService.findAll();
      // this.albumService.update(album.id, { ...album, artistId: null });

      resolve(true);
    });
  }
}
