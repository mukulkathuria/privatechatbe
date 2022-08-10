import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from './Modules/auth/auth.module';
import { EventsModule } from './Modules/events/events.module';
import { TasksModule } from './Modules/Tasks/tasks.module';
import { UserModule } from './Modules/user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 80,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env['DATABASE_URI'],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'userprofile'),
      serveRoot: '/userprofile',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'messages'),
      serveRoot: '/messages',
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    EventsModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
