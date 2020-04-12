import * as multer from 'multer';

require('dotenv').config({warnings: true});

// const appDir = path.dirname(require.main!.filename);
// export const upload = multer({ dest: appDir + '/' +  process.env.UPLOAD_PATH});
export const upload = multer({limits: {fileSize: Number(process.env.MANUSCRIPT_MAX_FILE_SIZE)}});
