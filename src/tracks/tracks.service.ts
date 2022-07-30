import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {CreateTrackDto} from './dto/create-track.dto';
import {UpdateTrackDto} from './dto/update-track.dto';
import {ArtistsService} from '../artists/artists.service';
import {Track} from '../interfaces';
import {trackErrors} from './tracks.errors';
import {AlbumsService} from '../albums/albums.service';
import {FavoritesService} from '../favorites/favorites.service';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    private favorites: FavoritesService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
  }

  async findAll(): Promise<Track[]> {
    try {
      return await this.prisma.track.findMany();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Track> {
    try {
      const track = await this.prisma.track.findFirst({where: {id}});
      if (!track) {
        throw new NotFoundException(trackErrors.NOT_FOUND);
      }
      return track;
    } catch (error) {
      throw error;
    }
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      const track = await this.prisma.track.create({
        data: createTrackDto
      });
      return track;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      const track = await this.prisma.track.findFirst({where: {id}});
      if (!track) {
        throw new NotFoundException(trackErrors.NOT_FOUND);
      }
      return await this.prisma.track.update({
        where: {id},
        data: {...updateTrackDto},
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const track = await this.prisma.track.findFirst({where: {id}});
      if (!track) {
        throw new NotFoundException(trackErrors.NOT_FOUND);
      }
      await this.favoritesService.removeTrackFromFavorites(id)
      await this.prisma.track.delete({where: {id}});
    } catch (error) {
      throw error;
    }
  }
}
