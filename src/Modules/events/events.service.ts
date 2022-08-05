import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { chatModelDto } from 'src/Models/dto/chatmodel.dto';
import { UserModelDto } from 'src/Models/dto/user.dto';
import { joinedRoomDto, messageRoomDto } from './dto/joinroom.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(USERDOCUMENT) private userModel: Model<UserModelDto>,
    @InjectModel(CHATDOCUMENT) private chatModel: Model<chatModelDto>,
  ) {}

  async adduserchatroom(roomuser: joinedRoomDto) {
    const { username, roomid } = roomuser;
    try {
      const data = await this.chatModel
        .findOneAndUpdate(
          {
            chatroomid: roomid,
            'users.username': username,
          },
          { $set: { 'users.$.isOnline': true } },
          { new: true },
        )
        .select('chatroomid users createdBy messages');

      return { data };
    } catch (error) {
      return { error: { status: 500, message: 'Server error' } };
    }
  }

  async removeuserchatroom(roomuser: joinedRoomDto) {
    const { username, roomid } = roomuser;
    try {
      const data = await this.chatModel
        .findOneAndUpdate(
          {
            chatroomid: roomid,
            'users.username': username,
          },
          {
            $set: {
              'users.$.isOnline': false,
              'users.$.lastOffline': new Date(),
            },
          },
          { new: true },
        )
        .select('chatroomid users createdBy messages');
      return { data };
    } catch (error) {
      return { error: { status: 500, message: 'Server error' } };
    }
  }

  async sendMessageRoom(roomuser: messageRoomDto) {
    const { username, roomid, message } = roomuser;
    try {
      const data = await this.chatModel
        .findOneAndUpdate(
          {
            chatroomid: roomid,
          },
          {
            $push: {
              messages: { senderUsername: username, message },
            },
          },
          { new: true },
        )
        .select('chatroomid users createdBy messages');
      return { userData: data };
    } catch (error) {
      return { error: { status: 500, message: 'Server error' } };
    }
  }
}
