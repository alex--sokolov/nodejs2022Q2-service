import {forwardRef, Module} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import {ArtistsModule} from "../artists/artists.module";
import {TracksModule} from "../tracks/tracks.module";

@Module({
  controllers: [AlbumsController],
  imports:[
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
  ],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
