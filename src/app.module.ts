import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin/admin.controller';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      retryAttempts: 0,
      type: 'mysql',
      host: process.env.HOST,
      port: +!process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'music_recommendation',
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true,
      dropSchema: false,
    }),
    UserModule,
  ],
  controllers: [AppController, AuthController, AdminController],
})
export class AppModule { }
