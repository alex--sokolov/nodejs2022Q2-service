import {forwardRef, Module} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import {ArtistsModule} from "../artists/artists.module";
import {AlbumsModule} from "../albums/albums.module";

@Module({
  controllers: [TracksController],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
  ],
  providers: [TracksService],
  exports:[TracksService],
})
export class TracksModule {}
