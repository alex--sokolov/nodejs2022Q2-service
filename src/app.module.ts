import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { FavouritesModule } from './favourites/favourites.module';

@Module({
  imports: [UsersModule, AlbumsModule, ArtistsModule, TracksModule, FavouritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
