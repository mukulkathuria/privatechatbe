import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { ChatRoomSchema } from 'src/Models/ChatModel.model';
import { Userschema } from 'src/Models/UserModel.model';
import { EventsGateway } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USERDOCUMENT, schema: Userschema },
      { name: CHATDOCUMENT, schema: ChatRoomSchema },
    ]),
  ],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
