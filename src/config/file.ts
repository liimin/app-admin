import { join,extname } from 'path';
import { diskStorage } from 'multer';

export default {
  root: join(__dirname, '../uploads'),
  storage: diskStorage({
    destination: join(__dirname, `../uploads/${new Date().toLocaleDateString()}`),
    filename: (req, file, cb) => {
      const deviceId = req.body.deviceId;
      // const name=file.originalname.split('.');
      // const filename = `${name[0]}-${new Date().getTime()}.${name.pop()}`//${file.mimetype.split('/')[1]}`;
      const path = `${file.originalname.split('.').shift()}@${deviceId}@${Date.now()}-${Math.round(Math.random() * 1e10)}${extname(file.originalname)}`
      return cb(null, path);
    },
  }),
};
