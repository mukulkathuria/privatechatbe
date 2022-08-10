import { Schema, Types } from 'mongoose';
import { uuid } from 'src/utils/uuid';
import { chatModelDto } from './dto/chatmodel.dto';

export const ChatRoomSchema = new Schema<chatModelDto>({
  _id: {
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  },
  chatroomid: {
    type: String,
    required: true,
    index: true,
    unique: true,
    min: 4,
    max: 255,
  },
  users: [
    {
      isOnline: {
        type: Boolean,
        default: false,
      },
      deletedChat: {
        type: Date,
      },
      lastOffline: {
        type: Date,
        default: Date.now,
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
  messages: [
    {
      _id: {
        type: Types.ObjectId,
        default: new Types.ObjectId(),
      },
      messageid: {
        type: String,
        default: uuid(),
      },
      senderUsername: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
        min: 1,
        max: 1024,
      },
      isFile: {
        type: Boolean,
        default: false,
      },
      filePath: {
        type: String,
        default: '',
      },
      mimeType: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
  createdUser: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
