import { UnsupportedMediaTypeException } from '@nestjs/common';
import { readdir, unlink } from 'fs';
import { join } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new UnsupportedMediaTypeException('Only image files are allowed!'),
      false,
    );
  }
  const { username } = req;
  removeUserPic(username as string);
  callback(null, true);
};

export const removeUserPic = (username: string) => {
  readdir('./userprofile', (err, files) => {
    if (err) {
      return { error: { status: 415, message: 'Cant delete the file' } };
    }

    files.forEach((file) => {
      if (new RegExp(username).test(file)) {
        unlink(join('./userprofile', file), (err) => {
          if (err) {
            return { error: { status: 415, message: 'File not found' } };
          }
          return {
            success: true,
          };
        });
      }
    });
  });
};
