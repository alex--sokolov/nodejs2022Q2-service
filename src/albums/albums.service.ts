import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {Album} from "../interfaces";
import {data} from "../data";
import {v4} from "uuid";
import {albumErrors} from "./albums.errors";

@Injectable()
export class AlbumsService {
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
    return await new Promise((resolve) => {
      const newAlbum = {
        id: v4(),
        ...createAlbumDto
      };
      data.albums.push(newAlbum);
      resolve(newAlbum);
    });
  }

  async update(
      id: string,
      updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    console.log('id', id);
    const album = await this.findOne(id);

    console.log('album to update: ', album);
    console.log('new data for update: ', updateAlbumDto);

    if (!album) {
      throw new NotFoundException(albumErrors.NOT_FOUND);
    }

    const newAlbum = {
      ...album,
      ...updateAlbumDto
    };

    return await new Promise((resolve) => {
      data.albums = data.albums.map((album) => (album.id === id ? newAlbum : album));
      resolve(newAlbum);
    });
  }

  async remove(id: string): Promise<boolean> {
    return await new Promise((resolve) => {
      const newAlbums: Album[] = data.albums.filter((album) => album.id !== id);
      if (newAlbums.length === data.albums.length) {
        throw new NotFoundException(albumErrors.NOT_FOUND);
      }
      data.albums = newAlbums;
      // const albums = await this.albumService.findAll();
      // const tracks = await this.trackService.findAll();
      // this.albumService.update(album.id, { ...album, albumId: null });

      resolve(true);
    });
  }
}
