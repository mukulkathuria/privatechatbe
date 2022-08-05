import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { ChatRoomSchema } from 'src/Models/ChatModel.model';
import { Userschema } from 'src/Models/UserModel.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USERDOCUMENT, schema: Userschema },
      { name: CHATDOCUMENT, schema: ChatRoomSchema },
    ]),
    MulterModule.registerAsync({
      useFactory: async () => ({
        dest: './userprofile',
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
