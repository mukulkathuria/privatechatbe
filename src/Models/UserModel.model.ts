import { Schema, Types } from 'mongoose';
import { CHATDOCUMENT, USERDOCUMENT } from 'src/constants/mongoose.documents';
import { GenderEnum, Role, UserModelDto } from './dto/user.dto';

export const Userschema = new Schema<UserModelDto>({
  _id: {
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
    min: 3,
  },
  username: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  gender: {
    type: String,
    enum: GenderEnum,
    default: GenderEnum.male,
  },
  profile: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 1024,
  },
  Chats: [
    {
      user: {
        type: Types.ObjectId,
        ref: USERDOCUMENT,
      },
      chatroomid: {
        type: String,
        required: true,
        min: 4,
        max: 255,
      },
      unseenMessages: {
        type: Number,
        default: 0,
      },
      chatInfo: { type: Types.ObjectId, ref: CHATDOCUMENT },
    },
  ],
  Contacts: [{ type: Types.ObjectId, ref: USERDOCUMENT }],
  browser: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    enum: Role,
    default: Role.Normal,
  },
  isIphone: {
    type: Boolean,
    default: false,
  },
  userOs: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
});
