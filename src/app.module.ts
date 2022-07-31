import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    AlbumsModule,
    ArtistsModule,
    TracksModule,
    FavoritesModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
