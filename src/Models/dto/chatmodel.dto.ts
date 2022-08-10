import { Document } from 'mongoose';

export type lastMessageDto = {
  sender: string;
  message: string;
};

export type UserLog = {
  isOnline: boolean;
  deletedChat: Date | unknown;
  lastOffline: Date | unknown;
  username: string;
};

export type MessagesDto = {
  _id?: string | unknown;
  messageid?: string;
  senderUsername: string;
  message: string;
  isFile?: boolean;
  filePath?: string;
  mimeType?: string;
  createdAt?: Date | unknown;
};

export interface chatModelDto extends Document {
  _id: string | unknown;
  chatroomid: string;
  users: Array<UserLog> | [];
  messages: Array<MessagesDto> | [];
  lastMessage: lastMessageDto;
  createdBy: string;
  createdAt: Date | unknown;
  createdUser: string;
}
