import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './Modules/auth/auth.module';
import { EventsModule } from './Modules/events/events.module';
import { UserModule } from './Modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env['DATABASE_URI'],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'userprofile'),
      serveRoot: '/userprofile',
    }),
    EventsModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}