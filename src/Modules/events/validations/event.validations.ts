import { joinedRoomDto, messageRoomDto } from '../dto/joinroom.dto';

export const joinedRoomValidation = (roomdata: joinedRoomDto) => {
  const { roomid, username } = roomdata;
  if (!roomid) {
    return { error: { status: 422, message: 'Chat Room is required' } };
  } else if (!username || !username.trim().length) {
    return { error: { status: 422, message: 'Username is required' } };
  }
  return { user: roomdata };
};

export const messageRoomValidation = (roomdata: messageRoomDto) => {
  const { roomid, username, message } = roomdata;
  if (!roomid) {
    return { error: { status: 422, message: 'Chat Room is required' } };
  } else if (!username || !username.trim().length) {
    return { error: { status: 422, message: 'Username is required' } };
  } else if (!message || !message.trim().length) {
    return { error: { status: 422, message: 'Username is required' } };
  }
  return { user: roomdata };
};
