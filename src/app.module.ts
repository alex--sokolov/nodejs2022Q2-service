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
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";

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
    PrismaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }
  ],
})
export class AppModule {}
