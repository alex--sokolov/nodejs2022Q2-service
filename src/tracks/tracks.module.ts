import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import {ArtistsModule} from "../artists/artists.module";
import {AlbumsModule} from "../albums/albums.module";

@Module({
  imports: [ArtistsModule, AlbumsModule],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
