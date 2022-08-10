export enum ImageMimeType {
  jpg = 'image/jpg',
  jpeg = 'image/jpeg',
  png = 'image/png',
}

export type joinedRoomDto = {
  roomid: string;
  username: string;
};

export interface messageRoomDto extends joinedRoomDto {
  message: string;
}

export interface sendFileDto extends joinedRoomDto {
  file: Buffer;
  mimeType: ImageMimeType;
}
