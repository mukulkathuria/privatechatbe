import { Document, PopulatedDoc } from 'mongoose';
import { chatModelDto } from './chatmodel.dto';
export interface ChatRoomDto {
  user: PopulatedDoc<UserModelDto>;
  chatroomid: string;
  unseenMessages?: number;
  chatInfo: PopulatedDoc<chatModelDto>;
}

export enum Role {
  Admin = 'Admin',
  Normal = 'Normal',
  Special = 'Special',
  Loved = 'Loved',
}

export enum GenderEnum {
  male = 'Male',
  female = 'Female',
}

export interface UserModelDto extends Document {
  _id: string | unknown;
  name: string;
  username: string;
  password: string;
  gender: GenderEnum;
  Chats: Array<ChatRoomDto> | [];
  Contacts: Array<PopulatedDoc<UserModelDto>> | [];
  browser: string;
  userOs: string;
  profile: string;
  isIphone: boolean;
  roles: Role;
  lastLogin: Date | unknown;
  registerAt: Date | unknown;
}
