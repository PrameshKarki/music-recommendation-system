import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { MusicModule } from './music/music.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '...', 'public', 'uploads'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      retryAttempts: 0,
      type: 'mysql',
      host: process.env.HOST,
      port: +!process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true,
      // dropSchema: true
    }),
    UserModule,
    AuthModule,
    MediaModule,
    MusicModule,
    PlaylistsModule,
    AdminsModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
