import {
  Controller,
  Get,
  Post,
  Param,
  Delete, ParseUUIDPipe, HttpCode,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';

@Controller('favs')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  findAll() {
    return this.favouritesService.findAll();
  }

  @Post('artist/:id')
  addArtistToFavourites(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addArtistToFavourites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistFromFavourites(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favouritesService.removeArtistFromFavourites(id);
  }

  @Post('album/:id')
  addAlbumToFavourites(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addAlbumToFavourites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumFromFavourites(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favouritesService.removeAlbumFromFavourites(id);
  }

  @Post('track/:id')
  addTrackToFavourites(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addTrackToFavourites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackFromFavourites(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favouritesService.removeTrackFromFavourites(id);
  }

}
