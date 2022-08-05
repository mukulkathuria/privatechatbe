import { diskStorage } from 'multer';

export const multerConfigUserProfile = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './userprofile');
  },
  filename: function (req: any, file, cb) {
    const { username } = req;
    const ext = file.originalname.match(/jpg|png|jpeg/i);
    cb(null, username + Date.now() + '.' + ext[0]);
  },
});
