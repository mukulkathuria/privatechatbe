import { readdir, unlink } from 'fs';
import { join } from 'path';

export const removeMessagePics = () => {
  readdir('./messages', (err, files) => {
    if (err) {
      return { error: { status: 415, message: 'Cant delete the file' } };
    }

    files.forEach((file) => {
      unlink(join('./messages', file), (err) => {
        if (err) {
          return { error: { status: 415, message: 'File not found' } };
        }
        return {
          success: true,
        };
      });
    });
  });
};
