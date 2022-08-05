export type joinedRoomDto = {
  roomid: string;
  username: string;
};

export interface messageRoomDto extends joinedRoomDto {
  message: string;
}
