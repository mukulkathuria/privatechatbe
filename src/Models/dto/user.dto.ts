import { Document, PopulatedDoc } from 'mongoose';

export interface ChatRoomDto {
  user: PopulatedDoc<UserModelDto>;
  chatroomid: string;
  unseenMessages?: number;
}

export enum Role {
  Admin = 'Admin',
  Normal = 'Normal',
  Special = 'Special',
  Loved = 'Loved',
}

export interface UserModelDto extends Document {
  _id: string | unknown;
  name: string;
  username: string;
  password: string;
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
