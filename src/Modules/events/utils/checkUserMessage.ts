import { chatModelDto, UserLog } from 'src/Models/dto/chatmodel.dto';

export const checkUserMessages = (data: chatModelDto, senderUser: string) => {
  const isBothOnline = data.users.every((l: UserLog) => l.isOnline);
  if (isBothOnline) {
    return { isBothOnline };
  }
  const username = data.users.find(
    (l: UserLog) => l.username !== senderUser,
  )?.username;
  return { receiver: username };
};
