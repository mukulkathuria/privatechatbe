import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { writeFile } from 'fs';
import { Model } from 'mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { chatModelDto } from 'src/Models/dto/chatmodel.dto';
import { UserModelDto } from 'src/Models/dto/user.dto';
import {
  ImageMimeType,
  joinedRoomDto,
  messageRoomDto,
  sendFileDto,
} from './dto/joinroom.dto';
import { checkUserMessages } from './utils/checkUserMessage';
import { fileSendValidation } from './validations/event.validations';

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
      await this.userModel.findOneAndUpdate(
        { username, 'Chats.chatroomid': roomid },
        { $set: { 'Chats.$.unseenMessages': 0 } },
      );
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
            $set: { lastMessage: { sender: username, message: message } },
          },
          { new: true },
        )
        .select('chatroomid users createdBy messages');
      const { isBothOnline, receiver } = checkUserMessages(data, username);
      if (!isBothOnline) {
        await this.userModel.findOneAndUpdate(
          { username: receiver, 'Chats.chatroomid': roomid },
          {
            $inc: { 'Chats.$.unseenMessages': 1 },
          },
        );
      }
      return { userData: data };
    } catch (error) {
      return { error: { status: 500, message: 'Server error' } };
    }
  }

  async sendFileinRoom(roomdata: sendFileDto) {
    const { error } = fileSendValidation(roomdata);
    if (error) {
      return { error };
    }
    const { mimeType, file, roomid, username } = roomdata;
    const ext = Object.keys(ImageMimeType).find(
      (l) => ImageMimeType[l] === mimeType,
    );
    const path = 'messages/' + Date.now() + '.' + ext;
    const buffer = Buffer.from(file).toString('base64');
    try {
      await writeFile('./' + path, buffer, { encoding: 'base64' }, (err) => {
        if (err) {
          throw new Error('File error');
        }
      });
      const user = await this.chatModel
        .findOneAndUpdate(
          { chatroomid: roomid },
          {
            $push: {
              messages: {
                senderUsername: username,
                filePath: path,
                isFile: true,
                message: '',
                mimeType,
              },
            },
            $set: {
              lastMessage: { sender: username, message: 'Sent a photo 📷️' },
            },
          },
          { new: true },
        )
        .select('chatroomid users createdBy messages');
      const { isBothOnline, receiver } = checkUserMessages(user, username);
      if (!isBothOnline) {
        await this.userModel.findOneAndUpdate(
          { username: receiver, 'Chats.chatroomid': roomid },
          {
            $inc: { 'Chats.$.unseenMessages': 1 },
          },
        );
      }
      return { userData: user };
    } catch (error) {
      return { error: { status: 500, message: 'Server issue' } };
    }
  }
}
