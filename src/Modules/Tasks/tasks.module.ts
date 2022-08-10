import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CHATDOCUMENT } from 'src/constants/mongoose.documents';
import { ChatRoomSchema } from 'src/Models/ChatModel.model';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CHATDOCUMENT, schema: ChatRoomSchema }]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
