import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { ChatRoomSchema } from 'src/Models/ChatModel.model';
import { Userschema } from 'src/Models/UserModel.model';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CHATDOCUMENT, schema: ChatRoomSchema },
      { name: USERDOCUMENT, schema: Userschema },
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
